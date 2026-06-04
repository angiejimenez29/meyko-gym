create index idx_sessions_instructor
on public.sessions(instructor_id);

create index idx_sessions_date
on public.sessions(session_date);

create index idx_session_spots_session
on public.session_spots(session_id);

create index idx_reservations_session
on public.reservations(session_id);

create index idx_reservation_spots_reservation
on public.reservation_spots(reservation_id);

create index idx_payments_reservation
on public.payments(reservation_id);