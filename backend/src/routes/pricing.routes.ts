import { Router } from 'express'
import {
    listPublicPricingPlan,
    listPricingPlan,
    detailPricingPlan,
    addPricingPlan,
    editPricingPlan,
    deletePricingPlan
} from '../controllers/pricing.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

// Public routes
router.get('/list', listPublicPricingPlan)
router.get('/detail/:id', detailPricingPlan)

// Administrative routes - require SuperAdmin authentication
router.use(authMiddleware('SUPER_ADMIN'))

router.get('/admin/list', listPricingPlan)
router.post('/add', addPricingPlan)
router.put('/edit/:id', editPricingPlan)
router.delete('/delete/:id', deletePricingPlan)

export default router
