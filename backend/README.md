# MedFlow Backend API

Express.js backend API for the MedFlow Hospital Management SaaS platform with multi-tenant architecture, HIPAA compliance, and enterprise-grade security.

## 🚀 Tech Stack

- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js with Helmet security
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for session management
- **Authentication**: JWT + Refresh tokens
- **File Storage**: Multer for uploads + Local storage
- **Email Service**: Nodemailer with SMTP/Gmail
- **Validation**: Zod for input validation
- **Monitoring**: Winston logging + Sentry

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│
│   ├── config/                  # Centralized config
│   │   ├── app.config.ts
│   │   ├── auth.config.ts
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── queue.config.ts
│
│   ├── prisma/
│   │   ├── master/
│   │   │   ├── schema.master.prisma
│   │   │   ├── client.ts
│   │   │   └── migrations/
│   │   │
│   │   └── tenant/
│   │       ├── schema.tenant.prisma
│   │       ├── client.ts
│   │       └── migrations/
│
│   ├── modules/                 # DOMAIN-DRIVEN (KEY)
│   │
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.validator.ts
│   │   │   └── auth.types.ts
│   │
│   │   ├── super-admin/
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   ├── admin.routes.ts
│   │   │   └── admin.validator.ts
│   │
│   │   ├── tenant/
│   │   │   ├── tenant.controller.ts
│   │   │   ├── tenant.service.ts
│   │   │   ├── tenant.routes.ts
│   │   │   ├── tenant.validator.ts
│   │   │   └── tenant.provision.ts   # DB creation logic
│   │
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.validator.ts
│   │
│   │   ├── doctor/
│   │   │   ├── doctor.controller.ts
│   │   │   ├── doctor.service.ts
│   │   │   ├── doctor.repository.ts
│   │   │   ├── doctor.routes.ts
│   │   │   └── doctor.validator.ts
│   │
│   │   ├── patient/
│   │   │   ├── patient.controller.ts
│   │   │   ├── patient.service.ts
│   │   │   ├── patient.repository.ts
│   │   │   ├── patient.routes.ts
│   │   │   └── patient.validator.ts
│   │
│   │   ├── appointment/
│   │   │   ├── appointment.controller.ts
│   │   │   ├── appointment.service.ts
│   │   │   ├── appointment.repository.ts
│   │   │   ├── appointment.routes.ts
│   │   │   └── appointment.validator.ts
│   │
│   │   ├── notification/
│   │   │   ├── notification.service.ts
│   │   │   ├── notification.worker.ts
│   │   │   ├── notification.queue.ts
│   │   │   └── notification.preference.ts
│   │
│   │   ├── billing/
│   │   │   ├── billing.controller.ts
│   │   │   ├── billing.service.ts
│   │   │   └── billing.routes.ts
│   │
│   │   └── audit/
│   │       ├── audit.service.ts
│   │       └── audit.listener.ts
│
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── tenant.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│
│   ├── utils/
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts
│   │   ├── response.util.ts
│   │   ├── logger.util.ts
│   │   └── encryption.util.ts
│
│   ├── routes.ts               # Route aggregator
│   ├── types/
│   │   ├── express.d.ts
│   │   └── common.types.ts
│
│   └── jobs/
│       ├── email.job.ts
│       ├── notification.job.ts
│       └── backup.job.ts
│
├── prisma/
├── tests/
├── Dockerfile
└── tsconfig.json
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 20+
- pnpm 8+
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env

# Start PostgreSQL and Redis
# Using Docker (recommended)
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
docker run --name redis -p 6379:6379 -d redis:7

# Run database migrations
pnpm prisma migrate dev

# Seed the database
pnpm prisma db seed

# Start development server
pnpm run dev
```

## 🔧 Environment Variables

```bash
# Application
NODE_ENV=development
PORT=3001
API_VERSION=v1
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/medflow_dev"
DIRECT_URL="postgresql://postgres:password@localhost:5432/medflow_dev"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# File Upload (Multer)
UPLOAD_PATH="./uploads"
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES="jpg,jpeg,png,pdf,doc,docx"

# Email (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@medflow.com"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
```

## 📊 API Endpoints

### Authentication
```
POST   /api/v1/auth/register        # User registration
POST   /api/v1/auth/login           # User login
POST   /api/v1/auth/refresh         # Refresh token
POST   /api/v1/auth/logout          # User logout
```

### Patients
```
GET    /api/v1/patients             # List patients (paginated)
POST   /api/v1/patients             # Create patient
GET    /api/v1/patients/:id         # Get patient details
PUT    /api/v1/patients/:id         # Update patient
DELETE /api/v1/patients/:id         # Delete patient
```

### Appointments
```
GET    /api/v1/appointments         # List appointments
POST   /api/v1/appointments         # Book appointment
GET    /api/v1/appointments/:id     # Get appointment details
PUT    /api/v1/appointments/:id     # Update appointment
DELETE /api/v1/appointments/:id     # Cancel appointment
```

### File Upload
```
POST   /api/v1/upload/patient       # Upload patient documents
POST   /api/v1/upload/medical       # Upload medical records
```

## 🗄️ Database Schema

### Multi-Tenant Design
- **Row-Level Security (RLS)** with tenant isolation
- **Soft deletes** for data recovery
- **Audit trails** for compliance
- **Encrypted PII** fields

### Key Models
- `Tenant` - Hospital organizations
- `User` - System users with roles
- `Patient` - Patient records
- `Doctor` - Doctor profiles
- `Appointment` - Scheduling system
- `MedicalRecord` - Patient medical history

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based access control** (RBAC)
- **Rate limiting** (100 requests/minute per IP)
- **Input validation** with Zod schemas
- **SQL injection** prevention via Prisma
- **Password hashing** with bcrypt
- **CORS protection**
- **Helmet security headers**

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run integration tests
pnpm test:integration

# Run test coverage
pnpm test:coverage
```

## 📝 Scripts

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run test         # Run tests
pnpm run lint         # Run ESLint
pnpm run format       # Format code with Prettier
```

## 🚀 Deployment

### Production Build
```bash
pnpm run build
pnpm run start
```

### Docker Deployment
```bash
docker build -t medflow-backend .
docker run -p 3001:3001 medflow-backend
```

## 📚 Documentation

- API documentation available at `/api/docs` (Swagger UI)
- Postman collection: `docs/postman/medflow-api.json`
- Database schema: `prisma/schema.prisma`

## 🤝 Contributing

1. Create a feature branch
2. Follow TypeScript strict mode
3. Write unit tests for services
4. Update API documentation
5. Ensure HIPAA compliance