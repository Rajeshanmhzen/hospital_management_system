'use client'
import { useState, useEffect } from 'react'

interface PricingPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  displayOrder: number
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPricingPlans()
  }, [])

  const fetchPricingPlans = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const response = await fetch(`${apiUrl}/api/v1/pricing-plans`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Fetched pricing data:', data)
      setPlans(data.sort((a: PricingPlan, b: PricingPlan) => a.displayOrder - b.displayOrder))
    } catch (error) {
      console.error('Error fetching pricing plans:', error)
      
      // Fallback to mock data for development
      const mockPlans: PricingPlan[] = [
        {
          id: '1',
          name: 'Basic',
          description: 'Perfect for small clinics',
          monthlyPrice: 99,
          yearlyPrice: 990,
          features: [
            'Up to 50 patients',
            'Basic appointment scheduling',
            'Patient records management',
            'Email support',
            'Mobile app access'
          ],
          displayOrder: 1
        },
        {
          id: '2',
          name: 'Pro',
          description: 'Best for growing practices',
          monthlyPrice: 299,
          yearlyPrice: 2990,
          features: [
            'Unlimited patients',
            'Advanced scheduling',
            'Electronic prescriptions',
            'Lab integration',
            'Priority support',
            'Custom reports',
            'API access'
          ],
          displayOrder: 2
        },
        {
          id: '3',
          name: 'Enterprise',
          description: 'For large healthcare facilities',
          monthlyPrice: 0,
          yearlyPrice: 0,
          features: [
            'Everything in Pro',
            'Multi-location support',
            'Dedicated account manager',
            'Custom integrations',
            'SLA guarantee',
            'On-premise deployment option',
            'Advanced security features'
          ],
          displayOrder: 3
        }
      ]
      
      console.log('Using mock data')
      setPlans(mockPlans)
      setError(null) // Clear error when using mock data
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = (planName: string) => {
    console.log(`Selected plan: ${planName}`)
    // Add your plan selection logic here
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              PRICING
            </div>
            <h1 className="text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Simple, Transparent <span className="text-blue-600 dark:text-blue-400">Pricing</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Choose the perfect plan for your healthcare facility. Scalable solutions designed for every stage of growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3 className="font-semibold">Error</h3>
          </div>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button 
            onClick={fetchPricingPlans}
            className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            PRICING
          </div>
          <h1 className="text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Simple, Transparent <span className="text-blue-600 dark:text-blue-400">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Choose the perfect plan for your healthcare facility. Scalable solutions designed for every stage of growth.
          </p>
          
          {/* Rounded Pill Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              style={{ backgroundColor: isAnnual ? '#3b82f6' : '#d1d5db' }}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
              Annual
              {isAnnual && <span className="ml-1 text-green-600 dark:text-green-400 font-semibold">Save 20%</span>}
            </span>
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No pricing plans available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice
              const isCustom = price === 0
              const isPopular = index === 1

              return (
                <div key={plan.id} className="relative mt-8">
                  <div 
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border ${
                      isPopular ? 'border-blue-500 dark:border-blue-400 border-2' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {isPopular && (
                      <div 
                        className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 dark:bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap"
                        style={{ zIndex: 10 }}
                      >
                        MOST POPULAR
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{plan.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{plan.description}</p>
                      
                      <div className="mb-4">
                        {isCustom ? (
                          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">Custom</div>
                        ) : (
                          <>
                            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                              ${price}
                              <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
                                /{isAnnual ? 'year' : 'month'}
                              </span>
                            </div>
                            {isAnnual && plan.monthlyPrice > 0 && (
                              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                Save {Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100)}%
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6 min-h-[150px]">
                      {Array.isArray(plan.features) && plan.features.length > 0 ? (
                        plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2">
                            <svg 
                              width="20" 
                              height="20" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500 dark:text-gray-400 italic">
                          Contact us for details
                        </li>
                      )}
                    </ul>

                    <button 
                      className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${
                        isPopular 
                          ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500' 
                          : 'bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-400 border-2 border-blue-500 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleSelectPlan(plan.name)}
                    >
                      {isCustom ? 'Contact Sales' : 'Choose Plan'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400">
            Need a custom plan?{' '}
            <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Chat with our experts
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}