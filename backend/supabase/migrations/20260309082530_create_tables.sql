CREATE TYPE payment_method AS ENUM ('mpesa', 'card', 'insurance');
CREATE TYPE ticket_status AS ENUM ('waiting', 'triage', 'consultation', 'pharmacy', 'completed')

-- USERS
CREATE TABLE user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email CITEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    status account_status NOT NULL DEFAULT 'pending',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_user_set_updated_at
BEFORE UPDATE ON user
FOR EACH ROW EXECUTE FUNCTION set_row_updated_at();

CREATE TABLE patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user(id) ON DELETE NO ACTION,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    DOB DATE,
    payment_method payment_method NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TRIGGER trg_patient_set_updated_at
BEFORE UPDATE ON patient
FOR EACH ROW EXECUTE FUNCTION set_row_updated_at();


CREATE TABLE staff(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user(id) ON DELETE NO ACTION,
    full_name TEXT NOT NULL,
    role user_role NOT NULL,
    specialization NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_staff_set_updated_at
BEFORE UPDATE ON staff
FOR EACH ROW EXECUTE FUNCTION set_row_updated_at();

CREATE TABLE ticket(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number INT NOT NULL,
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE NO ACTION,
    triage_id NOT NULL REFERENCES staff(id) ON DELETE NO ACTION,
    doctor_id NOT NULL REFERENCES staff(id) ON DELETE NO ACTION,
    status ticket_status NOT NULL DEFAULT 'waiting',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tickets_patient_id ON tickets(patient_id);
CREATE INDEX idx_tickets_triage_id ON tickets(triage_id);
CREATE INDEX idx_tickets_doctor_id ON tickets(doctor_id);

CREATE TRIGGER trg_ticket_set_updated_at
BEFORE UPDATE ON ticket
FOR EACH ROW EXECUTE FUNCTION set_row_updated_at();

CREATE TABLE triage_record(
    id UUID NOT NULL DEFAULT gen_random_uuid();
    ticket_id NOT NULL REFERENCES ticket(id) ON DELETE CASCADE,
    vitals TEXT NOT NULL,
    note TEXT NOT NULL
);

CREATE INDEX idx_triage_record_ticket_id ON triage_record(ticket_id);

CREATE TABLE consultations(
    consultation_id UUID NOT NULL DEFAULT get_random_uuid();
    ticket_id NOT NULL REFERENCES ticket(id) ON DELETE CASCADE,
    medication_dispensed TEXT NOT NULL,
    instu

);