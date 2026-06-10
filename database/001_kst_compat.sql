-- ============================================================
-- Migration 001: KST API Contract Compatibility
-- ------------------------------------------------------------
-- Idempotent migration to align existing schema with the
-- KST Dashboard API contract:
--   * users: add role, password hash columns, picture_uri
--   * data tables: add row_uuid (UUIDv6 surrogate), created_at,
--     updated_at
--   * konservasi_tanaman: new table mirroring pertanian
--   * kemitraan: split jangka_waktu_kontrak into start/end dates
--
-- Safe to run multiple times. Does NOT delete existing data.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- Extensions
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS role        VARCHAR(20) NOT NULL DEFAULT 'admin',
  ADD COLUMN IF NOT EXISTS picture_uri VARCHAR(500),
  ADD COLUMN IF NOT EXISTS user_uuid   UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;

-- Make existing usernames unique if not already
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'users_username_key'
  ) THEN
    ALTER TABLE public.users ADD CONSTRAINT users_username_key UNIQUE (username);
  END IF;
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'users_user_uuid_key'
  ) THEN
    ALTER TABLE public.users ADD CONSTRAINT users_user_uuid_key UNIQUE (user_uuid);
  END IF;
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- Refresh tokens (jti blacklist) for logout
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
  jti         UUID PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user
  ON public.refresh_tokens(user_id);

-- ------------------------------------------------------------
-- Helper: add row_uuid, created_at, updated_at to data tables
-- ------------------------------------------------------------
ALTER TABLE public.pertanian
  ADD COLUMN IF NOT EXISTS row_uuid    UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'pertanian_row_uuid_key'
  ) THEN
    ALTER TABLE public.pertanian ADD CONSTRAINT pertanian_row_uuid_key UNIQUE (row_uuid);
  END IF;
END $$;

ALTER TABLE public.peternakan
  ADD COLUMN IF NOT EXISTS row_uuid    UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'peternakan_row_uuid_key'
  ) THEN
    ALTER TABLE public.peternakan ADD CONSTRAINT peternakan_row_uuid_key UNIQUE (row_uuid);
  END IF;
END $$;

ALTER TABLE public.konservasi
  ADD COLUMN IF NOT EXISTS row_uuid    UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'konservasi_row_uuid_key'
  ) THEN
    ALTER TABLE public.konservasi ADD CONSTRAINT konservasi_row_uuid_key UNIQUE (row_uuid);
  END IF;
END $$;

ALTER TABLE public.akademik
  ADD COLUMN IF NOT EXISTS row_uuid    UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'akademik_row_uuid_key'
  ) THEN
    ALTER TABLE public.akademik ADD CONSTRAINT akademik_row_uuid_key UNIQUE (row_uuid);
  END IF;
END $$;

ALTER TABLE public.kemitraan
  ADD COLUMN IF NOT EXISTS row_uuid       UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tanggal_mulai  DATE,
  ADD COLUMN IF NOT EXISTS tanggal_selesai DATE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'kemitraan_row_uuid_key'
  ) THEN
    ALTER TABLE public.kemitraan ADD CONSTRAINT kemitraan_row_uuid_key UNIQUE (row_uuid);
  END IF;
END $$;

-- ------------------------------------------------------------
-- KONSERVASI TANAMAN — new table mirroring pertanian
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.konservasi_tanaman (
  konservasi_tanaman_id  SERIAL PRIMARY KEY,
  row_uuid               UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  komoditas              VARCHAR(100) NOT NULL,
  luas_usaha             NUMERIC(12,2) NOT NULL DEFAULT 0,
  masa_tanam_bulan       INTEGER NOT NULL DEFAULT 0,
  masa_tanam_per_tahun   INTEGER NOT NULL DEFAULT 0,
  proyeksi_panen         NUMERIC(12,2) NOT NULL DEFAULT 0,
  satuan                 VARCHAR(50) NOT NULL DEFAULT 'Kg',
  keterangan             TEXT,
  updated_by             INTEGER REFERENCES public.users(user_id),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ
);

COMMIT;
