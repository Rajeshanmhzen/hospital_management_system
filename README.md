# MedFlow - Hospital Management SaaS Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A modern, scalable SaaS platform for hospital management with multi-tenant architecture, HIPAA compliance, and enterprise-grade security.

## 🏥 Features

- **Multi-Tenant Architecture** - Isolated data per hospital organization
- **Role-Based Access Control** - Admin, Doctor, Nurse, Receptionist roles
- **Patient Management** - Comprehensive patient records and history
- **Appointment Scheduling** - Advanced booking system with conflicts resolution
- **Medical Records** - Secure document storage and management
- **Billing & Subscriptions** - Integrated payment processing
- **Analytics Dashboard** - Real-time insights and reporting
- **HIPAA Compliant** - Healthcare data protection standards
- **Audit Logging** - Complete activity tracking
- **API-First Design** - RESTful APIs with OpenAPI documentation

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand + React Query
- **Authentication**: NextAuth.js
- **Package Manager**: pnpm

### Backend
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js with Helmet security
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for session management
- **Queue**: Bull/BullMQ for background jobs
- **Authentication**: JWT + Refresh tokens
- **File Storage**: Multer for uploads + Local/Cloud storage
- **Email Service**: Nodemailer with SMTP/Gmail
- **Monitoring**: Winston logging + Sentry

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt

## 📁 Project Architecture

```
hospital_management_system/
├── frontend/                    # Next.js frontend application
│   ├── app/                     # App router pages
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/         # Protected dashboard routes
│   │   │   ├── patients/
│   │   │   ├── appointments/
│   │   │   ├── doctors/
│   │   │   └── analytics/
│   │   ├── api/                 # API routes (if using Next.js API)
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   │
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── dialog.tsx
│   │   ├── forms/               # Form components
│   │   │   ├── patient-form.tsx
│   │   │   ├── appointment-form.tsx
│   │   │   └── auth-form.tsx
│   │   ├── charts/              # Chart components
│   │   │   ├── analytics-chart.tsx
│   │   │   └── appointment-chart.tsx
│   │   └── layout/              # Layout components
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── footer.tsx
│   │
│   ├── lib/                     # Utility functions
│   │   ├── utils.ts
│   │   ├── api.ts
│   │   └── auth.ts
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-patients.ts
│   │   └── use-appointments.ts
│   │
│   ├── stores/                  # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── patient-store.ts
│   │   └── appointment-store.ts
│   │
│   ├── types/                   # TypeScript definitions
│   │   ├── auth.types.ts
│   │   ├── patient.types.ts
│   │   └── common.types.ts
│   │
│   ├── public/                  # Static assets
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── .env.local               # Environment variables
│   ├── .gitignore
│   ├── next.config.ts
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/                     # Express.js backend API
│   ├── src/
│   │   ├── controllers/         # HTTP request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── tenant.controller.ts
│   │   │   ├── patient.controller.ts
│   │   │   ├── doctor.controller.ts
│   │   │   ├── appointment.controller.ts
│   │   │   ├── billing.controller.ts
│   │   │   └── upload.controller.ts
│   │   │
│   │   ├── services/            # Business logic layer
│   │   │   ├── auth.service.ts
│   │   │   ├── tenant.service.ts
│   │   │   ├── patient.service.ts
│   │   │   ├── doctor.service.ts
│   │   │   ├── appointment.service.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── billing.service.ts
│   │   │
│   │   ├── repositories/        # Data access layer
│   │   │   ├── base.repository.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── patient.repository.ts
│   │   │   ├── doctor.repository.ts
│   │   │   └── appointment.repository.ts
│   │   │
│   │   ├── routes/              # API route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── patient.routes.ts
│   │   │   ├── doctor.routes.ts
│   │   │   ├── appointment.routes.ts
│   │   │   ├── billing.routes.ts
│   │   │   └── upload.routes.ts
│   │   │
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── tenant.middleware.ts
│   │   │   ├── rateLimit.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── upload.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── validators/          # Input validation schemas
│   │   │   ├── auth.validator.ts
│   │   │   ├── patient.validator.ts
│   │   │   ├── doctor.validator.ts
│   │   │   └── appointment.validator.ts
│   │   │
│   │   ├── utils/               # Helper functions
│   │   │   ├── jwt.util.ts
│   │   │   ├── password.util.ts
│   │   │   ├── encryption.util.ts
│   │   │   ├── email.util.ts
│   │   │   ├── upload.util.ts
│   │   │   ├── response.util.ts
│   │   │   └── audit.util.ts
│   │   │
│   │   ├── config/              # Configuration management
│   │   │   ├── database.config.ts
│   │   │   ├── redis.config.ts
│   │   │   ├── email.config.ts
│   │   │   ├── upload.config.ts
│   │   │   └── app.config.ts
│   │   │
│   │   ├── types/               # TypeScript interfaces
│   │   │   ├── auth.types.ts
│   │   │   ├── tenant.types.ts
│   │   │   ├── patient.types.ts
│   │   │   ├── doctor.types.ts
│   │   │   └── common.types.ts
│   │   │
│   │   ├── jobs/                # Background job processors
│   │   │   ├── email.job.ts
│   │   │   ├── backup.job.ts
│   │   │   └── analytics.job.ts
│   │   │
│   │   ├── app.ts               # Express application setup
│   │   └── server.ts            # Server entry point
│   │
│   ├── prisma/                  # Database schema and migrations
│   │   ├── schema.prisma        # Prisma schema definition
│   │   ├── migrations/          # Database migrations
│   │   └── seed.ts              # Database seeding
│   │
│   ├── uploads/                 # File upload directory
│   │   ├── patients/
│   │   ├── documents/
│   │   └── temp/
│   │
│   ├── dist/                    # Compiled JavaScript output
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
├── docker/                      # Docker configuration
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
├── docs/                        # Documentation
│   ├── api/                     # API documentation
│   ├── deployment/              # Deployment guides
│   └── architecture/            # Architecture decisions
│
├── scripts/                     # Build and deployment scripts
│   ├── setup.sh
│   ├── deploy.sh
│   └── backup.sh
│
├── .gitignore                   # Global gitignore
└── README.md                    # Project documentation
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 20+
- pnpm 8+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/medflow.git
cd hospital_management_system

# Setup Backend
cd backend
pnpm install
cp .env.example .env
# Configure environment variables
pnpm prisma migrate dev
pnpm prisma db seed
pnpm run dev

# Setup Frontend (in new terminal)
cd ../frontend
pnpm install
cp .env.example .env.local
# Configure environment variables
pnpm run dev
```

### Detailed Setup Instructions
- **Backend**: See [backend/README.md](./backend/README.md) for detailed API setup
- **Frontend**: See [frontend/README.md](./frontend/README.md) for detailed UI setup

## 📚 Documentation

- **Backend API**: [backend/README.md](./backend/README.md) - Express.js API documentation
- **Frontend App**: [frontend/README.md](./frontend/README.md) - Next.js application documentation
- **API Documentation**: Available at `http://localhost:3001/api/docs` when backend is running
- **Database Schema**: See `backend/prisma/schema.prisma`

## 🏗️ Database Schema

### Multi-Tenant Design
- **Row-Level Security (RLS)** with tenant isolation
- **Soft deletes** for data recovery
- **Audit trails** for compliance
- **Encrypted PII** fields

### Key Entities
- `Tenant` - Hospital organizations
- `User` - System users with roles
- `Patient` - Patient records
- `Appointment` - Scheduling system
- `MedicalRecord` - Patient medical history
- `Billing` - Payment and subscription management

## 🔐 Security Features

- **OWASP Top 10** protection
- **Rate limiting** and DDoS protection
- **Input validation** and sanitization
- **SQL injection** prevention via Prisma
- **XSS protection** with CSP headers
- **CSRF protection** with tokens
- **Encryption at rest** for sensitive data
- **Audit logging** for compliance

## 📊 API Documentation

- **OpenAPI 3.0** specification
- **Interactive docs** at `/api/docs`
- **Postman collection** available
- **Rate limits**: 1000 req/hour per user

### Core Endpoints
```
POST   /api/v1/auth/login           # User authentication
POST   /api/v1/auth/refresh         # Token refresh
GET    /api/v1/patients             # List patients (paginated)
POST   /api/v1/patients             # Create patient
GET    /api/v1/patients/:id         # Get patient details
PUT    /api/v1/patients/:id         # Update patient
GET    /api/v1/appointments         # List appointments
POST   /api/v1/appointments         # Book appointment
GET    /api/v1/analytics/dashboard  # Dashboard metrics
```

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Rate limiting enabled

### Docker Deployment
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec api pnpm prisma migrate deploy
```

## 📈 Monitoring & Analytics

- **Application Performance**: Sentry error tracking
- **Database Performance**: Prisma query insights
- **Business Metrics**: Custom analytics dashboard
- **Uptime Monitoring**: Health check endpoints
- **Log Aggregation**: Structured logging with Winston

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Write unit tests for services
- Use conventional commits
- Update documentation
- Ensure HIPAA compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.medflow.com](https://docs.medflow.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/medflow/issues)
- **Email**: support@medflow.com
- **Discord**: [Join our community](https://discord.gg/medflow)

---

**Built with ❤️ for healthcare professionals worldwide**