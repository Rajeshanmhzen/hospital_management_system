import { Request, Response } from 'express'
import { PrismaClient } from '../../node_modules/.prisma/master-client'

const prisma = new PrismaClient()

export const getPricingPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.pricingPlan.findMany({
      where: {
        isActive: true,
        isPublic: true
      },
      orderBy: {
        displayOrder: 'asc'
      }
    })

    res.json(plans)
  } catch (error) {
    console.error('Error fetching pricing plans:', error)
    res.status(500).json({ error: 'Failed to fetch pricing plans' })
  }
}

export const getPricingPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const plan = await prisma.pricingPlan.findUnique({
      where: { id }
    })

    if (!plan) {
      return res.status(404).json({ error: 'Pricing plan not found' })
    }

    res.json(plan)
  } catch (error) {
    console.error('Error fetching pricing plan:', error)
    res.status(500).json({ error: 'Failed to fetch pricing plan' })
  }
}
