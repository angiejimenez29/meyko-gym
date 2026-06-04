-- =========================================================
-- EXTENSIONS
-- =========================================================

create extension if not exists "pgcrypto";

-- =========================================================
-- ENUMS
-- =========================================================

create type session_status as enum (
    'draft',
    'published',
    'cancelled',
    'finished'
);

create type spot_status as enum (
    'available',
    'reserved',
    'present'
);

create type reservation_status as enum (
    'pending',
    'confirmed',
    'refunded'
);

create type payment_status as enum (
    'pending',
    'paid',
    'refunded',
    'failed'
);

create type payment_method as enum (
    'yape'
);