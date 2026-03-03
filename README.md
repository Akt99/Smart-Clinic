# Smart Multi-Speciality Clinic Management System

Full-stack starter for a clinic platform with:
- Mobile app (React Native)
- Web app (React)
- Backend API (FastAPI)
- PostgreSQL database
- Department-specific LLM chatbot workflow (OpenAI mock)

## 1) System Architecture (ASCII)

```text
                          +-------------------------+
                          |   React Web (Admin/DR)  |
                          +------------+------------+
                                       |
                          +------------v------------+
                          | React Native Mobile App |
                          +------------+------------+
                                       |
                                       | HTTPS + JWT
                                       v
+-------------------------------------------------------------------+
|                          FastAPI Backend                           |
|  - Auth (OTP + Google OAuth stub)                                 |
|  - Departments/Doctors/Slots                                       |
|  - Appointments (transaction-safe booking)                         |
|  - Chatbot service (prompt templates + guardrails + rate limits)   |
|  - RBAC + middleware + logging                                     |
+--------------------------+----------------------------------------+
                           |
                           | async SQLAlchemy
                           v
+-------------------------------------------------------------------+
|                           PostgreSQL                               |
| users, roles, departments, doctors, doctor_availability_slots,     |
| appointments, chat_sessions, chat_messages                         |
+-------------------------------------------------------------------+
                           |
                           | LLM adapter (mock OpenAI integration)
                           v
                     +--------------+
                     | OpenAI / Mock |
                     +--------------+
```

## 2) Monorepo Structure

```text
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   ├── auth.py
│   │   │   ├── departments.py
│   │   │   ├── doctors.py
│   │   │   ├── appointments.py
│   │   │   ├── chatbot.py
│   │   │   ├── admin.py
│   │   │   └── doctor_panel.py
│   │   ├── core
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── dependencies.py
│   │   │   └── security.py
│   │   ├── models
│   │   ├── repositories
│   │   ├── schemas
│   │   ├── services
│   │   ├── utils
│   │   │   ├── logging.py
│   │   │   └── middleware.py
│   │   └── main.py
│   ├── tests
│   │   └── test_appointment_service.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── db
│   ├── schema.sql
│   ├── seed.sql
│   └── constraints.sql
├── web
│   └── src
│       ├── api
│       ├── app
│       ├── pages
│       └── store
├── mobile
│   ├── App.js
│   └── src
│       ├── api
│       ├── screens
│       └── store
├── docker-compose.yml
└── README.md
```

## 3) Database Schema (Normalized)

### Tables
- `roles(id, name)`
- `users(id, phone_number, google_sub, full_name, role_id)`
- `departments(id, name, prompt_template)`
- `doctors(id, name, specialization, department_id, years_of_experience, consultation_fee, available_time_slots)`
- `doctor_availability_slots(id, doctor_id, slot_time)`
- `appointments(id, patient_id, doctor_id, appointment_time, status)`
- `chat_sessions(id, user_id, department_id)`
- `chat_messages(id, session_id, sender, content)`

### Keys / Constraints
- UUID PK for all tables.
- FKs with cascade/restrict rules.
- No double booking: unique `(doctor_id, appointment_time)`.
- No same user same slot duplicate: unique `(patient_id, doctor_id, appointment_time)`.
- Appointment status enum: `Scheduled | Completed | Cancelled`.
- Sender guardrail in chat messages: `user | assistant | system`.

SQL files:
- [db/schema.sql](/Users/arnabkumartripathy/Desktop/MERN/PROJECTS/clinic management/db/schema.sql)
- [db/constraints.sql](/Users/arnabkumartripathy/Desktop/MERN/PROJECTS/clinic management/db/constraints.sql)
- [db/seed.sql](/Users/arnabkumartripathy/Desktop/MERN/PROJECTS/clinic management/db/seed.sql)

## 4) Department Prompts

Defined in `departments.prompt_template` seed data for:
- Psychiatry
- Gynaecology
- Orthopaedics

Base prompt pattern:

```text
You are a helpful medical assistant for the <Department> department.
You can provide general awareness, first aid guidance and home remedies.
You must not provide prescriptions.
If symptoms are severe, advise booking consultation.
```

## 5) API Endpoints

### Auth
- `POST /api/v1/auth/send-otp`
- `POST /api/v1/auth/verify-otp`
- `GET /api/v1/auth/google-login`

### Departments / Doctors / Slots
- `GET /api/v1/departments`
- `GET /api/v1/departments/{id}/doctors`
- `GET /api/v1/doctors/{id}/slots`

### Appointments
- `POST /api/v1/appointments`
- `GET /api/v1/appointments/me`
- `DELETE /api/v1/appointments/{id}`

### Chatbot
- `POST /api/v1/chat/{department_id}`

### Web Panels (extra)
- `POST /api/v1/admin/doctors`
- `GET /api/v1/admin/analytics`
- `GET /api/v1/doctor-panel/schedule`
- `POST /api/v1/doctor-panel/availability`

## 6) Concurrency-Safe Booking Logic

Implemented in [appointment_service.py](/Users/arnabkumartripathy/Desktop/MERN/PROJECTS/clinic management/backend/app/services/appointment_service.py):
- Validates 30-minute slot boundaries.
- Verifies requested slot exists in `doctor_availability_slots`.
- Uses DB transaction and row locking (`SELECT ... FOR UPDATE`).
- Relies on unique constraints to guarantee no double booking under race.

Core snippet:

```python
async with self.db.begin():
    locked = await self.repo.get_for_update(doctor_id=doctor_id, appointment_time=appointment_time)
    if locked:
        raise ValueError("Slot already booked")

    appointment = Appointment(...)
    await self.repo.create(appointment)
```

## 7) Example LLM Integration (Mock)

Implemented in [chatbot_service.py](/Users/arnabkumartripathy/Desktop/MERN/PROJECTS/clinic management/backend/app/services/chatbot_service.py):
- Department-specific context.
- Severe symptom keyword escalation.
- Doctor recommendation per selected department.
- Chat log persistence in `chat_sessions/chat_messages`.
- Per user+department minute window rate limiting.

Mock adapter sketch for OpenAI:

```python
async def llm_reply(prompt: str) -> str:
    # Replace with OpenAI SDK call using OPENAI_API_KEY
    return f"Mock response for: {prompt[:120]}"
```

## 8) Seeded Departments & Doctors

- Psychiatry
  - Dr. Sam Michael
  - Dr. Robin Ahmed
- Gynaecology
  - Dr. Tom Alter
  - Dr. Vikash Parekh
- Orthopaedics
  - Dr. Ram Vilas
  - Dr. Amar Govind

See [db/seed.sql](/Users/arnabkumartripathy/Desktop/MERN/PROJECTS/clinic management/db/seed.sql).

## 9) Run Locally

```bash
# from repository root
docker compose up --build
```

Backend health:
- `GET http://localhost:8000/health`

## 10) Tests

Unit tests included for:
- Slot boundary validation.
- Conflict prevention when slot already booked.
- Duplicate same user+slot prevention.

Run:

```bash
cd backend
python -m pytest -q
```

## 11) Non-Functional Notes

- Scalable layering (API -> service -> repository -> DB).
- Env-driven config via `.env`.
- Middleware for error handling + JWT claims parse.
- Logging bootstrap included.
- Dockerized backend + PostgreSQL.

## 12) Optional Enhancements Hooks

- `payments` module for Stripe mock.
- Push notifications worker (FCM/APNS).
- Audit logs table + middleware hook.
- WebSocket channel for live chat streaming.
