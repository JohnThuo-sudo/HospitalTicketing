# Hospital Ticketing System - Implementation Guide

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Hospital Ticketing System                 │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (React + Vite)        Backend (Express + Node)    │
│  ┌────────────────────────┐     ┌────────────────────────┐  │
│  │ Patient Pages          │────→│ Patient Controller     │  │
│  │ - Register             │     │ - registerPatient()    │  │
│  │ - Ticket Display       │     │ - getTickets()         │  │
│  │                        │     │ - getTicketById()      │  │
│  ├────────────────────────┤     ├────────────────────────┤  │
│  │ Staff Pages            │────→│ Staff Controllers      │  │
│  │ - Login                │     │ - login()              │  │
│  │ - Triage               │     │ - registerStaff()      │  │
│  │ - Doctor               │     │ - submitVitals()       │  │
│  │ - Pharmacy             │     │ - submitDiagnosis()    │  │
│  │                        │     │ - completePharmacy()   │  │
│  ├────────────────────────┤     ├────────────────────────┤  │
│  │ Protected Routes       │     │ Auth Middleware        │  │
│  │ - RoleGuard            │────→│ - verifyToken()        │  │
│  │ - ProtectedRoute       │     │ - JWT validation       │  │
│  └────────────────────────┘     └────────────────────────┘  │
│                                         │                    │
│                         Database (Supabase PostgreSQL)       │
│                         ├─ user table                        │
│                         ├─ patient table                     │
│                         ├─ ticket table                      │
│                         ├─ triage_record table               │
│                         ├─ consultations table               │
│                         └─ pharmacy table                    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. Patient Registration Flow

```
Frontend (RegisterNames.jsx)
    ↓
Patient enters: firstName, surName, lastName
    ↓
Navigate to RegisterPhoneDOB.jsx
    ↓
Patient enters: phone, DOB
    ↓
Navigate to RegisterGenderPayment.jsx
    ↓
Patient enters: gender, paymentMethod
    ↓
Navigate to RegisterConfirm.jsx
    ↓
User clicks "Submit"
    ↓
POST /api/patients/register
{
  firstName: "John",
  surName: "Doe",
  lastName: "Smith",
  phone: "0712345678",
  DOB: "1990-01-15",
  gender: "Male",
  paymentMethod: "mpesa"
}
    ↓
Backend: patientController.registerPatient()
    ├─ Validate input
    ├─ Create patient record in database
    ├─ Generate next ticket number
    ├─ Create ticket record
    └─ Return ticket details
    ↓
Frontend: Receive ticket_number and ticket_id
    ↓
Display: "Your Ticket Number: 1"
```

### 2. Staff Login Flow

```
Frontend (StaffLogin.jsx)
    ↓
Staff enters: email, password
    ↓
POST /api/auth/login
{
  email: "doctor@hospital.com",
  password: "password123"
}
    ↓
Backend: authController.login()
    ├─ Validate email/password provided
    ├─ Query database for user
    ├─ Compare password with bcrypt hash
    ├─ Check user status (active)
    ├─ Generate JWT token
    └─ Return token + user details
    ↓
Frontend: Receive token
    ├─ Store in localStorage
    ├─ Call login() from AuthContext
    ├─ Navigate to /staff/doctor (based on role)
    └─ All future requests include token in header
```

### 3. Triage Vitals Submission Flow

```
Frontend (triage/Ticket.jsx)
    ↓
Triage staff enters vitals:
├─ temperature: "37.2°C"
├─ bloodPressure: "120/80"
├─ heartRate: "72bpm"
└─ description: "Patient stable"
    ↓
POST /api/tickets/:ticketId/triage
Authorization: Bearer <token>
    ↓
Backend: verifyToken() middleware
    ├─ Extract token from header
    ├─ Verify JWT signature
    ├─ Validate token not expired
    └─ Set req.user = decoded token data
    ↓
Backend: triageController.submitVitals()
    ├─ Validate all vitals provided
    ├─ Verify ticket exists
    ├─ Create triage_record
    ├─ Update ticket status → 'triage'
    └─ Return triage record details
    ↓
Frontend: Update ticket status display
```

### 4. Doctor Diagnosis Flow

```
Frontend (doctor/Ticket.jsx)
    ↓
Doctor enters diagnosis details:
├─ diagnosis: "Common cold"
├─ prescription: "Paracetamol 500mg x3"
└─ description: "Rest for 3 days"
    ↓
POST /api/tickets/:ticketId/doctor
Authorization: Bearer <token>
    ↓
Backend: verifyToken() ← JWT validation
    ↓
Backend: doctorController.submitDiagnosis()
    ├─ Validate diagnosis/prescription
    ├─ Verify ticket exists
    ├─ Create consultations record
    ├─ Update ticket status → 'consultation'
    └─ Return consultation details
    ↓
Frontend: Show confirmation
```

### 5. Pharmacy Completion Flow

```
Frontend (pharmacy/Ticket.jsx)
    ↓
Pharmacist verifies prescription and payment:
├─ Verify: "Prescription verified"
├─ Paid: "Payment received"
    ↓
POST /api/tickets/:ticketId/pharmacy
Authorization: Bearer <token>
{
  verified: true,
  paid: true
}
    ↓
Backend: verifyToken() ← JWT validation
    ↓
Backend: pharmacyController.completePharmacy()
    ├─ Validate verified/paid booleans
    ├─ Verify ticket exists
    ├─ Create pharmacy record
    ├─ Update ticket status → 'pharmacy'
    └─ Return pharmacy details
    ↓
Frontend: Allow ticket completion
    ↓
POST /api/tickets/:ticketId/complete (or similar)
    ↓
Backend: Update ticket status → 'completed'
    ↓
Frontend: Show "Ticket Complete" message
```

## Request/Response Examples

### Successful Patient Registration

```json
Request:
POST /api/patients/register
{
  "firstName": "John",
  "surName": "Doe",
  "lastName": "Smith",
  "phone": "0712345678",
  "DOB": "1990-01-15",
  "gender": "Male",
  "paymentMethod": "mpesa"
}

Response (201 Created):
{
  "message": "Patient registered successfully",
  "ticket": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "ticket_number": 1,
    "patient_id": "550e8400-e29b-41d4-a716-446655440001",
    "status": "waiting"
  },
  "patient": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "full_name": "John Doe Smith",
    "phone": "0712345678"
  }
}
```

### Staff Login

```json
Request:
POST /api/auth/login
{
  "email": "doctor@hospital.com",
  "password": "password123"
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "email": "doctor@hospital.com",
    "full_name": "Dr. Jane Smith",
    "role": "doctor"
  }
}
```

### Get All Tickets

```json
Request:
GET /api/tickets
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200 OK):
{
  "tickets": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "ticket_number": 1,
      "status": "waiting",
      "created_at": "2024-03-09T08:00:00Z",
      "patient": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "full_name": "John Doe Smith",
        "phone_number": "0712345678",
        "dob": "1990-01-15",
        "gender": "Male",
        "payment_method": "mpesa"
      }
    }
  ],
  "total": 1
}
```

### Submit Triage Vitals

```json
Request:
POST /api/tickets/550e8400-e29b-41d4-a716-446655440000/triage
Authorization: Bearer <token>
{
  "temperature": "37.2°C",
  "bloodPressure": "120/80",
  "heartRate": "72bpm",
  "description": "Patient appears stable"
}

Response (201 Created):
{
  "message": "Vitals submitted successfully",
  "triageRecord": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "ticket_id": "550e8400-e29b-41d4-a716-446655440000",
    "temperature": "37.2°C",
    "blood_pressure": "120/80",
    "heart_rate": "72bpm",
    "description": "Patient appears stable",
    "created_at": "2024-03-09T08:30:00Z"
  }
}
```

## Key Integration Points

### 1. Authentication Flow

- Frontend: `src/context/AuthContext.jsx` manages auth state
- Backend: JWT tokens issued on login, verified on protected routes
- Storage: Token stored in localStorage
- Expiration: 24 hours

### 2. Protected Routes

- Frontend: `src/components/ProtectedRoute.jsx` wraps routes
- Frontend: `src/components/RoleGuard.jsx` enforces role-based access
- Backend: `src/middleware/auth.js` verifies token on API routes

### 3. API Calls

- Frontend: `src/api/axios.js` creates Axios instance
- Base URL: `http://localhost:5000/api`
- Interceptor: Automatically adds token to Authorization header
- Error handling: Catches and logs errors

### 4. Database Integration

- Frontend → Backend: HTTP REST API
- Backend → Database: Supabase JavaScript client
- Queries: Raw SQL via migrations
- ORM: None (direct SQL queries)

## Ticket Status Lifecycle

```
                    ┌────────────┐
                    │  Patient   │
                    │ Registers  │
                    └──────┬─────┘
                           │
                           ▼
                    ┌────────────┐
                    │  WAITING   │ ← Initial status
                    └──────┬─────┘
                           │
                    Triage staff reads
                    ticket and submits
                    vital signs
                           │
                           ▼
                    ┌────────────┐
                    │  TRIAGE    │ ← Vitals recorded
                    └──────┬─────┘
                           │
                    Doctor reviews
                    patient and
                    submits diagnosis
                           │
                           ▼
                    ┌────────────┐
              ┌─────│CONSULTATION│ ← Diagnosis recorded
              │     └────────────┘
              │
         Doctor can review
         triage notes or
         re-assess patient
         (no status change)
              │
              └─────→
                           │
                    Pharmacist verifies
                    prescription and
                    payment
                           │
                           ▼
                    ┌────────────┐
                    │ PHARMACY   │ ← Prescription verified
                    └──────┬─────┘
                           │
                    Pharmacist or
                    nurse marks
                    ticket complete
                           │
                           ▼
                    ┌────────────┐
                    │ COMPLETED  │ ← Final status
                    └────────────┘
```

## Error Handling

### Frontend Error Handling

```javascript
// Example from StaffLogin.jsx
try {
  const data = await loginUser(form);
  login(data);
  // Navigate based on role
} catch (err) {
  console.log(err);
  // Display error message to user
}
```

### Backend Error Handling

```javascript
// Example from authController.js
try {
  // Authentication logic
} catch (error) {
  console.error("Login error:", error);
  res.status(500).json({ message: "Server error during login" });
}
```

### Common Errors

| Code | Message                     | Cause             | Solution                    |
| ---- | --------------------------- | ----------------- | --------------------------- |
| 400  | "All fields are required"   | Missing input     | Validate form before submit |
| 401  | "Invalid email or password" | Wrong credentials | Check email/password        |
| 401  | "No token provided"         | Missing header    | Login first                 |
| 401  | "Invalid or expired token"  | Bad/old token     | Login again                 |
| 403  | "Account is not active"     | User suspended    | Contact admin               |
| 404  | "Ticket not found"          | Invalid ticket ID | Use correct ticket ID       |
| 409  | "Email already registered"  | Duplicate email   | Use different email         |
| 500  | "Server error..."           | Backend error     | Check server logs           |

## Development Workflow

### 1. Start Development Environment

```bash
# Terminal 1: Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2: Frontend
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### 2. Test Backend Endpoints

```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

# Or use Postman/Thunder Client
# Import the API endpoints and test manually
```

### 3. Test Frontend Integration

```bash
# Open http://localhost:5173 in browser
# Test patient registration flow
# Test staff login flow
# Check browser console for errors
```

### 4. Monitor Database

```bash
# In Supabase dashboard:
# - Go to Table Editor
# - View user, patient, ticket tables
# - Verify data is being saved
# - Check for any errors
```

## Troubleshooting Guide

### Backend Won't Start

```
Error: Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.

Solution:
1. Check .env file exists
2. Set SUPABASE_URL to valid URL (https://...)
3. Restart server
```

### API Returns 500 Error

```
Check server logs for:
- Database connection errors
- Missing environment variables
- SQL errors from migrations

Solution:
1. Verify .env credentials
2. Run migrations in Supabase
3. Check database tables exist
```

### Frontend Can't Connect to Backend

```
Error: Cannot POST /api/auth/login (CORS error)

Solution:
1. Verify backend running on port 5000
2. Check CORS origin in src/app.js
3. Restart backend if port changed
```

### Token Not Working

```
Error: Invalid or expired token

Solution:
1. Login again to get new token
2. Check token not older than 24 hours
3. Verify JWT_SECRET matches
```

## Next Steps After Implementation

1. **Add More Features**
   - Appointment scheduling
   - Staff availability management
   - Patient records archive
   - Reports and analytics

2. **Improve Security**
   - Add password reset flow
   - Implement rate limiting
   - Add request validation schemas
   - Setup HTTPS

3. **Enhance User Experience**
   - Add real-time notifications
   - Queue management dashboard
   - SMS/Email notifications
   - Mobile app

4. **Scale Infrastructure**
   - Setup production database
   - Deploy to cloud (Heroku, AWS, etc.)
   - Add caching layer
   - Setup monitoring

## Testing Endpoints with Curl

### Register Staff

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@hospital.com",
    "password": "password123",
    "full_name": "Dr. John Smith",
    "role": "doctor"
  }'
```

### Login Staff

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@hospital.com",
    "password": "password123"
  }'
```

### Register Patient

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

### Get Tickets (Protected)

```bash
curl -X GET http://localhost:5000/api/tickets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Conclusion

The backend is fully implemented and ready to connect with the frontend. Follow the setup instructions in [BACKEND_SETUP.md](BACKEND_SETUP.md) to get Supabase configured and the system running.
