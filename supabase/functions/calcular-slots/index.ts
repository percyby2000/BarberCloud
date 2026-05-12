// Calcula los horarios disponibles para un profesional en una fecha dada
// Considera: horario semanal, excepciones, citas existentes y duración del servicio

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { profesional_id, servicio_id, fecha } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    
    // 1. Obtener duración del servicio
    const { data: servicio } = await supabase
      .from('servicios')
      .select('duracion_min')
      .eq('id', servicio_id)
      .single()
    
    if (!servicio) throw new Error('Servicio no encontrado')

    // 2. Obtener horario del día para ese profesional
    const fechaObj = new Date(fecha)
    const diaSemana = fechaObj.getDay()
    
    const { data: horario } = await supabase
      .from('horarios')
      .select('hora_inicio, hora_fin')
      .eq('profesional_id', profesional_id)
      .eq('dia_semana', diaSemana)
      .eq('activo', true)
      .single()
    
    if (!horario) {
      return new Response(JSON.stringify({ slots: [], motivo: 'dia_no_laborable' }), { headers: corsHeaders })
    }
    
    // 3. Verificar excepciones (día libre)
    const { data: excepcion } = await supabase
      .from('excepciones_horario')
      .select('tipo, hora_inicio, hora_fin')
      .eq('profesional_id', profesional_id)
      .eq('fecha', fecha)
      .single()
    
    if (excepcion?.tipo === 'dia_libre') {
      return new Response(JSON.stringify({ slots: [], motivo: 'dia_libre' }), { headers: corsHeaders })
    }
    
    const horaInicio = excepcion?.hora_inicio ?? horario.hora_inicio
    const horaFin = excepcion?.hora_fin ?? horario.hora_fin
    
    // 4. Obtener citas ya reservadas ese día
    const { data: citasExistentes } = await supabase
      .from('citas')
      .select('fecha_inicio, fecha_fin')
      .eq('profesional_id', profesional_id)
      .gte('fecha_inicio', `${fecha}T00:00:00`)
      .lte('fecha_inicio', `${fecha}T23:59:59`)
      .in('estado', ['pendiente', 'confirmada'])
    
    // 5. Generar slots libres (lógica de intervalo)
    const slots = generarSlots(horaInicio, horaFin, servicio.duracion_min, citasExistentes ?? [])
    
    return new Response(JSON.stringify({ slots }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})

function generarSlots(inicio: string, fin: string, duracion: number, citas: any[]) {
  const slots: string[] = []
  const [hI, mI] = inicio.split(':').map(Number)
  const [hF, mF] = fin.split(':').map(Number)
  
  let minActual = hI * 60 + mI
  const minFin = hF * 60 + mF
  
  while (minActual + duracion <= minFin) {
    const slotInicio = minActual
    const slotFin = minActual + duracion
    
    const ocupado = citas.some(cita => {
      const citaInicio = timeToMinutes(cita.fecha_inicio)
      const citaFin = timeToMinutes(cita.fecha_fin)
      return slotInicio < citaFin && slotFin > citaInicio
    })
    
    if (!ocupado) {
      slots.push(minutesToTime(minActual))
    }
    
    minActual += 30 // Intervalos de 30 minutos
  }
  
  return slots
}

function timeToMinutes(iso: string): number {
  const d = new Date(iso)
  return d.getHours() * 60 + d.getMinutes()
}

function minutesToTime(min: number): string {
  const h = Math.floor(min / 60).toString().padStart(2, '0')
  const m = (min % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}
