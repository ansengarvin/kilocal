--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: days; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.days (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.days OWNER TO dev;

--
-- Name: days_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.days_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.days_id_seq OWNER TO dev;

--
-- Name: days_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.days_id_seq OWNED BY public.days.id;


--
-- Name: days_recipes; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.days_recipes (
    id integer NOT NULL,
    date date NOT NULL,
    recipe_id integer NOT NULL,
    "position" integer NOT NULL
);


ALTER TABLE public.days_recipes OWNER TO dev;

--
-- Name: days_recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.days_recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.days_recipes_id_seq OWNER TO dev;

--
-- Name: days_recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.days_recipes_id_seq OWNED BY public.days_recipes.id;


--
-- Name: foods; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.foods (
    id integer NOT NULL,
    day_id integer,
    recipe_id integer,
    name character varying(255),
    calories numeric(5,2) NOT NULL,
    amount integer NOT NULL,
    carbs numeric(5,2) NOT NULL,
    fat numeric(5,2) NOT NULL,
    protein numeric(5,2) NOT NULL,
    "position" integer,
    CONSTRAINT check_day_recipe CHECK ((((day_id IS NOT NULL) AND (recipe_id IS NULL)) OR ((day_id IS NULL) AND (recipe_id IS NOT NULL))))
);


ALTER TABLE public.foods OWNER TO dev;

--
-- Name: foods_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.foods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.foods_id_seq OWNER TO dev;

--
-- Name: foods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.foods_id_seq OWNED BY public.foods.id;


--
-- Name: recipes; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.recipes (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.recipes OWNER TO dev;

--
-- Name: recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recipes_id_seq OWNER TO dev;

--
-- Name: recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.users (
    id character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(255),
    weight double precision
);


ALTER TABLE public.users OWNER TO dev;

--
-- Name: days id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.days ALTER COLUMN id SET DEFAULT nextval('public.days_id_seq'::regclass);


--
-- Name: days_recipes id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.days_recipes ALTER COLUMN id SET DEFAULT nextval('public.days_recipes_id_seq'::regclass);


--
-- Name: foods id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.foods ALTER COLUMN id SET DEFAULT nextval('public.foods_id_seq'::regclass);


--
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);


--
-- Data for Name: days; Type: TABLE DATA; Schema: public; Owner: dev
--



--
-- Data for Name: days_recipes; Type: TABLE DATA; Schema: public; Owner: dev
--



--
-- Data for Name: foods; Type: TABLE DATA; Schema: public; Owner: dev
--



--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: dev
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dev
--



--
-- Name: days_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.days_id_seq', 1, false);


--
-- Name: days_recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.days_recipes_id_seq', 1, false);


--
-- Name: foods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.foods_id_seq', 1, false);


--
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.recipes_id_seq', 1, false);


--
-- Name: days days_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.days
    ADD CONSTRAINT days_pkey PRIMARY KEY (id);


--
-- Name: days_recipes days_recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.days_recipes
    ADD CONSTRAINT days_recipes_pkey PRIMARY KEY (id);


--
-- Name: foods foods_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: days_recipes days_recipes_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.days_recipes
    ADD CONSTRAINT days_recipes_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: days days_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.days
    ADD CONSTRAINT days_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: foods foods_day_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_day_id_fkey FOREIGN KEY (day_id) REFERENCES public.days(id) ON DELETE CASCADE;


--
-- Name: foods foods_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: recipes recipes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

