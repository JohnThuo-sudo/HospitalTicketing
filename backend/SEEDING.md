# Hospital Ticketing System - Seed Data Setup

## Running the Seed Script

The seed script creates an admin user and sample staff accounts in the database.

### Prerequisites

1. Ensure your `.env` file has the Supabase credentials set:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for full seeding capability)

2. If using **Supabase Cloud**, get your service role key from:
   - Supabase Dashboard → Project Settings → API Keys → Service Role Key

3. If using **Local Supabase**, get the service role key from:
   - Run `supabase status` to see the database info
   - Add it to your `.env` file

### Steps

1. **Update your `.env` file:**

   ```bash
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Run the seed script:**

   ```bash
   npm run seed
   ```

3. **Output:**
   The script will create:
   - **Admin User**: `admin@hospital.com` with password `Admin@123`
   - **Sample Staff**: 6 staff members with different roles (doctor, triage, pharmacist, receptionist)

### Generated Accounts

#### Admin Account

- Email: `admin@hospital.com`
- Password: `Admin@123`
- Role: `manager`
- Status: `active`

#### Sample Staff (Created without passwords - they'll set on first login)

1. **Dr. Jane Smith** - Doctor (jane.smith@hospital.com)
2. **John Omondi** - Triage (john.omondi@hospital.com)
3. **Sarah Kipchoge** - Pharmacist (sarah.kipchoge@hospital.com)
4. **Alice Mwangi** - Receptionist (alice.mwangi@hospital.com)
5. **Peter Nakuru** - Doctor (peter.nakuru@hospital.com)
6. **Grace Kipchoge** - Pharmacist (grace.kipchoge@hospital.com)

### Next Steps

1. Start the backend:

   ```bash
   npm run dev
   ```

2. Start the frontend:

   ```bash
   npm run dev
   ```

3. Login with admin account:
   - Navigate to staff login
   - Email: `admin@hospital.com`
   - Password: `Admin@123`

4. As admin, you can:
   - Create additional staff accounts
   - Manage existing staff
   - Monitor the system

## Troubleshooting

### Error: "SUPABASE_SERVICE_ROLE_KEY must be set"

- Make sure the key is added to your `.env` file
- For local Supabase: run `supabase status` to see available keys
- For cloud Supabase: check project settings in the dashboard

### Error: "permission denied"

- If using local Supabase, ensure Docker containers are running: `docker ps`
- If issue persists, try resetting: `supabase stop && supabase start`

### Data already exists

- The script checks for existing records and skips them
- To reset: manually clear the tables or run migrations fresh
