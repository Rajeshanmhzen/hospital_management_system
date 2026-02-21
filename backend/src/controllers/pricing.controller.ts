import { Request, Response } from 'express'
import { PricingPlanService } from '../services/pricingPlan.service'
import { asyncHandler } from '../utils/asyncHandler.utils'

const pricingPlanService = new PricingPlanService()

export const listPublicPricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const plans = await pricingPlanService.listPublicPricingPlan()
  res.json(plans)
})

export const listPricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const plans = await pricingPlanService.listPricingPlan()
  res.json(plans)
})

export const detailPricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const plan = await pricingPlanService.detailPricingPlan(id)

  if (!plan) {
    return res.status(404).json({ error: 'Pricing plan not found' })
  }

  res.json(plan)
})

export const addPricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await pricingPlanService.addPricingPlan(req.body)
  res.status(201).json({ message: "Pricing plan added successfully", data: plan })
})

export const editPricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const plan = await pricingPlanService.editPricingPlan(id, req.body)
  res.status(200).json({ message: "Pricing plan edited successfully", data: plan })
})

export const deletePricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await pricingPlanService.deletePricingPlan(id)
  res.status(200).json({
    success: true,
    message: "Pricing plan deleted successfully",
  })
})
