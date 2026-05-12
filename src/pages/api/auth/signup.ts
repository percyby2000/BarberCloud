import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password, nombreSalon } = await request.json();
    console.log('--- Iniciando Registro de Usuario ---');
    console.log('Email:', email);
    
    const supabaseAdmin = getSupabaseAdmin();
    console.log('Admin Client inicializado');

    // 1. Create user in Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      console.error('Error Auth Admin:', authError);
      throw authError;
    }

    const user = authData.user;
    console.log('Usuario creado ID:', user.id);
    const slug = nombreSalon.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // 2. Create the salon using admin privileges (bypasses RLS)
    console.log('Insertando salón con slug:', slug);
    const { error: salonError } = await supabaseAdmin
      .from('salones')
      .insert({
        nombre: nombreSalon,
        slug,
        owner_id: user.id
      });

    if (salonError) {
      console.error('Error al insertar salón:', salonError);
      throw salonError;
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
