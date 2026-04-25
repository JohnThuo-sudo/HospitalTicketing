# Hospital Ticketing System - Backend

A Node.js/Express backend for a hospital ticketing system with authentication, patient registration, and multi-stage ticket processing (triage, consultation, pharmacy).

## Architecture Overview

```
┌─────────────────────────────────────────┐
│       Frontend (React + Vite)           │
└────────────────┬────────────────────────┘
                 │
                 │ HTTP/REST
                 │
┌─────────────────▼────────────────────────┐
│    Express Backend (Node.js)            │
├─────────────────────────────────────────┤
│ Routes:                                  │
│ • /api/auth        (Login/Register)     │
│ • /api/patients    (Patient Register)   │
│ • /api/tickets     (Ticket Management)  │
└─────────────────┬────────────────────────┘
                  │
                  │ SQL Queries
                  │
┌─────────────────▼────────────────────────┐
│      Supabase PostgreSQL Database       │
│ Tables:                                  │
│ • user, patient, ticket                 │
│ • triage_record, consultations, pharmacy│
└─────────────────────────────────────────┘
```

## Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app setup
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── triageController.js
│   │   ├── doctorController.js
│   │   └── pharmacyController.js
│   ├── middleware/
│   │   └── auth.js           # JWT verification
│   ├── routes/               # API endpoints
│   │   ├── authRoutes.js
│   │   ├── patientRoutes.js
│   │   └── ticketRoutes.js
│   └── db/
│       └── supabaseClient.js # Database connection
├── server.js                 # Server entry point
├── package.json
├── .env                      # Environment variables
└── supabase/                 # Database migrations
    └── migrations/
```

## Setup Instructions

### Prerequisites

- Node.js 14+ and npm
- Supabase account with a PostgreSQL database
- Git

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create or update `.env` file:

```env
PORT=5000

# Get these from your Supabase project settings
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# Generate a strong secret key
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

### 3. Setup Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migrations in order:
   - `supabase/migrations/20260309065326_initial_schema.sql`
   - `supabase/migrations/20260309082530_create_tables.sql`

### 4. Start Development Server

```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Staff login
- `POST /api/auth/register` - Register staff user

### Patient Registration

- `POST /api/patients/register` - Register patient and create ticket

### Tickets

- `GET /api/tickets` - Get all tickets (protected)
- `GET /api/tickets/:ticketId` - Get specific ticket (protected)

### Triage

- `POST /api/tickets/:ticketId/triage` - Submit vital signs (protected)
- `GET /api/tickets/:ticketId/triage` - Get triage record (protected)

### Doctor

- `POST /api/tickets/:ticketId/doctor` - Submit diagnosis (protected)
- `GET /api/tickets/:ticketId/doctor` - Get consultation (protected)

### Pharmacy

- `POST /api/tickets/:ticketId/pharmacy` - Complete pharmacy (protected)
- `GET /api/tickets/:ticketId/pharmacy` - Get pharmacy record (protected)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. After login, include the token in request headers:

```
Authorization: Bearer <token>
```

The `src/middleware/auth.js` middleware verifies the token on protected routes.

## Database Schema

### User Table

- `id` (UUID) - Primary key
- `email` (CITEXT) - Unique email
- `password_hash` (TEXT) - Bcrypt hashed password
- `full_name` (TEXT) - User's full name
- `role` (ENUM) - patient, triage, recepionist, pharmacist, doctor, manager, support
- `status` (ENUM) - pending, active, suspended, rejected, deactivated
- `is_active` (BOOLEAN) - Account status
- `created_at`, `updated_at` - Timestamps

### Patient Table

- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to user table
- `full_name` (TEXT)
- `phone_number` (TEXT)
- `dob` (DATE) - Date of birth
- `gender` (TEXT)
- `payment_method` (ENUM) - mpesa, card, insurance, cash
- `created_at`, `updated_at`

### Ticket Table

- `id` (UUID) - Primary key
- `ticket_number` (INT) - Sequential ticket number
- `patient_id` (UUID) - Foreign key to patient
- `status` (ENUM) - waiting, triage, consultation, pharmacy, completed
- `created_at`, `updated_at`

### Triage Record Table

- `id` (UUID)
- `ticket_id` (UUID) - Foreign key to ticket
- `temperature` (VARCHAR)
- `blood_pressure` (VARCHAR)
- `heart_rate` (VARCHAR)
- `description` (TEXT)
- `created_by` (UUID) - Staff who created record
- `created_at`

### Consultations Table

- `id` (UUID)
- `ticket_id` (UUID) - Foreign key to ticket
- `diagnosis` (TEXT)
- `prescription` (TEXT)
- `description` (TEXT)
- `created_by` (UUID) - Doctor who created record
- `created_at`

### Pharmacy Table

- `id` (UUID)
- `ticket_id` (UUID) - Foreign key to ticket
- `verified` (BOOLEAN) - Prescription verified
- `paid` (BOOLEAN) - Payment completed
- `created_by` (UUID) - Pharmacist
- `created_at`

## Request/Response Examples

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "doctor@hospital.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "doctor@hospital.com",
    "full_name": "Dr. John",
    "role": "doctor"
  }
}
```

### Register Patient

```bash
POST /api/patients/register
Content-Type: application/json

{
  "firstName": "John",
  "surName": "Doe",
  "lastName": "Smith",
  "phone": "0712345678",
  "DOB": "1990-01-15",
  "gender": "Male",
  "paymentMethod": "mpesa"
}

Response:
{
  "message": "Patient registered successfully",
  "ticket": {
    "id": "uuid",
    "ticket_number": 1,
    "patient_id": "uuid",
    "status": "waiting"
  },
  "patient": {
    "id": "uuid",
    "full_name": "John Doe Smith",
    "phone": "0712345678"
  }
}
```

### Submit Vitals

```bash
POST /api/tickets/:ticketId/triage
Authorization: Bearer <token>
Content-Type: application/json

{
  "temperature": "37.2°C",
  "bloodPressure": "120/80",
  "heartRate": "72bpm",
  "description": "Patient stable"
}

Response:
{
  "message": "Vitals submitted successfully",
  "triageRecord": {
    "id": "uuid",
    "ticket_id": "uuid",
    "temperature": "37.2°C",
    "blood_pressure": "120/80",
    "heart_rate": "72bpm",
    "description": "Patient stable",
    "created_at": "2024-03-09T08:30:00Z"
  }
}
```

### Submit Diagnosis

```bash
POST /api/tickets/:ticketId/doctor
Authorization: Bearer <token>
Content-Type: application/json

{
  "diagnosis": "Common cold with fever",
  "prescription": "Paracetamol 500mg x3 daily",
  "description": "Rest for 3 days"
}

Response:
{
  "message": "Diagnosis submitted successfully",
  "consultation": {
    "id": "uuid",
    "ticket_id": "uuid",
    "diagnosis": "Common cold with fever",
    "prescription": "Paracetamol 500mg x3 daily",
    "created_at": "2024-03-09T09:00:00Z"
  }
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (inactive account)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Server Error

## Security Features

- **Password Hashing**: Uses bcrypt with salt rounds of 10
- **JWT Authentication**: Token-based auth for protected routes
- **CORS**: Configured for frontend origin only
- **Input Validation**: Basic validation on all endpoints
- **SQL Injection Prevention**: Uses Supabase parameterized queries

## Development Tips

1. **Testing Endpoints**: Use Postman, Thunder Client, or curl
2. **Environment Variables**: Never commit sensitive data to version control
3. **Database Queries**: Check Supabase SQL Editor to verify data
4. **Error Logging**: Check server console for detailed error messages
5. **Token Testing**: Decode JWTs at jwt.io for debugging

## Troubleshooting

### "Supabase credentials not configured"

- Ensure `.env` file has `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Verify values are correctly copied from Supabase dashboard

### "Database connection failed"

- Check Supabase project is active
- Verify database migrations have been run
- Ensure network connectivity

### "Invalid token" error

- Token may have expired (24-hour expiration)
- User needs to login again
- Check `JWT_SECRET` matches between login and verification

### Ticket endpoints returning 404

- Verify ticket ID exists in database
- Check patient registration returned valid ticket ID
- Ensure pagination is not needed (get all first)

## Future Enhancements

- [ ] Role-based access control (RBAC)
- [ ] Ticket queue management
- [ ] Real-time notifications (WebSockets)
- [ ] File uploads (prescriptions, medical records)
- [ ] Analytics and reporting
- [ ] Appointment scheduling
- [ ] Staff availability management
- [ ] Audit logging

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review database migration logs
3. Check Supabase project health
4. Review server console logs
