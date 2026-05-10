--
-- PostgreSQL database dump
--

\restrict hOTIKGvX8Y1cdZT2DZxNYtdtaFe6Nqh9JKfS6ezDSOgPkIYiWjezsLvrYIGOCNz

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-10 16:31:47

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 16460)
-- Name: akademik; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.akademik (
    akademik_id integer NOT NULL,
    nama_mahasiswa character varying(100) NOT NULL,
    dosen_pembimbing character varying(100) NOT NULL,
    program_studi character varying(100) NOT NULL,
    tanggal_mulai date NOT NULL,
    tanggal_selesai date NOT NULL,
    luasan numeric(10,2) NOT NULL,
    judul_penelitian character varying(255) NOT NULL,
    updated_by integer
);


ALTER TABLE public.akademik OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16459)
-- Name: akademik_akademik_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.akademik_akademik_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.akademik_akademik_id_seq OWNER TO postgres;

--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 227
-- Name: akademik_akademik_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.akademik_akademik_id_seq OWNED BY public.akademik.akademik_id;


--
-- TOC entry 230 (class 1259 OID 16482)
-- Name: kemitraan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kemitraan (
    kemitraan_id integer NOT NULL,
    nama_mitra character varying(100) NOT NULL,
    bidang_kerjasama character varying(200) NOT NULL,
    jangka_waktu_kontrak character varying(50) NOT NULL,
    keterangan text,
    updated_by integer
);


ALTER TABLE public.kemitraan OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16481)
-- Name: kemitraan_kemitraan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kemitraan_kemitraan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kemitraan_kemitraan_id_seq OWNER TO postgres;

--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 229
-- Name: kemitraan_kemitraan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kemitraan_kemitraan_id_seq OWNED BY public.kemitraan.kemitraan_id;


--
-- TOC entry 226 (class 1259 OID 16442)
-- Name: konservasi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.konservasi (
    konservasi_id integer NOT NULL,
    jenis_satwa character varying(100) NOT NULL,
    jumlah integer NOT NULL,
    satuan character varying(50) NOT NULL,
    foto character varying(255),
    keterangan text,
    updated_by integer
);


ALTER TABLE public.konservasi OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16441)
-- Name: konservasi_konservasi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.konservasi_konservasi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.konservasi_konservasi_id_seq OWNER TO postgres;

--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 225
-- Name: konservasi_konservasi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.konservasi_konservasi_id_seq OWNED BY public.konservasi.konservasi_id;


--
-- TOC entry 222 (class 1259 OID 16400)
-- Name: pertanian; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pertanian (
    pertanian_id integer NOT NULL,
    komoditas character varying(100) NOT NULL,
    masa_tanam_bulan integer NOT NULL,
    masa_tanam_per_tahun integer NOT NULL,
    satuan character varying(50) NOT NULL,
    keterangan text,
    luas_usaha numeric(12,2) NOT NULL,
    proyeksi_panen numeric(12,2) NOT NULL,
    updated_by integer
);


ALTER TABLE public.pertanian OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16399)
-- Name: pertanian_pertanian_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pertanian_pertanian_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pertanian_pertanian_id_seq OWNER TO postgres;

--
-- TOC entry 5072 (class 0 OID 0)
-- Dependencies: 221
-- Name: pertanian_pertanian_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pertanian_pertanian_id_seq OWNED BY public.pertanian.pertanian_id;


--
-- TOC entry 224 (class 1259 OID 16421)
-- Name: peternakan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.peternakan (
    peternakan_id integer NOT NULL,
    komoditas character varying(100) NOT NULL,
    siklus_bulan integer NOT NULL,
    siklus_per_tahun integer NOT NULL,
    satuan character varying(50) NOT NULL,
    keterangan text,
    luas_usaha numeric(12,2) NOT NULL,
    jumlah integer NOT NULL,
    updated_by integer
);


ALTER TABLE public.peternakan OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16420)
-- Name: peternakan_peternakan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.peternakan_peternakan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.peternakan_peternakan_id_seq OWNER TO postgres;

--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 223
-- Name: peternakan_peternakan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.peternakan_peternakan_id_seq OWNED BY public.peternakan.peternakan_id;


--
-- TOC entry 220 (class 1259 OID 16386)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    nama_lengkap character varying(100) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16385)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4885 (class 2604 OID 16463)
-- Name: akademik akademik_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.akademik ALTER COLUMN akademik_id SET DEFAULT nextval('public.akademik_akademik_id_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 16485)
-- Name: kemitraan kemitraan_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kemitraan ALTER COLUMN kemitraan_id SET DEFAULT nextval('public.kemitraan_kemitraan_id_seq'::regclass);


--
-- TOC entry 4884 (class 2604 OID 16445)
-- Name: konservasi konservasi_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.konservasi ALTER COLUMN konservasi_id SET DEFAULT nextval('public.konservasi_konservasi_id_seq'::regclass);


--
-- TOC entry 4882 (class 2604 OID 16403)
-- Name: pertanian pertanian_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pertanian ALTER COLUMN pertanian_id SET DEFAULT nextval('public.pertanian_pertanian_id_seq'::regclass);


--
-- TOC entry 4883 (class 2604 OID 16424)
-- Name: peternakan peternakan_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peternakan ALTER COLUMN peternakan_id SET DEFAULT nextval('public.peternakan_peternakan_id_seq'::regclass);


--
-- TOC entry 4881 (class 2604 OID 16389)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 5060 (class 0 OID 16460)
-- Dependencies: 228
-- Data for Name: akademik; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.akademik (akademik_id, nama_mahasiswa, dosen_pembimbing, program_studi, tanggal_mulai, tanggal_selesai, luasan, judul_penelitian, updated_by) FROM stdin;
1	Budi Santoso	Dr. Anita Wijaya	Sistem Informasi	2025-09-01	2026-03-15	0.00	Sistem Manajemen Reservasi Real-time dengan Fitur Jaminan Identitas Fisik	1
2	Citra Kirana	Prof. Hendra Kusuma	Sistem Informasi	2026-02-10	2026-08-10	0.00	Penerapan Digital Twin dan Model ADKAR pada Manajemen Layanan Kesehatan	2
3	Andi Dharma	Dr. Anita Wijaya	Sistem Informasi	2025-11-01	2026-05-20	500.00	Analisis NDVI dan Suhu Permukaan Menggunakan Google Earth Engine	3
\.


--
-- TOC entry 5062 (class 0 OID 16482)
-- Dependencies: 230
-- Data for Name: kemitraan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kemitraan (kemitraan_id, nama_mitra, bidang_kerjasama, jangka_waktu_kontrak, keterangan, updated_by) FROM stdin;
1	PT. Agro Nusantara Makmur	Pemasaran dan Distribusi Hasil Panen	2 Tahun	Fokus pada penyerapan hasil panen jagung pakan dan komoditas peternakan.	1
2	Balai Pengkajian Teknologi Pertanian (BPTP) Jatim	Riset dan Pengembangan Varietas Unggul	5 Tahun	Kerjasama penelitian strategis untuk pengembangan bibit melon dan cabai tahan cuaca ekstrem.	2
3	Koperasi Peternak Mandiri Sejahtera	Pengadaan Bibit dan Pakan Konsentrat	3 Tahun	Penyediaan bibit sapi qurban dan kambing berkualitas, serta suplai pakan ternak bulanan.	3
4	CV. Teknologi Tani Cerdas	Penyediaan Sistem Irigasi dan Smart Farming	1 Tahun	Pemasangan dan pemeliharaan sensor tanah serta sistem irigasi otomatis di lahan Greenhouse (GH).	1
\.


--
-- TOC entry 5058 (class 0 OID 16442)
-- Dependencies: 226
-- Data for Name: konservasi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.konservasi (konservasi_id, jenis_satwa, jumlah, satuan, foto, keterangan, updated_by) FROM stdin;
\.


--
-- TOC entry 5054 (class 0 OID 16400)
-- Dependencies: 222
-- Data for Name: pertanian; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pertanian (pertanian_id, komoditas, masa_tanam_bulan, masa_tanam_per_tahun, satuan, keterangan, luas_usaha, proyeksi_panen, updated_by) FROM stdin;
1	Melon - Golden Aroma	3	4	Kg	\N	700.00	1500.00	1
2	Pepaya Calina (California)	1	1	Kg	\N	4000.00	16800.00	2
3	Kopi	1	1	Kg	\N	6000.00	90.00	3
4	Rambutan	1	1	Kg	\N	2900.00	300.00	1
5	Durian F1	1	1	Kg	\N	1100.00	40.00	2
6	Jagung Pakan	4	3	Kg	\N	6250.00	24000.00	3
7	Jagung Manis	3	4	Kg	\N	2000.00	1200.00	1
8	Cabai Rawit	6	2	Kg	\N	7500.00	4000.00	2
9	Cabai Keriting GH 1 dan 2	6	2	Kg	\N	360.00	450.00	3
10	Cabai Besar GH 3 dan 4	6	2	Kg	\N	360.00	450.00	1
11	Kinanti GH 1 dan 2	3	4	Kg	\N	160.00	180.00	2
12	Tomat	4	3	Kg	\N	1200.00	3000.00	3
13	Terong	6	2	Kg	\N	1200.00	2000.00	1
\.


--
-- TOC entry 5056 (class 0 OID 16421)
-- Dependencies: 224
-- Data for Name: peternakan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.peternakan (peternakan_id, komoditas, siklus_bulan, siklus_per_tahun, satuan, keterangan, luas_usaha, jumlah, updated_by) FROM stdin;
1	Kambing	1	1	Ekor	\N	150.00	8	1
2	Sapi (Qurban)	1	1	Ekor	\N	900.00	18	2
\.


--
-- TOC entry 5052 (class 0 OID 16386)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, password, email, nama_lengkap) FROM stdin;
1	budi_santoso	hashed_pass_123	budi.santoso@kampus.ac.id	Budi Santoso
2	dina_karmila	hashed_pass_456	dina.karmila@kampus.ac.id	Dina Karmila
3	rizky_pratama	hashed_pass_789	rizky.pratama@kampus.ac.id	Rizky Pratama
\.


--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 227
-- Name: akademik_akademik_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.akademik_akademik_id_seq', 3, true);


--
-- TOC entry 5076 (class 0 OID 0)
-- Dependencies: 229
-- Name: kemitraan_kemitraan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kemitraan_kemitraan_id_seq', 4, true);


--
-- TOC entry 5077 (class 0 OID 0)
-- Dependencies: 225
-- Name: konservasi_konservasi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.konservasi_konservasi_id_seq', 1, false);


--
-- TOC entry 5078 (class 0 OID 0)
-- Dependencies: 221
-- Name: pertanian_pertanian_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pertanian_pertanian_id_seq', 13, true);


--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 223
-- Name: peternakan_peternakan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.peternakan_peternakan_id_seq', 2, true);


--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- TOC entry 4896 (class 2606 OID 16475)
-- Name: akademik akademik_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.akademik
    ADD CONSTRAINT akademik_pkey PRIMARY KEY (akademik_id);


--
-- TOC entry 4898 (class 2606 OID 16493)
-- Name: kemitraan kemitraan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kemitraan
    ADD CONSTRAINT kemitraan_pkey PRIMARY KEY (kemitraan_id);


--
-- TOC entry 4894 (class 2606 OID 16453)
-- Name: konservasi konservasi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.konservasi
    ADD CONSTRAINT konservasi_pkey PRIMARY KEY (konservasi_id);


--
-- TOC entry 4890 (class 2606 OID 16414)
-- Name: pertanian pertanian_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pertanian
    ADD CONSTRAINT pertanian_pkey PRIMARY KEY (pertanian_id);


--
-- TOC entry 4892 (class 2606 OID 16435)
-- Name: peternakan peternakan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peternakan
    ADD CONSTRAINT peternakan_pkey PRIMARY KEY (peternakan_id);


--
-- TOC entry 4888 (class 2606 OID 16398)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4902 (class 2606 OID 16476)
-- Name: akademik akademik_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.akademik
    ADD CONSTRAINT akademik_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(user_id);


--
-- TOC entry 4903 (class 2606 OID 16494)
-- Name: kemitraan kemitraan_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kemitraan
    ADD CONSTRAINT kemitraan_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(user_id);


--
-- TOC entry 4901 (class 2606 OID 16454)
-- Name: konservasi konservasi_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.konservasi
    ADD CONSTRAINT konservasi_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(user_id);


--
-- TOC entry 4899 (class 2606 OID 16415)
-- Name: pertanian pertanian_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pertanian
    ADD CONSTRAINT pertanian_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(user_id);


--
-- TOC entry 4900 (class 2606 OID 16436)
-- Name: peternakan peternakan_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peternakan
    ADD CONSTRAINT peternakan_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(user_id);


-- Completed on 2026-05-10 16:31:48

--
-- PostgreSQL database dump complete
--

\unrestrict hOTIKGvX8Y1cdZT2DZxNYtdtaFe6Nqh9JKfS6ezDSOgPkIYiWjezsLvrYIGOCNz

