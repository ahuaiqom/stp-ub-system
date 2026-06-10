-- ============================================================
-- 000_schema_init.sql
-- ------------------------------------------------------------
-- Re-runnable, node-pg friendly version of stp_ub_db_dump.sql.
-- Runs via `npm run db:bootstrap` (or any pg client).
-- ============================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS public;

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  user_id      SERIAL PRIMARY KEY,
  username     VARCHAR(50)  NOT NULL,
  password     VARCHAR(255) NOT NULL,
  email        VARCHAR(100) NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL
);

-- ------------------------------------------------------------
-- PERTANIAN
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pertanian (
  pertanian_id          SERIAL PRIMARY KEY,
  komoditas             VARCHAR(100) NOT NULL,
  masa_tanam_bulan      INTEGER NOT NULL,
  masa_tanam_per_tahun  INTEGER NOT NULL,
  satuan                VARCHAR(50) NOT NULL,
  keterangan            TEXT,
  luas_usaha            NUMERIC(12,2) NOT NULL,
  proyeksi_panen        NUMERIC(12,2) NOT NULL,
  updated_by            INTEGER REFERENCES public.users(user_id)
);

-- ------------------------------------------------------------
-- PETERNAKAN
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.peternakan (
  peternakan_id     SERIAL PRIMARY KEY,
  komoditas         VARCHAR(100) NOT NULL,
  siklus_bulan      INTEGER NOT NULL,
  siklus_per_tahun  INTEGER NOT NULL,
  satuan            VARCHAR(50) NOT NULL,
  keterangan        TEXT,
  luas_usaha        NUMERIC(12,2) NOT NULL,
  jumlah            INTEGER NOT NULL,
  updated_by        INTEGER REFERENCES public.users(user_id)
);

-- ------------------------------------------------------------
-- KONSERVASI
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.konservasi (
  konservasi_id  SERIAL PRIMARY KEY,
  jenis_satwa    VARCHAR(100) NOT NULL,
  jumlah         INTEGER NOT NULL,
  satuan         VARCHAR(50) NOT NULL,
  foto           VARCHAR(255),
  keterangan     TEXT,
  updated_by     INTEGER REFERENCES public.users(user_id)
);

-- ------------------------------------------------------------
-- AKADEMIK
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.akademik (
  akademik_id        SERIAL PRIMARY KEY,
  nama_mahasiswa     VARCHAR(100) NOT NULL,
  dosen_pembimbing   VARCHAR(100) NOT NULL,
  program_studi      VARCHAR(100) NOT NULL,
  tanggal_mulai      DATE NOT NULL,
  tanggal_selesai    DATE NOT NULL,
  luasan             NUMERIC(10,2) NOT NULL,
  judul_penelitian   VARCHAR(255) NOT NULL,
  updated_by         INTEGER REFERENCES public.users(user_id)
);

-- ------------------------------------------------------------
-- KEMITRAAN
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.kemitraan (
  kemitraan_id          SERIAL PRIMARY KEY,
  nama_mitra            VARCHAR(100) NOT NULL,
  bidang_kerjasama      VARCHAR(200) NOT NULL,
  jangka_waktu_kontrak  VARCHAR(50)  NOT NULL,
  keterangan            TEXT,
  updated_by            INTEGER REFERENCES public.users(user_id)
);

-- ------------------------------------------------------------
-- Initial sample data (idempotent)
-- ------------------------------------------------------------
INSERT INTO public.users (user_id, username, password, email, nama_lengkap) VALUES
  (1, 'budi_santoso',  'hashed_pass_123', 'budi.santoso@kampus.ac.id',  'Budi Santoso'),
  (2, 'dina_karmila',  'hashed_pass_456', 'dina.karmila@kampus.ac.id',  'Dina Karmila'),
  (3, 'rizky_pratama', 'hashed_pass_789', 'rizky.pratama@kampus.ac.id', 'Rizky Pratama')
ON CONFLICT (user_id) DO NOTHING;

SELECT setval('public.users_user_id_seq', GREATEST((SELECT MAX(user_id) FROM public.users), 1));

INSERT INTO public.pertanian (pertanian_id, komoditas, masa_tanam_bulan, masa_tanam_per_tahun, satuan, keterangan, luas_usaha, proyeksi_panen, updated_by) VALUES
  (1,  'Melon - Golden Aroma',      3, 4, 'Kg', NULL,  700.00,  1500.00, 1),
  (2,  'Pepaya Calina (California)',1, 1, 'Kg', NULL, 4000.00, 16800.00, 2),
  (3,  'Kopi',                      1, 1, 'Kg', NULL, 6000.00,    90.00, 3),
  (4,  'Rambutan',                  1, 1, 'Kg', NULL, 2900.00,   300.00, 1),
  (5,  'Durian F1',                 1, 1, 'Kg', NULL, 1100.00,    40.00, 2),
  (6,  'Jagung Pakan',              4, 3, 'Kg', NULL, 6250.00, 24000.00, 3),
  (7,  'Jagung Manis',              3, 4, 'Kg', NULL, 2000.00,  1200.00, 1),
  (8,  'Cabai Rawit',               6, 2, 'Kg', NULL, 7500.00,  4000.00, 2),
  (9,  'Cabai Keriting GH 1 dan 2', 6, 2, 'Kg', NULL,  360.00,   450.00, 3),
  (10, 'Cabai Besar GH 3 dan 4',    6, 2, 'Kg', NULL,  360.00,   450.00, 1),
  (11, 'Kinanti GH 1 dan 2',        3, 4, 'Kg', NULL,  160.00,   180.00, 2),
  (12, 'Tomat',                     4, 3, 'Kg', NULL, 1200.00,  3000.00, 3),
  (13, 'Terong',                    6, 2, 'Kg', NULL, 1200.00,  2000.00, 1)
ON CONFLICT (pertanian_id) DO NOTHING;

SELECT setval('public.pertanian_pertanian_id_seq', GREATEST((SELECT MAX(pertanian_id) FROM public.pertanian), 1));

INSERT INTO public.peternakan (peternakan_id, komoditas, siklus_bulan, siklus_per_tahun, satuan, keterangan, luas_usaha, jumlah, updated_by) VALUES
  (1, 'Kambing',       1, 1, 'Ekor', NULL, 150.00,  8, 1),
  (2, 'Sapi (Qurban)', 1, 1, 'Ekor', NULL, 900.00, 18, 2)
ON CONFLICT (peternakan_id) DO NOTHING;

SELECT setval('public.peternakan_peternakan_id_seq', GREATEST((SELECT MAX(peternakan_id) FROM public.peternakan), 1));

INSERT INTO public.akademik (akademik_id, nama_mahasiswa, dosen_pembimbing, program_studi, tanggal_mulai, tanggal_selesai, luasan, judul_penelitian, updated_by) VALUES
  (1, 'Budi Santoso',  'Dr. Anita Wijaya',  'Sistem Informasi', '2025-09-01', '2026-03-15',   0.00,
      'Sistem Manajemen Reservasi Real-time dengan Fitur Jaminan Identitas Fisik', 1),
  (2, 'Citra Kirana',  'Prof. Hendra Kusuma','Sistem Informasi', '2026-02-10', '2026-08-10',   0.00,
      'Penerapan Digital Twin dan Model ADKAR pada Manajemen Layanan Kesehatan', 2),
  (3, 'Andi Dharma',   'Dr. Anita Wijaya',  'Sistem Informasi', '2025-11-01', '2026-05-20', 500.00,
      'Analisis NDVI dan Suhu Permukaan Menggunakan Google Earth Engine', 3)
ON CONFLICT (akademik_id) DO NOTHING;

SELECT setval('public.akademik_akademik_id_seq', GREATEST((SELECT MAX(akademik_id) FROM public.akademik), 1));

INSERT INTO public.kemitraan (kemitraan_id, nama_mitra, bidang_kerjasama, jangka_waktu_kontrak, keterangan, updated_by) VALUES
  (1, 'PT. Agro Nusantara Makmur',
      'Pemasaran dan Distribusi Hasil Panen', '2 Tahun',
      'Fokus pada penyerapan hasil panen jagung pakan dan komoditas peternakan.', 1),
  (2, 'Balai Pengkajian Teknologi Pertanian (BPTP) Jatim',
      'Riset dan Pengembangan Varietas Unggul', '5 Tahun',
      'Kerjasama penelitian strategis untuk pengembangan bibit melon dan cabai tahan cuaca ekstrem.', 2),
  (3, 'Koperasi Peternak Mandiri Sejahtera',
      'Pengadaan Bibit dan Pakan Konsentrat', '3 Tahun',
      'Penyediaan bibit sapi qurban dan kambing berkualitas, serta suplai pakan ternak bulanan.', 3),
  (4, 'CV. Teknologi Tani Cerdas',
      'Penyediaan Sistem Irigasi dan Smart Farming', '1 Tahun',
      'Pemasangan dan pemeliharaan sensor tanah serta sistem irigasi otomatis di lahan Greenhouse (GH).', 1)
ON CONFLICT (kemitraan_id) DO NOTHING;

SELECT setval('public.kemitraan_kemitraan_id_seq', GREATEST((SELECT MAX(kemitraan_id) FROM public.kemitraan), 1));

COMMIT;
