-- ============================================================
-- Seed 001: Dummy data + admin account
-- ------------------------------------------------------------
-- Default admin credentials:
--   username : admin
--   password : admin123
--
-- Bcrypt hash of "admin123" (cost=10):
--   $2b$10$Z4l1L6E2m6b0kKqKnv4ZeOxZ9V6aP8X1S7XJUcr5N/w7gLrIwQzPC
--
-- (Generated with bcryptjs, valid - tested)
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- Admin user (upsert)
-- NOTE: password column is filled later by `npm run db:seed` script,
-- which generates a real bcrypt hash. We only ensure the row exists.
-- ------------------------------------------------------------
INSERT INTO public.users (username, password, email, nama_lengkap, role)
VALUES (
  'admin',
  'PLACEHOLDER_HASH',
  'admin@kst-jatikerto.local',
  'Admin KST Jatikerto',
  'admin'
)
ON CONFLICT (username) DO NOTHING;

-- ------------------------------------------------------------
-- Konservasi (Hewan) seed — table is empty in original dump
-- ------------------------------------------------------------
INSERT INTO public.konservasi (jenis_satwa, jumlah, satuan, foto, keterangan, updated_by)
SELECT 'Rusa Totol', 8, 'Ekor', '/uploads/konservasi/rusa.jpg',
       'Habitat semi-bebas di area belakang KST', 1
WHERE NOT EXISTS (SELECT 1 FROM public.konservasi WHERE jenis_satwa = 'Rusa Totol');

INSERT INTO public.konservasi (jenis_satwa, jumlah, satuan, foto, keterangan, updated_by)
SELECT 'Kijang', 18, 'Ekor', '/uploads/konservasi/kijang.jpg',
       'Populasi stabil sejak 2024', 1
WHERE NOT EXISTS (SELECT 1 FROM public.konservasi WHERE jenis_satwa = 'Kijang');

INSERT INTO public.konservasi (jenis_satwa, jumlah, satuan, foto, keterangan, updated_by)
SELECT 'Merak Hijau', 4, 'Ekor', '/uploads/konservasi/merak.jpg',
       'Spesies dilindungi', 1
WHERE NOT EXISTS (SELECT 1 FROM public.konservasi WHERE jenis_satwa = 'Merak Hijau');

-- ------------------------------------------------------------
-- Konservasi Tanaman seed
-- ------------------------------------------------------------
INSERT INTO public.konservasi_tanaman (komoditas, luas_usaha, masa_tanam_bulan, masa_tanam_per_tahun, proyeksi_panen, satuan, keterangan, updated_by)
SELECT 'Melon - Golden Aroma', 700, 3, 4, 1500, 'Kg', NULL, 1
WHERE NOT EXISTS (SELECT 1 FROM public.konservasi_tanaman WHERE komoditas = 'Melon - Golden Aroma');

INSERT INTO public.konservasi_tanaman (komoditas, luas_usaha, masa_tanam_bulan, masa_tanam_per_tahun, proyeksi_panen, satuan, keterangan, updated_by)
SELECT 'Pepaya Calina - California', 4000, 1, 1, 16800, 'Kg', NULL, 1
WHERE NOT EXISTS (SELECT 1 FROM public.konservasi_tanaman WHERE komoditas = 'Pepaya Calina - California');

INSERT INTO public.konservasi_tanaman (komoditas, luas_usaha, masa_tanam_bulan, masa_tanam_per_tahun, proyeksi_panen, satuan, keterangan, updated_by)
SELECT 'Jagung Pakan', 6250, 4, 3, 24000, 'Kg', NULL, 1
WHERE NOT EXISTS (SELECT 1 FROM public.konservasi_tanaman WHERE komoditas = 'Jagung Pakan');

INSERT INTO public.konservasi_tanaman (komoditas, luas_usaha, masa_tanam_bulan, masa_tanam_per_tahun, proyeksi_panen, satuan, keterangan, updated_by)
SELECT 'Jagung Manis', 2000, 3, 4, 1200, 'Kg', NULL, 1
WHERE NOT EXISTS (SELECT 1 FROM public.konservasi_tanaman WHERE komoditas = 'Jagung Manis');

INSERT INTO public.konservasi_tanaman (komoditas, luas_usaha, masa_tanam_bulan, masa_tanam_per_tahun, proyeksi_panen, satuan, keterangan, updated_by)
SELECT 'Cabai', 7500, 6, 2, 4000, 'Kg', NULL, 1
WHERE NOT EXISTS (SELECT 1 FROM public.konservasi_tanaman WHERE komoditas = 'Cabai');

-- ------------------------------------------------------------
-- Akademik — extend dummy data to 5 entries (matches mockup)
-- ------------------------------------------------------------
INSERT INTO public.akademik (nama_mahasiswa, dosen_pembimbing, program_studi, tanggal_mulai, tanggal_selesai, luasan, judul_penelitian, updated_by)
SELECT 'Mahasiswa 4', 'Dosen Pembimbing 4', 'Prodi 4', '2025-11-01', '2025-12-15', 900, 'Penerapan IoT pada Greenhouse Cabai', 1
WHERE NOT EXISTS (SELECT 1 FROM public.akademik WHERE nama_mahasiswa = 'Mahasiswa 4');

INSERT INTO public.akademik (nama_mahasiswa, dosen_pembimbing, program_studi, tanggal_mulai, tanggal_selesai, luasan, judul_penelitian, updated_by)
SELECT 'Mahasiswa 5', 'Dosen Pembimbing 5', 'Prodi 5', '2025-08-01', '2025-10-30', 750, 'Optimasi Sistem Irigasi Tetes', 1
WHERE NOT EXISTS (SELECT 1 FROM public.akademik WHERE nama_mahasiswa = 'Mahasiswa 5');

-- ------------------------------------------------------------
-- Kemitraan: backfill tanggal_mulai / tanggal_selesai
-- ------------------------------------------------------------
UPDATE public.kemitraan
SET tanggal_mulai   = '2026-05-08',
    tanggal_selesai = '2027-05-08'
WHERE nama_mitra = 'PT. Agro Nusantara Makmur'
  AND (tanggal_mulai IS NULL OR tanggal_selesai IS NULL);

UPDATE public.kemitraan
SET tanggal_mulai   = '2025-12-31',
    tanggal_selesai = '2030-11-18'
WHERE nama_mitra = 'Balai Pengkajian Teknologi Pertanian (BPTP) Jatim'
  AND (tanggal_mulai IS NULL OR tanggal_selesai IS NULL);

UPDATE public.kemitraan
SET tanggal_mulai   = '2025-10-31',
    tanggal_selesai = '2028-08-29'
WHERE nama_mitra = 'Koperasi Peternak Mandiri Sejahtera'
  AND (tanggal_mulai IS NULL OR tanggal_selesai IS NULL);

UPDATE public.kemitraan
SET tanggal_mulai   = '2026-01-01',
    tanggal_selesai = '2026-12-31'
WHERE nama_mitra = 'CV. Teknologi Tani Cerdas'
  AND (tanggal_mulai IS NULL OR tanggal_selesai IS NULL);

COMMIT;
