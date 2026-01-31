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
hospital-management-system/
│
├── apps/
│   ├── public-web/              # Next.js (public site)
│   ├── dashboard/               # React SPA (tenant + admin)
│   └── super-admin/             # Optional separate admin UI
│
├── backend/
│   ├── src/
│   │   ├── config/                  # App & Database configurations
│   │   ├── controllers/             # Express controllers (request handlers)
│   │   ├── middlewares/             # Authentication & global middlewares
│   │   ├── repository/              # Data access layer (Prisma calls)
│   │   ├── routes/                  # API route definitions
│   │   ├── services/                # Business logic layer
│   │   └── utils/                   # Shared utilities
│   ├── prisma/                      # Prisma schemas & migrations
│   └── docs/                        # API & project documentation
│
├── infra/                        # Docker, Nginx, CI/CD
│
├── shared/                      # Shared types & utils
│
├── .env.example
├── docker-compose.yml
├── README.md
└── package.json
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
pnpm db:generate
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

### Super Admin & Pricing
```
POST   /api/v1/super-admin/add              # Create Super Admin
GET    /api/v1/super-admin/tenants/list     # List all tenants
POST   /api/v1/pricing-plans/add            # Create pricing plan
GET    /api/v1/pricing-plans/list           # List public plans
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