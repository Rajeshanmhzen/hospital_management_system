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
│   ├── controllers/         # HTTP request handlers
│   │   ├── auth.controller.ts
│   │   ├── tenant.controller.ts
│   │   ├── patient.controller.ts
│   │   ├── doctor.controller.ts
│   │   ├── appointment.controller.ts
│   │   ├── billing.controller.ts
│   │   └── upload.controller.ts
│   │
│   ├── services/            # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── tenant.service.ts
│   │   ├── patient.service.ts
│   │   ├── doctor.service.ts
│   │   ├── appointment.service.ts
│   │   ├── notification.service.ts
│   │   ├── email.service.ts
│   │   └── billing.service.ts
│   │
│   ├── repositories/        # Data access layer
│   │   ├── base.repository.ts
│   │   ├── user.repository.ts
│   │   ├── patient.repository.ts
│   │   ├── doctor.repository.ts
│   │   └── appointment.repository.ts
│   │
│   ├── routes/              # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── patient.routes.ts
│   │   ├── doctor.routes.ts
│   │   ├── appointment.routes.ts
│   │   ├── billing.routes.ts
│   │   └── upload.routes.ts
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── tenant.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── upload.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── validators/          # Input validation schemas
│   │   ├── auth.validator.ts
│   │   ├── patient.validator.ts
│   │   ├── doctor.validator.ts
│   │   └── appointment.validator.ts
│   │
│   ├── utils/               # Helper functions
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts
│   │   ├── encryption.util.ts
│   │   ├── email.util.ts
│   │   ├── upload.util.ts
│   │   ├── response.util.ts
│   │   └── audit.util.ts
│   │
│   ├── config/              # Configuration management
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── email.config.ts
│   │   ├── upload.config.ts
│   │   └── app.config.ts
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── auth.types.ts
│   │   ├── tenant.types.ts
│   │   ├── patient.types.ts
│   │   ├── doctor.types.ts
│   │   └── common.types.ts
│   │
│   ├── jobs/                # Background job processors
│   │   ├── email.job.ts
│   │   ├── backup.job.ts
│   │   └── analytics.job.ts
│   │
│   ├── app.ts               # Express application setup
│   └── server.ts            # Server entry point
│
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma        # Prisma schema definition
│   ├── migrations/          # Database migrations
│   └── seed.ts              # Database seeding
│
├── uploads/                 # File upload directory
│   ├── patients/
│   ├── documents/
│   └── temp/
│
├── dist/                    # Compiled JavaScript output
├── .env                     # Environment variables
├── .gitignore
├── package.json
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