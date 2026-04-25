CREATE TYPE payment_method AS ENUM ('m-pesa', 'card', 'insurance', 'cash');
CREATE TYPE ticket_status AS ENUM ('waiting', 'waiting-doctor', 'waiting-pharmacy', 'completed', 'rejected');

CREATE TABLE IF NOT EXISTS "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email CITEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT,
  role user_role NOT NULL,
  status account_status NOT NULL DEFAULT 'pending',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_user_set_updated_at
BEFORE UPDATE ON "user"
FOR EACH ROW EXECUTE FUNCTION set_row_updated_at();

CREATE TABLE IF NOT EXISTS patient (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'patient',
  dob DATE,
  gender TEXT NOT NULL,
  payment_method payment_method NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_patient_set_updated_at
BEFORE UPDATE ON patient
FOR EACH ROW EXECUTE FUNCTION set_row_updated_at();

CREATE TABLE IF NOT EXISTS ticket (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number INT NOT NULL,
  patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
  status ticket_status NOT NULL DEFAULT 'waiting',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ticket_number ON ticket(ticket_number);
CREATE INDEX IF NOT EXISTS idx_ticket_patient_id ON ticket(patient_id);

CREATE TRIGGER trg_ticket_set_updated_at
BEFORE UPDATE ON ticket
FOR EACH ROW EXECUTE FUNCTION set_row_updated_at();

CREATE TABLE IF NOT EXISTS triage_record (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES ticket(id) ON DELETE CASCADE,
  temperature VARCHAR(50) NOT NULL,
  blood_pressure VARCHAR(50) NOT NULL,
  heart_rate VARCHAR(50) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES "user"(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_triage_record_ticket_id ON triage_record(ticket_id);

CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES ticket(id) ON DELETE CASCADE,
  diagnosis TEXT NOT NULL,
  prescription TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES "user"(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultations_ticket_id ON consultations(ticket_id);

CREATE TABLE IF NOT EXISTS pharmacy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES ticket(id) ON DELETE CASCADE,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES "user"(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pharmacy_ticket_id ON pharmacy(ticket_id);
