# MedFlow Frontend

Next.js frontend application for the MedFlow Hospital Management SaaS platform with modern UI components, responsive design, and real-time features.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand + React Query (TanStack Query)
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for analytics
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📁 Project Structure

```
frontend/
├── app/                     # App router pages
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── verify-code/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── patients/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   └── new/
│   │   ├── appointments/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   └── new/
│   │   ├── doctors/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx
│   │   │   ├── profile/
│   │   │   └── change-password/
│   │   │       └── page.tsx
│   │   └── layout.tsx       # Dashboard layout
│   │
│   ├── api/                 # API routes (if needed)
│   │   └── auth/
│   │
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
│
├── components/              # Reusable UI components
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── form.tsx
│   │   └── toast.tsx
│   │
│   ├── forms/               # Form components
│   │   ├── patient-form.tsx
│   │   ├── appointment-form.tsx
│   │   ├── doctor-form.tsx
│   │   └── auth-form.tsx
│   │
│   ├── charts/              # Chart components
│   │   ├── analytics-chart.tsx
│   │   ├── appointment-chart.tsx
│   │   └── patient-stats.tsx
│   │
│   ├── layout/              # Layout components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── footer.tsx
│   │   └── navigation.tsx
│   │
│   └── common/              # Common components
│       ├── loading.tsx
│       ├── error-boundary.tsx
│       └── data-table.tsx
│
├── lib/                     # Utility functions
│   ├── utils.ts             # General utilities
│   ├── api.ts               # API client configuration
│   ├── auth.ts              # Authentication utilities
│   ├── validations.ts       # Form validation schemas
│   └── constants.ts         # Application constants
│
├── hooks/                   # Custom React hooks
│   ├── use-auth.ts          # Authentication hook
│   ├── use-patients.ts      # Patient data hooks
│   ├── use-appointments.ts  # Appointment data hooks
│   ├── use-doctors.ts       # Doctor data hooks
│   └── use-analytics.ts     # Analytics data hooks
│
├── stores/                  # Zustand stores
│   ├── auth-store.ts        # Authentication state
│   ├── patient-store.ts     # Patient state
│   ├── appointment-store.ts # Appointment state
│   └── ui-store.ts          # UI state (modals, etc.)
│
├── types/                   # TypeScript definitions
│   ├── auth.types.ts        # Authentication types
│   ├── patient.types.ts     # Patient types
│   ├── appointment.types.ts # Appointment types
│   ├── doctor.types.ts      # Doctor types
│   └── common.types.ts      # Common types
│
├── public/                  # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   └── avatars/
│   └── icons/
│       └── favicon.ico
│
├── .env.local               # Environment variables
├── .gitignore
├── next.config.ts           # Next.js configuration
├── package.json
├── tailwind.config.ts       # Tailwind CSS configuration
├── components.json          # shadcn/ui configuration
└── tsconfig.json            # TypeScript configuration
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 20+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Start development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication (NextAuth.js)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your-nextauth-secret"

# External Services
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
```

## 🎨 UI Components

### shadcn/ui Components
- **Forms**: Input, Textarea, Select, Checkbox, Radio
- **Navigation**: Button, Link, Breadcrumb, Pagination
- **Feedback**: Alert, Toast, Dialog, Popover
- **Data Display**: Table, Card, Badge, Avatar
- **Layout**: Container, Grid, Flex, Separator

### Custom Components
- **DataTable**: Sortable, filterable table with pagination
- **PatientForm**: Comprehensive patient registration form
- **AppointmentCalendar**: Interactive appointment scheduling
- **AnalyticsDashboard**: Real-time charts and metrics

## 📱 Pages & Features

### Authentication
- **Login**: Email/password authentication
- **Register**: Hospital registration with tenant setup
- **Forgot Password**: Request password reset via email
- **Verify Code**: Enter verification code from email
- **Reset Password**: Set new password with verification code
- **Change Password**: Update password from dashboard settings

### Dashboard
- **Overview**: Key metrics and recent activities
- **Patients**: Patient management with search and filters
- **Appointments**: Calendar view with booking system
- **Doctors**: Doctor profiles and schedules
- **Analytics**: Charts and reports

### Patient Management
- **Patient List**: Paginated table with search
- **Patient Profile**: Detailed patient information
- **Medical Records**: Document upload and viewing
- **Appointment History**: Past and upcoming appointments

## 🔄 State Management

### Zustand Stores
```typescript
// Auth Store
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false })
}))

// Patient Store
const usePatientStore = create((set) => ({
  patients: [],
  selectedPatient: null,
  setPatients: (patients) => set({ patients }),
  selectPatient: (patient) => set({ selectedPatient: patient })
}))
```

### React Query (TanStack Query)
```typescript
// Patient Queries
export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: () => api.get('/patients').then(res => res.data)
  })
}

// Appointment Mutations
export const useCreateAppointment = () => {
  return useMutation({
    mutationFn: (data) => api.post('/appointments', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments'])
    }
  })
}
```

## 🎯 Custom Hooks

```typescript
// Authentication Hook
export const useAuth = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const login = async (credentials) => {
    // Login logic
  }
  
  const logout = async () => {
    await signOut()
    router.push('/login')
  }
  
  return { session, status, login, logout }
}
```

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run test coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

## 📝 Scripts

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
pnpm run type-check   # Run TypeScript checks
pnpm run format       # Format code with Prettier
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker Deployment
```bash
docker build -t medflow-frontend .
docker run -p 3000:3000 medflow-frontend
```

### Static Export
```bash
pnpm run build
pnpm run export
```

## 🎨 Styling Guidelines

### Tailwind CSS Classes
- **Colors**: Use semantic color names (primary, secondary, accent)
- **Spacing**: Follow 4px grid system (p-4, m-2, etc.)
- **Typography**: Use defined text sizes (text-sm, text-lg, etc.)
- **Responsive**: Mobile-first approach (sm:, md:, lg:, xl:)

### Component Patterns
```typescript
// Button Component Example
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button = ({ variant = 'primary', size = 'md', children }: ButtonProps) => {
  return (
    <button className={cn(
      'rounded-md font-medium transition-colors',
      {
        'bg-primary text-white hover:bg-primary/90': variant === 'primary',
        'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
        'border border-input hover:bg-accent': variant === 'outline'
      },
      {
        'h-8 px-3 text-sm': size === 'sm',
        'h-10 px-4': size === 'md',
        'h-12 px-6 text-lg': size === 'lg'
      }
    )}>
      {children}
    </button>
  )
}
```

## 🔒 Security Best Practices

- **Authentication**: Secure token storage with httpOnly cookies
- **Authorization**: Route protection with middleware
- **Input Validation**: Client-side validation with Zod
- **XSS Protection**: Sanitize user inputs
- **CSRF Protection**: Built-in Next.js protection

## 🤝 Contributing

1. Follow the component structure guidelines
2. Use TypeScript strict mode
3. Write unit tests for components
4. Follow accessibility guidelines (WCAG 2.1)
5. Update Storybook stories for new components