# Quick Start Guide

## 5-Minute Setup

### Prerequisites

- Node.js 14+ installed
- Supabase account (free at https://supabase.com)

### Step 1: Get Supabase Credentials (2 minutes)

1. Go to https://supabase.com and sign up/login
2. Create a new project
3. In Project Settings → API Keys, copy:
   - Project URL (under "Project URL")
   - anon public key (under "Project API keys")

### Step 2: Update Environment File (1 minute)

Edit `backend/.env`:

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
JWT_SECRET=your-secret-key-change-in-production
```

### Step 3: Setup Database (1 minute)

1. In Supabase, go to SQL Editor
2. Click "New Query"
3. Open `backend/supabase/migrations/20260309065326_initial_schema.sql`
4. Copy and paste into SQL Editor
5. Click "Run"
6. Repeat for `20260309082530_create_tables.sql`

### Step 4: Run Backend (1 minute)

```bash
cd backend
npm install  # (only if not already done)
npm run dev
```

You should see:

```
Server running on port: 5000
```

### Step 5: Run Frontend (Optional, in new terminal)

```bash
cd frontend
npm install  # (only if not already done)
npm run dev
```

Visit http://localhost:5173

---

## Testing the System

### Test 1: Register Staff User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@hospital.com",
    "password": "test123",
    "full_name": "Dr. John",
    "role": "doctor"
  }'
```

Expected response:

```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "...",
    "email": "doctor@hospital.com",
    "full_name": "Dr. John",
    "role": "doctor"
  }
}
```

Save the token for next test.

### Test 2: Login as Staff

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@hospital.com",
    "password": "test123"
  }'
```

### Test 3: Register Patient

```bash
curl -X POST http://localhost:5000/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "surName": "Doe",
    "lastName": "Smith",
    "phone": "0712345678",
    "DOB": "1990-01-15",
    "gender": "Male",
    "paymentMethod": "mpesa"
  }'
```

You should get a ticket number!

### Test 4: Get All Tickets (Protected)

Replace `YOUR_TOKEN` with token from Test 1:

```bash
curl -X GET http://localhost:5000/api/tickets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Common Issues & Fixes

### "Supabase credentials not configured"

**Fix**: Ensure SUPABASE_URL and SUPABASE_ANON_KEY are in `.env` and start with `https://`

### "Cannot POST /api/auth/login"

**Fix**:

- Is backend running on port 5000?
- Check `npm run dev` output shows "Server running on port: 5000"

### "CORS error from frontend"

**Fix**:

- Backend must be on `http://localhost:5000`
- Frontend must be on `http://localhost:5173`
- Restart backend if you changed ports

### "Invalid token" error

**Fix**:

- Re-login to get new token
- Ensure full token (including `Bearer ` prefix) is in curl

### Database tables not found

**Fix**:

- Run migrations in Supabase SQL Editor
- Go to Table Editor to verify tables exist
- Check for SQL errors in migration output

---

## Frontend Testing (http://localhost:5173)

### Patient Registration

1. Click "Register as Patient"
2. Enter name, phone, DOB, gender, payment method
3. You should get a ticket number

### Staff Login

1. Click "Staff Login"
2. Email: `doctor@hospital.com` (from Test 1)
3. Password: `test123`
4. You should be logged in

### Triage (if logged in as triage)

1. Navigate to Triage page
2. Enter vital signs
3. Submit

### Doctor (if logged in as doctor)

1. Navigate to Doctor page
2. Enter diagnosis and prescription
3. Submit

### Pharmacy (if logged in as pharmacist)

1. Navigate to Pharmacy page
2. Mark prescription verified and payment done
3. Complete ticket

---

## File Structure Reference

```
HospitalTicketing/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── patientController.js
│   │   │   ├── triageController.js
│   │   │   ├── doctorController.js
│   │   │   └── pharmacyController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── patientRoutes.js
│   │   │   └── ticketRoutes.js
│   │   ├── db/
│   │   │   └── supabaseClient.js
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   ├── .env (← Update with Supabase credentials)
│   └── README.md (← Full documentation)
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── patient/
    │   │   ├── triage/
    │   │   ├── doctor/
    │   │   └── pharmacy/
    │   ├── components/
    │   ├── context/
    │   ├── api/
    │   └── App.jsx
    └── package.json
```

---

## API Endpoints Summary

All endpoints use base URL: `http://localhost:5000/api`

**Public (No token needed):**

- POST `/auth/login` - Login staff
- POST `/auth/register` - Register staff
- POST `/patients/register` - Register patient

**Protected (Token required in Authorization header):**

- GET `/tickets` - Get all tickets
- GET `/tickets/:id` - Get ticket details
- POST `/tickets/:id/triage` - Submit vitals
- POST `/tickets/:id/doctor` - Submit diagnosis
- POST `/tickets/:id/pharmacy` - Complete pharmacy

---

## Need More Help?

1. Read full documentation: `backend/README.md`
2. Check implementation guide: `IMPLEMENTATION_GUIDE.md`
3. Review backend setup: `backend/BACKEND_SETUP.md`
4. Check server logs for errors: `npm run dev` output
5. Test with Postman/Thunder Client for API debugging

---

## What's Next?

- [ ] Update `.env` with Supabase credentials
- [ ] Run migrations in Supabase
- [ ] Start backend (`npm run dev` in backend folder)
- [ ] Start frontend (`npm run dev` in frontend folder)
- [ ] Test patient registration
- [ ] Test staff login
- [ ] Test complete workflow
- [ ] Deploy to production (see README for production setup)

**You're all set! Happy ticketing! 🎫**
