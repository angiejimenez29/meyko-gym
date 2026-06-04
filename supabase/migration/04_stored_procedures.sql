-- =========================================================
-- HANDLE UPDATED_AT
-- =========================================================

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- =========================================================
-- CREATE SESSION SPOTS
-- =========================================================

create or replace function public.create_session_spots()
returns trigger
language plpgsql
as $$
declare
    i integer;
begin

    for i in 1..new.capacity loop

        insert into public.session_spots (
            session_id,
            spot_number
        )
        values (
            new.id,
            i
        );

    end loop;

    return new;
end;
$$;

-- =========================================================
-- MARK SPOT RESERVED
-- =========================================================

create or replace function public.mark_spot_reserved()
returns trigger
language plpgsql
as $$
begin

    update public.session_spots
    set status = 'reserved'
    where id = new.spot_id;

    return new;
end;
$$;

-- =========================================================
-- CHECK IN SPOT
-- =========================================================

create or replace function public.check_in_spot(
    p_spot_id uuid
)
returns void
language plpgsql
security definer
as $$
begin

    update public.session_spots
    set status = 'present'
    where id = p_spot_id;

end;
$$;

-- =========================================================
-- REFUND RESERVATION
-- =========================================================

create or replace function public.refund_reservation(
    p_reservation_id uuid
)
returns void
language plpgsql
security definer
as $$
begin

    update public.reservations
    set
        status = 'refunded',
        refunded_at = now()
    where id = p_reservation_id;

    update public.payments
    set status = 'refunded'
    where reservation_id = p_reservation_id;

    update public.session_spots
    set status = 'available'
    where id in (
        select spot_id
        from public.reservation_spots
        where reservation_id = p_reservation_id
    );

end;
$$;

-- =========================================================
-- CREATE RESERVATION (ATOMIC)
-- =========================================================

create or replace function public.create_reservation(
    p_session_id uuid,
    p_client_name text,
    p_client_phone text,
    p_spot_ids uuid[]
)
returns uuid
language plpgsql
security definer
as $$
declare

    v_reservation_id uuid;
    v_price numeric(10,2);
    v_total numeric(10,2);
    v_spot_id uuid;

begin

    -- VALIDATE SPOTS

    if exists (
        select 1
        from public.session_spots
        where id = any(p_spot_ids)
        and status != 'available'
    ) then
        raise exception 'One or more spots are unavailable';
    end if;

    -- GET PRICE

    select price
    into v_price
    from public.sessions
    where id = p_session_id;

    -- TOTAL

    v_total := v_price * array_length(p_spot_ids, 1);

    -- CREATE RESERVATION

    insert into public.reservations (
        session_id,
        client_name,
        client_phone,
        total_amount,
        status
    )
    values (
        p_session_id,
        p_client_name,
        p_client_phone,
        v_total,
        'confirmed'
    )
    returning id into v_reservation_id;

    -- INSERT SPOTS

    foreach v_spot_id in array p_spot_ids
    loop

        insert into public.reservation_spots (
            reservation_id,
            spot_id
        )
        values (
            v_reservation_id,
            v_spot_id
        );

    end loop;

    -- CREATE PAYMENT

    insert into public.payments (
        reservation_id,
        amount,
        status
    )
    values (
        v_reservation_id,
        v_total,
        'paid'
    );

    return v_reservation_id;

end;
$$;

-- =========================================================
-- CREATE NEW USER
-- =========================================================

create view public.session_occupancy as
select
    s.id as session_id,

    s.capacity,

    count(ss.id)
        filter (
            where ss.status != 'available'
        ) as occupied_spots

from public.sessions s

left join public.session_spots ss
    on ss.session_id = s.id

group by s.id;

-- =========================================================
-- VIEW: SESSION OCCUPANCY
-- =========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

    insert into public.instructors (
        id,
        email
    )
    values (
        new.id,
        new.email
    );

    return new;

end;
$$;