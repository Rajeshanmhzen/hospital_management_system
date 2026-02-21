'use client'
import { useState, useEffect } from 'react'
import { useMantineColorScheme } from '@mantine/core'

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
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

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
      const response = await fetch(`${apiUrl}/api/v1/pricing-plans/list`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPlans(data.sort((a: PricingPlan, b: PricingPlan) => a.displayOrder - b.displayOrder))
    } catch (error) {
      console.error('Error fetching pricing plans:', error)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen p-8 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
              }`}>
              PRICING
            </div>
            <h1 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Simple, Transparent <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Pricing</span>
            </h1>
            <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose the perfect plan for your healthcare facility. Scalable solutions designed for every stage of growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`rounded-lg shadow-sm p-6 border animate-pulse ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <div className={`h-8 rounded mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-12 rounded mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className="space-y-3 mb-6">
                  <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
                <div className={`h-10 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen p-8 flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
        }`}>
        <div className={`rounded-lg p-6 max-w-md border ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
          }`}>
          <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h3 className="font-semibold">Error</h3>
          </div>
          <p className={isDark ? 'text-red-300' : 'text-red-600'}>{error}</p>
          <button
            onClick={fetchPricingPlans}
            className={`mt-4 px-4 py-2 rounded-lg ${isDark ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'
              } text-white`}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-8 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Simple, Transparent <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Pricing</span>
          </h1>
          <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose the perfect plan for your healthcare facility. Scalable solutions designed for every stage of growth.
          </p>

          {/* Rounded Pill Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isAnnual
                ? (isDark ? 'text-white' : 'text-gray-900')
                : (isDark ? 'text-gray-400' : 'text-gray-500')
              }`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-2'
                }`}
              style={{ backgroundColor: isAnnual ? '#3b82f6' : '#d1d5db' }}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'
                  }`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isAnnual
                ? (isDark ? 'text-white' : 'text-gray-900')
                : (isDark ? 'text-gray-400' : 'text-gray-500')
              }`}>
              Annual
              {isAnnual && <span className={`ml-1 font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>Save 20%</span>}
            </span>
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No pricing plans available at the moment.</p>
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
                    className={`rounded-lg shadow-sm p-6 border ${isDark ? 'bg-gray-800' : 'bg-white'
                      } ${isPopular
                        ? (isDark ? 'border-blue-400 border-2' : 'border-blue-500 border-2')
                        : (isDark ? 'border-gray-700' : 'border-gray-200')
                      }`}
                  >
                    {isPopular && (
                      <div
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${isDark ? 'bg-blue-600' : 'bg-blue-500'
                          } text-white`}
                        style={{ zIndex: 10 }}
                      >
                        MOST POPULAR
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {plan.name}
                      </h3>
                      <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {plan.description}
                      </p>

                      <div className="mb-4">
                        {isCustom ? (
                          <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Custom
                          </div>
                        ) : (
                          <>
                            <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              ${price}
                              <span className={`text-lg font-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                /{isAnnual ? 'year' : 'month'}
                              </span>
                            </div>
                            {isAnnual && plan.monthlyPrice > 0 && (
                              <p className={`text-sm mt-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
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
                              className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-green-400' : 'text-green-500'}`}
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {feature}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className={`text-sm italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Contact us for details
                        </li>
                      )}
                    </ul>

                    <button
                      className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${isPopular
                          ? (isDark
                            ? 'bg-blue-600 text-white hover:bg-blue-500'
                            : 'bg-blue-500 text-white hover:bg-blue-600')
                          : (isDark
                            ? 'bg-gray-800 text-blue-400 border-2 border-blue-400 hover:bg-gray-700'
                            : 'bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-50')
                        }`}
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
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Need a custom plan?{' '}
            <a href="/contact" className={`hover:underline font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
              Chat with our experts
            </a>
          </p>
        </div>
      </div>

    </div>
  )
}