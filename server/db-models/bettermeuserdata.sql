--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3 (Ubuntu 11.3-1.pgdg18.04+1)
-- Dumped by pg_dump version 11.5


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE TABLE public.users (
	"user_id" serial NOT NULL,
	"username" varchar NOT NULL,
	"password" varchar,
	"fullname" varchar,
	"email" varchar,
	CONSTRAINT "users_pk" PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);

-- Completed on 2019-09-11 17:02:50 PDT

--
-- PostgreSQL database dump complete
--

