import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { generateTimeSlots } from '../../lib/slots';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { profesional_id, servicio_id, fecha } = await request.json();

    // 1. Get service duration
    const { data: servicio } = await supabase
      .from('servicios')
      .select('duracion_min')
      .eq('id', servicio_id)
      .single();

    if (!servicio) return new Response(JSON.stringify({ error: 'Servicio no encontrado' }), { status: 404 });

    // 2. Get schedule for that day
    const fechaObj = new Date(fecha);
    const diaSemana = fechaObj.getDay();

    const { data: horario } = await supabase
      .from('horarios')
      .select('hora_inicio, hora_fin')
      .eq('profesional_id', profesional_id)
      .eq('dia_semana', diaSemana)
      .eq('activo', true)
      .single();

    if (!horario) {
      return new Response(JSON.stringify({ slots: [], motivo: 'dia_no_laborable' }));
    }

    // 3. Get existing appointments
    const { data: citas } = await supabase
      .from('citas')
      .select('fecha_inicio, fecha_fin')
      .eq('profesional_id', profesional_id)
      .gte('fecha_inicio', `${fecha}T00:00:00`)
      .lte('fecha_inicio', `${fecha}T23:59:59`)
      .in('estado', ['pendiente', 'confirmada']);

    const formattedCitas = (citas || []).map(c => ({
      start: new Date(c.fecha_inicio),
      end: new Date(c.fecha_fin)
    }));

    // 4. Generate slots
    const slots = generateTimeSlots(
      horario.hora_inicio,
      horario.hora_fin,
      servicio.duracion_min,
      formattedCitas
    );

    return new Response(JSON.stringify({ slots }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
