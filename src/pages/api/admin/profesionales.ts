import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const supabase = getSupabaseAdmin();

    const { data: prof, error } = await supabase
      .from('profesionales')
      .insert({
        salon_id: data.salon_id,
        nombre: data.nombre,
        apellido: data.apellido,
        bio: data.bio,
        email: data.email,
        telefono: data.telefono,
        especialidades: data.especialidades,
        activo: true
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, prof }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
