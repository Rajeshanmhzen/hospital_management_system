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
│   ├── app.ts                   # Express app configuration
│   ├── server.ts                # Server entry point
│   ├── config/                  # Centralized config (database, auth, etc.)
│   ├── controllers/             # Controller layer (handles req/res)
│   ├── middlewares/             # Custom Express middlewares
│   ├── repository/              # Data access layer (Prisma repositories)
│   ├── routes/                  # API route definitions
│   ├── services/                # Service layer (business logic)
│   ├── utils/                   # Utility functions
│   └── modules/                 # Special modules (e.g., tenant provisioning)
├── prisma/                      # Prisma schemas (master & tenant)
└── scripts/                     # Helper scripts
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
pnpm db:generate
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

### Super Admin (Base: `/api/v1/super-admin`)
```
POST   /add                         # Create Super Admin
PUT    /edit/:id                    # Edit Super Admin
DELETE /delete/:id                  # Delete Super Admin
POST   /tenants/add                 # Provision Tenant
GET    /tenants/list                # List all Tenants
GET    /tenants/detail/:id          # Tenant details
PUT    /tenants/edit/:id            # Edit Tenant
DELETE /tenants/delete/:id          # De-provision Tenant
GET    /stats                       # Dashboard stats
```

### Pricing Plans (Base: `/api/v1/pricing-plans`)
```
GET    /list                        # List public active plans
GET    /detail/:id                  # Plan details
GET    /admin/list                  # List all plans (Admin)
POST   /add                         # Add new plan
PUT    /edit/:id                    # Edit plan
DELETE /delete/:id                  # Delete plan
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