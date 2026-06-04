-- =========================================================
-- SEED DATA (Con Reservas Incluidas)
-- =========================================================

DO $$ 
DECLARE
    s1_id uuid := '11111111-1111-4111-a111-111111111111';
    s2_id uuid := '22222222-2222-4222-a222-222222222222';
    s3_id uuid := '33333333-3333-4333-a333-333333333333';
    s4_id uuid := '44444444-4444-4444-a444-444444444444';
    instr_id uuid := '82655f5b-1b30-4271-8f24-940b3552bbd5';
BEGIN
    -- 1. Aseguramos que el instructor tenga sus datos completos
    INSERT INTO public.instructors (id, full_name, email, whatsapp_phone, bio, years_experience)
    VALUES (
        instr_id, 
        'Carlos Entrenador', 
        'instructor@meikyogym.com', 
        '51999999999', 
        'Especialista en entrenamiento de alta intensidad (HIIT) y levantamiento olímpico. Te ayudaré a romper tus límites.', 
        8
    )
    ON CONFLICT (id) DO UPDATE SET 
        full_name = EXCLUDED.full_name,
        whatsapp_phone = EXCLUDED.whatsapp_phone,
        bio = EXCLUDED.bio,
        years_experience = EXCLUDED.years_experience;

    -- 2. Creamos sesiones con IDs fijos para poder referenciarlas en las reservas
    -- NOTA: Al insertar, se dispara el trigger 'create_session_spots' que crea los cupos automáticamente.
    INSERT INTO public.sessions (id, instructor_id, session_date, start_time, theme, price, whatsapp_contact, capacity, status)
    VALUES 
    (s1_id, instr_id, CURRENT_DATE + INTERVAL '1 day', '08:00:00', 'Full Body Intense', 25.00, '51999999999', 20, 'published'),
    (s2_id, instr_id, CURRENT_DATE + INTERVAL '1 day', '18:00:00', 'Cardio Core', 20.00, '51999999999', 40, 'published'),
    (s3_id, instr_id, CURRENT_DATE + INTERVAL '2 days', '10:00:00', 'Crossfit Basics', 30.00, '51999999999', 6, 'published'),
    (s4_id, instr_id, CURRENT_DATE + INTERVAL '3 days', '07:00:00', 'Yoga & Movilidad', 25.00, '51999999999', 15, 'published');

    -- 3. Creamos Reservas utilizando el Stored Procedure que ya tienes
    
    -- Reserva 1: Ocupamos 5 cupos en la Sesión 1 para ver el avance en la barra de progreso
    PERFORM public.create_reservation(
        s1_id,
        'María Gómez (Grupo)',
        '51912345678',
        array(SELECT id FROM public.session_spots WHERE session_id = s1_id LIMIT 5)
    );

    -- Reserva 2: Ocupamos 4 cupos en la Sesión 3 (que tiene capacidad 6).
    -- Esto dejará solo 2 cupos disponibles, lo que activará el badge de "¡Últimos 2 cupos!"
    PERFORM public.create_reservation(
        s3_id,
        'Juan Pérez y Amigos',
        '51987654321',
        array(SELECT id FROM public.session_spots WHERE session_id = s3_id LIMIT 4)
    );

    -- Reserva 3: Ocupamos 1 cupo adicional en la Sesión 1
    PERFORM public.create_reservation(
        s1_id,
        'Ana López',
        '51955555555',
        array(SELECT id FROM public.session_spots WHERE session_id = s1_id AND status = 'available' LIMIT 1)
    );

END $$;
