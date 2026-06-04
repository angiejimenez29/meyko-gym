-- =========================================================
-- ENABLE RLS
-- =========================================================

alter table public.instructors enable row level security;
alter table public.sessions enable row level security;
alter table public.session_spots enable row level security;
alter table public.reservations enable row level security;
alter table public.reservation_spots enable row level security;
alter table public.payments enable row level security;

-- =========================================================
-- INSTRUCTORS
-- =========================================================

create policy "Public can view instructors"
on public.instructors
for select
using (true);

create policy "Instructor can update own profile"
on public.instructors
for update
using (
    auth.uid() = id
);

-- =========================================================
-- SESSIONS
-- =========================================================

create policy "Public can view published sessions"
on public.sessions
for select
using (
    status = 'published'
);

create policy "Instructor can create own sessions"
on public.sessions
for insert
with check (
    auth.uid() = instructor_id
);

create policy "Instructor can update own sessions"
on public.sessions
for update
using (
    auth.uid() = instructor_id
);

create policy "Instructor can delete own sessions"
on public.sessions
for delete
using (
    auth.uid() = instructor_id
);

-- =========================================================
-- SESSION SPOTS
-- =========================================================

create policy "Public can view session spots"
on public.session_spots
for select
using (
    exists (
        select 1
        from public.sessions s
        where s.id = session_spots.session_id
        and s.status = 'published'
    )
);

create policy "Instructor manages own spots"
on public.session_spots
for all
using (
    exists (
        select 1
        from public.sessions s
        where s.id = session_spots.session_id
        and s.instructor_id = auth.uid()
    )
);

-- =========================================================
-- RESERVATIONS
-- =========================================================

create policy "Anyone can create reservations"
on public.reservations
for insert
with check (true);

create policy "Instructor can view reservations"
on public.reservations
for select
using (
    exists (
        select 1
        from public.sessions s
        where s.id = reservations.session_id
        and s.instructor_id = auth.uid()
    )
);

-- =========================================================
-- RESERVATION SPOTS
-- =========================================================

create policy "Anyone can reserve spots"
on public.reservation_spots
for insert
with check (true);

create policy "Instructor can view reservation spots"
on public.reservation_spots
for select
using (
    exists (
        select 1
        from public.reservations r
        join public.sessions s
            on s.id = r.session_id
        where r.id = reservation_spots.reservation_id
        and s.instructor_id = auth.uid()
    )
);

-- =========================================================
-- PAYMENTS
-- =========================================================

create policy "Anyone can create payments"
on public.payments
for insert
with check (true);

create policy "Instructor can view payments"
on public.payments
for select
using (
    exists (
        select 1
        from public.reservations r
        join public.sessions s
            on s.id = r.session_id
        where r.id = payments.reservation_id
        and s.instructor_id = auth.uid()
    )
);