import { Request, Response } from 'express'
import { PricingPlanService } from '../services/pricingPlan.service'

const pricingPlanService = new PricingPlanService()

export const listPublicPricingPlan = async (req: Request, res: Response) => {
  try {
    const plans = await pricingPlanService.listPublicPricingPlan()
    res.json(plans)
  } catch (error) {
    console.error('Error fetching pricing plans:', error)
    res.status(500).json({ error: 'Failed to fetch pricing plans' })
  }
}

export const listPricingPlan = async (req: Request, res: Response) => {
  try {
    const plans = await pricingPlanService.listPricingPlan()
    res.json(plans)
  } catch (error) {
    console.error('Error fetching all pricing plans:', error)
    res.status(500).json({ error: 'Failed to fetch all pricing plans' })
  }
}

export const detailPricingPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const plan = await pricingPlanService.detailPricingPlan(id)

    if (!plan) {
      return res.status(404).json({ error: 'Pricing plan not found' })
    }

    res.json(plan)
  } catch (error) {
    console.error('Error fetching pricing plan:', error)
    res.status(500).json({ error: 'Failed to fetch pricing plan' })
  }
}

export const addPricingPlan = async (req: Request, res: Response) => {
  try {
    const plan = await pricingPlanService.addPricingPlan(req.body)
    res.status(201).json(plan)
  } catch (error) {
    console.error('Error creating pricing plan:', error)
    res.status(500).json({ error: 'Failed to create pricing plan' })
  }
}

export const editPricingPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const plan = await pricingPlanService.editPricingPlan(id, req.body)
    res.json(plan)
  } catch (error) {
    console.error('Error updating pricing plan:', error)
    res.status(500).json({ error: 'Failed to update pricing plan' })
  }
}

export const deletePricingPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await pricingPlanService.deletePricingPlan(id)
    res.status(200).json({
      success: true,
      message: "Pricing plan deleted successfully",
    })
  } catch (error) {
    console.error('Error deleting pricing plan:', error)
    res.status(500).json({ error: 'Failed to delete pricing plan' })
  }
}
