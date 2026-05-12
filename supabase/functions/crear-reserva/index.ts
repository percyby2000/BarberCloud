// Crea una cita validando disponibilidad y dispara notificaciones
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { profesional_id, servicio_id, salon_id, fecha, hora, cliente } = body
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    
    // 1. Validar que el slot sigue disponible (anti-race condition)
    const { data: servicio } = await supabase
      .from('servicios').select('duracion_min').eq('id', servicio_id).single()
    
    const fechaInicio = new Date(`${fecha}T${hora}:00`)
    const fechaFin = new Date(fechaInicio.getTime() + servicio!.duracion_min * 60000)
    
    const { data: conflicto } = await supabase
      .from('citas')
      .select('id')
      .eq('profesional_id', profesional_id)
      .in('estado', ['pendiente', 'confirmada'])
      .lt('fecha_inicio', fechaFin.toISOString())
      .gt('fecha_fin', fechaInicio.toISOString())
    
    if (conflicto && conflicto.length > 0) {
      return new Response(
        JSON.stringify({ error: 'El horario ya no está disponible. Por favor elegí otro.' }),
        { status: 409, headers: corsHeaders }
      )
    }
    
    // 2. Crear la cita
    const { data: cita, error } = await supabase
      .from('citas')
      .insert({
        salon_id, profesional_id, servicio_id,
        cliente_nombre: cliente.nombre,
        cliente_telefono: cliente.telefono,
        cliente_email: cliente.email,
        cliente_notas: cliente.notas,
        fecha_inicio: fechaInicio.toISOString(),
        fecha_fin: fechaFin.toISOString(),
        estado: 'confirmada'
      })
      .select()
      .single()
    
    if (error) throw error
    
    // 3. (Opcional) Notificaciones asíncronas...
    
    return new Response(JSON.stringify({ cita }), { 
      status: 201, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
