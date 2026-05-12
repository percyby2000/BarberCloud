import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { salon_id, profesional_id, servicio_id, fecha, hora, cliente } = await request.json();

    // 1. Get service duration
    const { data: servicio } = await supabase
      .from('servicios')
      .select('duracion_min')
      .eq('id', servicio_id)
      .single();

    if (!servicio) throw new Error('Servicio no encontrado');

    const fechaInicio = new Date(`${fecha}T${hora}:00`);
    const fechaFin = new Date(fechaInicio.getTime() + servicio.duracion_min * 60000);

    // 2. Anti-race condition check
    const { data: conflicto } = await supabase
      .from('citas')
      .select('id')
      .eq('profesional_id', profesional_id)
      .in('estado', ['pendiente', 'confirmada'])
      .lt('fecha_inicio', fechaFin.toISOString())
      .gt('fecha_fin', fechaInicio.toISOString());

    if (conflicto && conflicto.length > 0) {
      return new Response(JSON.stringify({ error: 'El horario ya no está disponible.' }), { status: 409 });
    }

    // 3. Create appointment
    const { data: cita, error } = await supabase
      .from('citas')
      .insert({
        salon_id,
        profesional_id,
        servicio_id,
        cliente_nombre: cliente.nombre,
        cliente_telefono: cliente.telefono,
        cliente_email: cliente.email,
        cliente_notas: cliente.notas,
        fecha_inicio: fechaInicio.toISOString(),
        fecha_fin: fechaFin.toISOString(),
        estado: 'confirmada'
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, cita }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
