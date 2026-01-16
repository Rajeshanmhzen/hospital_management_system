import { Router } from 'express'
import { getPricingPlans, getPricingPlanById } from '../controllers/pricing.controller'

const router = Router()

router.get('/', getPricingPlans)
router.get('/:id', getPricingPlanById)

export default router
