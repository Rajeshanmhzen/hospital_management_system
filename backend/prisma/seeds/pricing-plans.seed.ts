import { config } from 'dotenv'
import { PrismaClient } from '../../node_modules/.prisma/master-client'

config()
const prisma = new PrismaClient()

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small private clinics',
    monthlyPrice: 149,
    yearlyPrice: 1430,
    maxUsers: 5,
    maxPatients: 50,
    features: ['Up to 5 Doctors', 'Patient Records for 50', 'Basic Appointment Scheduling', 'Email Support'],
    displayOrder: 1
  },
  {
    name: 'Professional',
    description: 'Ideal for growing multi-specialty clinics',
    monthlyPrice: 399,
    yearlyPrice: 3830,
    maxUsers: 25,
    maxPatients: -1, // Unlimited
    features: ['Up to 25 Doctors', 'Unlimited Patients', 'Full Practice Management', 'Automated Billing', 'Priority Support'],
    displayOrder: 2
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large hospitals',
    monthlyPrice: 0, // Custom pricing
    yearlyPrice: 0,
    maxUsers: -1,
    maxPatients: -1,
    features: ['Unlimited Doctors & Staff', 'AI-Powered Analytics', 'Multi-facility Support', 'API Access', '24/7 Support'],
    displayOrder: 3
  }
]

async function seedPricingPlans() {
  for (const plan of pricingPlans) {
    await prisma.pricingPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan
    })
  }
  console.log('✅ Pricing plans seeded')
}

seedPricingPlans()
