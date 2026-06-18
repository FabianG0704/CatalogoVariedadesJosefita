--
-- PostgreSQL database dump
--

\restrict FO0bK9uvX2ahqiYhybgb2JIU7gbCo9iJGbFczUWFD23E3D712iGh7UEwhC8MQ11

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-06-17 21:46:30

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

DROP DATABASE IF EXISTS bdjosefita;
--
-- TOC entry 5003 (class 1262 OID 38078)
-- Name: bdjosefita; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE bdjosefita WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Venezuela.1252';


ALTER DATABASE bdjosefita OWNER TO postgres;

\unrestrict FO0bK9uvX2ahqiYhybgb2JIU7gbCo9iJGbFczUWFD23E3D712iGh7UEwhC8MQ11
\connect bdjosefita
\restrict FO0bK9uvX2ahqiYhybgb2JIU7gbCo9iJGbFczUWFD23E3D712iGh7UEwhC8MQ11

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
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 38079)
-- Name: tmclientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tmclientes (
    pkcc_c bigint NOT NULL,
    cel_c bigint NOT NULL,
    correo_c character varying(50) NOT NULL,
    dir_c character varying(50) NOT NULL,
    nom_c character varying(50) NOT NULL,
    password_c character varying(100) NOT NULL,
    fkcod_sx character varying(1) NOT NULL,
    fkcod_s_c integer NOT NULL
);


ALTER TABLE public.tmclientes OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 38142)
-- Name: tmfavoritos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tmfavoritos (
    fkcedula_c bigint NOT NULL,
    fkcod_p integer NOT NULL
);


ALTER TABLE public.tmfavoritos OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 38093)
-- Name: tmprendas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tmprendas (
    pkcod_p integer NOT NULL,
    color character varying(30) NOT NULL,
    imagen character varying(100),
    nom_p character varying(40) NOT NULL,
    precio numeric(12,2) NOT NULL,
    talla character varying(5) NOT NULL,
    fkcod_sx_p character varying(1) NOT NULL,
    fkcod_s_p integer NOT NULL
);


ALTER TABLE public.tmprendas OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 38092)
-- Name: tmprendas_pkcod_p_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tmprendas_pkcod_p_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tmprendas_pkcod_p_seq OWNER TO postgres;

--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 220
-- Name: tmprendas_pkcod_p_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tmprendas_pkcod_p_seq OWNED BY public.tmprendas.pkcod_p;


--
-- TOC entry 222 (class 1259 OID 38106)
-- Name: tmsexo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tmsexo (
    pkcod_sx character varying(1) NOT NULL,
    dsexo character varying(15) NOT NULL
);


ALTER TABLE public.tmsexo OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 38113)
-- Name: tmstatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tmstatus (
    pkcod_s integer NOT NULL,
    dstatus character varying(12) NOT NULL
);


ALTER TABLE public.tmstatus OWNER TO postgres;

--
-- TOC entry 4826 (class 2604 OID 38096)
-- Name: tmprendas pkcod_p; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmprendas ALTER COLUMN pkcod_p SET DEFAULT nextval('public.tmprendas_pkcod_p_seq'::regclass);


--
-- TOC entry 4992 (class 0 OID 38079)
-- Dependencies: 219
-- Data for Name: tmclientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tmclientes (pkcc_c, cel_c, correo_c, dir_c, nom_c, password_c, fkcod_sx, fkcod_s_c) VALUES (1001234567, 3001234567, 'ana@correo.com', 'Calle 5 #10-20', 'Ana Torres', '1234', 'F', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmclientes (pkcc_c, cel_c, correo_c, dir_c, nom_c, password_c, fkcod_sx, fkcod_s_c) VALUES (1002345678, 3109876543, 'carlos@correo.com', 'Cra 8 #15-30', 'Carlos Ruiz', '1234', 'M', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmclientes (pkcc_c, cel_c, correo_c, dir_c, nom_c, password_c, fkcod_sx, fkcod_s_c) VALUES (1003456789, 3205551234, 'laura@correo.com', 'Av 6 #22-10', 'Laura G¢mez', '1234', 'F', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmclientes (pkcc_c, cel_c, correo_c, dir_c, nom_c, password_c, fkcod_sx, fkcod_s_c) VALUES (1127055413, 9772512, 'josefita@josefita.com', 'Cra 9 Sector Amargosal, Palotal Parte Alta', 'Belkis Diaz', '19101974', 'F', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmclientes (pkcc_c, cel_c, correo_c, dir_c, nom_c, password_c, fkcod_sx, fkcod_s_c) VALUES (996655, 3238226704, 'jarlenprato@gmail.com', 'Cra 10, Barrio  Miranda, San Antonio', 'Jarlen Prato', 'jarlencitoXD', 'M', 1) ON CONFLICT DO NOTHING;


--
-- TOC entry 4997 (class 0 OID 38142)
-- Dependencies: 224
-- Data for Name: tmfavoritos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tmfavoritos (fkcedula_c, fkcod_p) VALUES (996655, 11) ON CONFLICT DO NOTHING;
INSERT INTO public.tmfavoritos (fkcedula_c, fkcod_p) VALUES (996655, 13) ON CONFLICT DO NOTHING;
INSERT INTO public.tmfavoritos (fkcedula_c, fkcod_p) VALUES (996655, 19) ON CONFLICT DO NOTHING;
INSERT INTO public.tmfavoritos (fkcedula_c, fkcod_p) VALUES (1127055413, 11) ON CONFLICT DO NOTHING;


--
-- TOC entry 4994 (class 0 OID 38093)
-- Dependencies: 221
-- Data for Name: tmprendas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (13, 'Negro', '1780969356014_WhatsApp Image 2026-06-08 at 9.31.49 PM.jpeg', 'Camiseta Balmain', 45000.00, 'M', 'F', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (14, 'Rosado', '1780969362496_WhatsApp Image 2026-06-08 at 9.31.49 PM (1).jpeg', 'Camiseta Calvin Klein', 38000.00, 'S', 'F', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (15, 'Blanco', '1780969399286_WhatsApp Image 2026-06-08 at 9.31.49 PM (2).jpeg', 'Camiseta Gucci', 42000.00, 'S', 'F', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (16, 'Negro', '1780969403154_WhatsApp Image 2026-06-08 at 9.31.50 PM.jpeg', 'Camiseta Moschino', 40000.00, 'M', 'F', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (17, 'Negro', '1780969432182_WhatsApp Image 2026-06-08 at 9.31.51 PM.jpeg', 'Camiseta Burberry', 44000.00, 'L', 'F', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (18, 'Negro', '1780969438251_WhatsApp Image 2026-06-08 at 9.31.51 PM (1).jpeg', 'Camiseta Carolina Herrera', 46000.00, 'XL', 'F', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (21, 'Marr¢n', '1780969537906_WhatsApp Image 2026-06-08 at 9.31.51 PM (5).jpeg', 'Camiseta Boss', 52000.00, 'XL', 'M', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (22, 'Negro', '1780969541391_WhatsApp Image 2026-06-08 at 9.31.51 PM (4).jpeg', 'Camiseta Boss', 52000.00, 'XL', 'M', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (23, 'Azul', '1780969564207_WhatsApp Image 2026-06-08 at 9.31.51 PM (6).jpeg', 'Camiseta Boss', 52000.00, 'XXL', 'M', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (24, 'Verde', '1780969568352_WhatsApp Image 2026-06-08 at 9.31.52 PM.jpeg', 'Polo Lacoste', 50000.00, '3XL', 'M', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (25, 'Negro', '1780969576445_WhatsApp Image 2026-06-08 at 9.31.52 PM (1).jpeg', 'Deportiva Reebok', 55000.00, 'L', 'F', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (20, 'Rosado', '1780969480948_WhatsApp Image 2026-06-08 at 9.31.51 PM (3).jpeg', 'Camiseta Lacoste', 60000.00, 'XXL', 'M', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (19, 'Verde claro', '1780969477468_WhatsApp Image 2026-06-08 at 9.31.51 PM (2).jpeg', 'Camiseta Lacoste', 60000.00, 'L', 'M', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (11, 'Azulgrana', '1780969238909_WhatsApp Image 2026-06-08 at 9.31.48 PM.jpeg', 'Deportiva FC Barcelona 2025/26', 50000.00, 'XL', 'M', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (12, 'Blanco', '1780969251484_WhatsApp Image 2026-06-08 at 9.31.48 PM (1).jpeg', 'Deportiva Real Madrid 2025/26', 55000.00, 'XL', 'M', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.tmprendas (pkcod_p, color, imagen, nom_p, precio, talla, fkcod_sx_p, fkcod_s_p) VALUES (26, 'Amarillo', '1780981507183_colombia2026.jpg', 'Deportiva Colombia 2026', 60000.00, 'XL', 'M', 0) ON CONFLICT DO NOTHING;


--
-- TOC entry 4995 (class 0 OID 38106)
-- Dependencies: 222
-- Data for Name: tmsexo; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tmsexo (pkcod_sx, dsexo) VALUES ('M', 'Masculino') ON CONFLICT DO NOTHING;
INSERT INTO public.tmsexo (pkcod_sx, dsexo) VALUES ('F', 'Femenino') ON CONFLICT DO NOTHING;
INSERT INTO public.tmsexo (pkcod_sx, dsexo) VALUES ('O', 'Otro') ON CONFLICT DO NOTHING;


--
-- TOC entry 4996 (class 0 OID 38113)
-- Dependencies: 223
-- Data for Name: tmstatus; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tmstatus (pkcod_s, dstatus) VALUES (1, 'Activo') ON CONFLICT DO NOTHING;
INSERT INTO public.tmstatus (pkcod_s, dstatus) VALUES (0, 'Eliminado') ON CONFLICT DO NOTHING;


--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 220
-- Name: tmprendas_pkcod_p_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tmprendas_pkcod_p_seq', 26, true);


--
-- TOC entry 4828 (class 2606 OID 38091)
-- Name: tmclientes tmclientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmclientes
    ADD CONSTRAINT tmclientes_pkey PRIMARY KEY (pkcc_c);


--
-- TOC entry 4838 (class 2606 OID 38148)
-- Name: tmfavoritos tmfavoritos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmfavoritos
    ADD CONSTRAINT tmfavoritos_pkey PRIMARY KEY (fkcedula_c, fkcod_p);


--
-- TOC entry 4832 (class 2606 OID 38105)
-- Name: tmprendas tmprendas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmprendas
    ADD CONSTRAINT tmprendas_pkey PRIMARY KEY (pkcod_p);


--
-- TOC entry 4834 (class 2606 OID 38112)
-- Name: tmsexo tmsexo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmsexo
    ADD CONSTRAINT tmsexo_pkey PRIMARY KEY (pkcod_sx);


--
-- TOC entry 4836 (class 2606 OID 38119)
-- Name: tmstatus tmstatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmstatus
    ADD CONSTRAINT tmstatus_pkey PRIMARY KEY (pkcod_s);


--
-- TOC entry 4830 (class 2606 OID 38121)
-- Name: tmclientes uk_14p10r88hcd02e96ajjp374sk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmclientes
    ADD CONSTRAINT uk_14p10r88hcd02e96ajjp374sk UNIQUE (correo_c);


--
-- TOC entry 4843 (class 2606 OID 38149)
-- Name: tmfavoritos fk48c74f8pch9rkx3qy0dtoad42; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmfavoritos
    ADD CONSTRAINT fk48c74f8pch9rkx3qy0dtoad42 FOREIGN KEY (fkcedula_c) REFERENCES public.tmclientes(pkcc_c);


--
-- TOC entry 4844 (class 2606 OID 38154)
-- Name: tmfavoritos fk7127hjlabrnxpn4byp45uvdlh; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmfavoritos
    ADD CONSTRAINT fk7127hjlabrnxpn4byp45uvdlh FOREIGN KEY (fkcod_p) REFERENCES public.tmprendas(pkcod_p);


--
-- TOC entry 4839 (class 2606 OID 38127)
-- Name: tmclientes fkfxhq6sryebo6vmx5wt1n1kcoh; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmclientes
    ADD CONSTRAINT fkfxhq6sryebo6vmx5wt1n1kcoh FOREIGN KEY (fkcod_s_c) REFERENCES public.tmstatus(pkcod_s);


--
-- TOC entry 4841 (class 2606 OID 38132)
-- Name: tmprendas fkihee67fpu3jn1vscwy2ouaxq5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmprendas
    ADD CONSTRAINT fkihee67fpu3jn1vscwy2ouaxq5 FOREIGN KEY (fkcod_sx_p) REFERENCES public.tmsexo(pkcod_sx);


--
-- TOC entry 4840 (class 2606 OID 38122)
-- Name: tmclientes fkjbhtotarcwhfrxivi5o0iwr2x; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmclientes
    ADD CONSTRAINT fkjbhtotarcwhfrxivi5o0iwr2x FOREIGN KEY (fkcod_sx) REFERENCES public.tmsexo(pkcod_sx);


--
-- TOC entry 4842 (class 2606 OID 38137)
-- Name: tmprendas fkraqlsio9d44av3ysy8x9hfiyl; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmprendas
    ADD CONSTRAINT fkraqlsio9d44av3ysy8x9hfiyl FOREIGN KEY (fkcod_s_p) REFERENCES public.tmstatus(pkcod_s);


-- Completed on 2026-06-17 21:46:30

--
-- PostgreSQL database dump complete
--

\unrestrict FO0bK9uvX2ahqiYhybgb2JIU7gbCo9iJGbFczUWFD23E3D712iGh7UEwhC8MQ11

