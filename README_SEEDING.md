## 🎯 Quick Setup Guide for Seeding Admin & Staff

### Step 1: Get Your Supabase Service Role Key

**For Local Supabase:**

```bash
cd backend
supabase status
```

Copy the `service_role secret` value from the output.

**For Supabase Cloud:**

1. Go to https://app.supabase.com
2. Select your project
3. Settings → API → Service Role Secret
4. Copy the key

### Step 2: Update .env File

Open `backend/.env` and add:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Example:

```
PORT=5000
SUPABASE_URL=https://bahjpsoaflkvdohbfrfb.supabase.co
SUPABASE_ANON_KEY=sb_publishable_T4Oo_WkgNp4tNSNco19x0Q_fjUYiItP
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

### Step 3: Run the Seed Script

```bash
cd backend
npm run seed
```

### Step 4: What Gets Created

**Admin Account:**

- Email: `admin@hospital.com`
- Password: `Admin@123`
- Role: Manager (can create/manage staff)

**Sample Staff (6 accounts):**

- Dr. Jane Smith (Doctor)
- John Omondi (Triage)
- Sarah Kipchoge (Pharmacist)
- Alice Mwangi (Receptionist)
- Peter Nakuru (Doctor)
- Grace Kipchoge (Pharmacist)

All staff accounts have no password initially. They'll be set when they log in for the first time.

### Step 5: Test the System

1. **Start Backend:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Login as Admin:**
   - Go to http://localhost:5173
   - Click "Staff Login"
   - Email: `admin@hospital.com`
   - Password: `Admin@123`
   - You'll be redirected to the admin dashboard

4. **Create More Staff:**
   - In the admin panel, use "Create Staff" to add more employees
   - They'll receive emails (in the system) to register

## 📚 Additional Resources

- See `SEEDING.md` for detailed seeding documentation
- See `backend/seed.js` to modify seed data
- Staff roles available: triage, recepionist, pharmacist, doctor, manager, support

## ❓ Common Issues

**"SUPABASE_SERVICE_ROLE_KEY must be set"**

- Ensure you added it to your .env file
- Restart the terminal after updating .env

**"permission denied" errors**

- For local Supabase, run: `supabase stop && supabase start`
- Wait a few seconds for containers to fully start

**"Data already exists"**

- The script skips existing records
- Safe to run multiple times
