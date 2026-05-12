-- SEED DATA FOR TESTING
INSERT INTO auth.users (id, email, encrypted_password)
VALUES (gen_random_uuid(), 'admin@reservasimple.com', 'dummy_password'); -- Not really how you do it in Supabase, but for logic

-- 1. Create a Salon
INSERT INTO salones (nombre, slug, descripcion, color_primario, owner_id)
VALUES ('Barbería Elite', 'elite', 'Los mejores cortes de la ciudad con un estilo premium.', '#e63946', '00000000-0000-0000-0000-000000000000'); -- Replace with real ID

-- 2. Create Professionals
INSERT INTO profesionales (salon_id, nombre, apellido, especialidades)
VALUES 
((SELECT id FROM salones WHERE slug = 'elite'), 'Nico', 'García', ARRAY['Cortes', 'Barba']),
((SELECT id FROM salones WHERE slug = 'elite'), 'Ana', 'Pérez', ARRAY['Coloración', 'Styling']);

-- 3. Create Services
INSERT INTO servicios (salon_id, nombre, descripcion, duracion_min, precio)
VALUES 
((SELECT id FROM salones WHERE slug = 'elite'), 'Corte Clásico', 'Corte con tijera o máquina + lavado.', 30, 1500),
((SELECT id FROM salones WHERE slug = 'elite'), 'Barba Premium', 'Perfilado con toalla caliente y navaja.', 30, 1000),
((SELECT id FROM salones WHERE slug = 'elite'), 'Corte + Barba', 'Combo completo de estilo.', 60, 2200);

-- 4. Associate Professionals and Services
INSERT INTO profesional_servicios (profesional_id, servicio_id)
SELECT p.id, s.id FROM profesionales p, servicios s WHERE p.nombre = 'Nico' AND s.nombre IN ('Corte Clásico', 'Barba Premium', 'Corte + Barba');

-- 5. Create Schedules (Mon-Fri 09:00 to 18:00)
INSERT INTO horarios (profesional_id, dia_semana, hora_inicio, hora_fin)
SELECT id, d, '09:00:00', '18:00:00'
FROM profesionales, generate_series(1, 5) AS d;
