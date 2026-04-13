CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TYPE user_role AS ENUM ('patient', 'triage', 'recepionist', 'pharmacist','doctor', 'manager', 'support');
CREATE TYPE account_status AS ENUM ('pending','active', 'suspended', 'rejected', 'deactivated');



CREATE OR REPLACE FUNCTION set_row_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

