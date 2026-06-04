-- =========================================================
-- UPDATED_AT TRIGGERS
-- =========================================================

create trigger set_instructors_updated_at
before update on public.instructors
for each row
execute function public.handle_updated_at();

create trigger set_sessions_updated_at
before update on public.sessions
for each row
execute function public.handle_updated_at();

-- =========================================================
-- CREATE SPOTS TRIGGER
-- =========================================================

create trigger create_spots_after_session_insert
after insert on public.sessions
for each row
execute function public.create_session_spots();

-- =========================================================
-- MARK RESERVED SPOT TRIGGER
-- =========================================================

create trigger trigger_mark_spot_reserved
after insert on public.reservation_spots
for each row
execute function public.mark_spot_reserved();

-- =========================================================
-- CREATE NEW USER TRIGGER
-- =========================================================

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();