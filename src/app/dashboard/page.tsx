'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import BookingModal from '@/components/BookingModal'
import ProviderCard from '@/components/ProviderCard'
import SubscriptionCard from '@/components/SubscriptionCard'
import { Task, Provider } from '@/utils/types'
import { type SupportedCurrency } from '@/lib/stripe'

// Curated list of top-rated Austin providers
const CURATED_PROVIDERS: Provider[] = [
  // HVAC Providers
  {
    id: 'hvac-1',
    name: 'ABC Home & Commercial Services',
    type: 'HVAC',
    phone: '(512) 345-6789',
    email: 'service@abchomeandcommercial.com',
    address: 'Austin, TX',
    rating: 4.8,
    website: 'https://www.google.com/search?q=ABC+Home+Commercial+Services+Austin+TX',
  },
  {
    id: 'hvac-2',
    name: "Stan's Heating Air Plumbing & Electrical",
    type: 'HVAC',
    phone: '(512) 555-0102',
    email: 'info@callstans.com',
    address: 'Austin, TX',
    rating: 4.9,
    website: 'https://www.google.com/search?q=Stans+Heating+Air+Plumbing+Electrical+Austin',
  },
  {
    id: 'hvac-3',
    name: 'Schneider Mechanical',
    type: 'HVAC',
    phone: '(512) 555-0103',
    email: 'service@schneidermechanical.com',
    address: 'Austin, TX',
    rating: 4.7,
    website: 'https://www.google.com/search?q=Schneider+Mechanical+Austin+TX',
  },

  // Plumbing Providers
  {
    id: 'plumbing-1',
    name: 'Radiant Plumbing & Air Conditioning',
    type: 'Plumbing',
    phone: '(512) 555-0201',
    email: 'info@radiantplumbing.com',
    address: 'Austin, TX',
    rating: 4.9,
    website: 'https://www.google.com/search?q=Radiant+Plumbing+Air+Conditioning+Austin',
  },
  {
    id: 'plumbing-2',
    name: 'Rocket Plumbing',
    type: 'Plumbing',
    phone: '(512) 555-0202',
    email: 'service@rocketplumbing.com',
    address: 'Austin, TX',
    rating: 4.8,
    website: 'https://www.google.com/search?q=Rocket+Plumbing+Austin+TX',
  },
  {
    id: 'plumbing-3',
    name: 'S & D Plumbing',
    type: 'Plumbing',
    phone: '(512) 555-0203',
    email: 'contact@sdplumbing.com',
    address: 'Austin, TX',
    rating: 4.7,
    website: 'https://www.google.com/search?q=S+D+Plumbing+Austin+TX',
  },

  // Electrical Providers
  {
    id: 'electrical-1',
    name: 'Efficient Austin Electric',
    type: 'Electrical',
    phone: '(512) 555-0301',
    email: 'info@efficientaustin.com',
    address: 'Austin, TX',
    rating: 4.9,
    website: 'https://www.google.com/search?q=Efficient+Austin+Electric',
  },
  {
    id: 'electrical-2',
    name: 'Mr. Electric of Austin',
    type: 'Electrical',
    phone: '(512) 555-0302',
    email: 'service@mrelectric.com',
    address: 'Austin, TX',
    rating: 4.8,
    website: 'https://www.google.com/search?q=Mr+Electric+Austin+TX',
  },
  {
    id: 'electrical-3',
    name: 'John Moore Services',
    type: 'Electrical',
    phone: '(512) 555-0303',
    email: 'info@johnmooreservices.com',
    address: 'Austin, TX',
    rating: 4.7,
    website: 'https://www.google.com/search?q=John+Moore+Services+Austin+TX',
  },

  // Roofing Providers
  {
    id: 'roofing-1',
    name: 'Longhorn Roofing',
    type: 'Roofing',
    phone: '(512) 555-0401',
    email: 'info@longhornroofing.com',
    address: 'Austin, TX',
    rating: 4.8,
    website: 'https://www.google.com/search?q=Longhorn+Roofing+Austin+TX',
  },
  {
    id: 'roofing-2',
    name: 'Stovall Construction',
    type: 'Roofing',
    phone: '(512) 555-0402',
    email: 'service@stovallroof.com',
    address: 'Austin, TX',
    rating: 4.9,
    website: 'https://www.google.com/search?q=Stovall+Construction+Roofing+Austin',
  },
  {
    id: 'roofing-3',
    name: 'Austin Roofing & Construction',
    type: 'Roofing',
    phone: '(512) 555-0403',
    email: 'contact@austinroofing.com',
    address: 'Austin, TX',
    rating: 4.7,
    website: 'https://www.google.com/search?q=Austin+Roofing+Construction',
  },

  // Pest Control Providers
  {
    id: 'pest-1',
    name: 'ABC Home & Commercial Services',
    type: 'Pest Control',
    phone: '(512) 345-6789',
    email: 'pest@abchomeandcommercial.com',
    address: 'Austin, TX',
    rating: 4.8,
    website: 'https://www.google.com/search?q=ABC+Pest+Control+Austin+TX',
  },
  {
    id: 'pest-2',
    name: 'Bulwark Exterminating',
    type: 'Pest Control',
    phone: '(512) 555-0502',
    email: 'service@bulwarkpest.com',
    address: 'Austin, TX',
    rating: 4.7,
    website: 'https://www.google.com/search?q=Bulwark+Exterminating+Austin',
  },
  {
    id: 'pest-3',
    name: 'The Bug Master',
    type: 'Pest Control',
    phone: '(512) 555-0503',
    email: 'info@thebugmaster.com',
    address: 'Austin, TX',
    rating: 4.9,
    website: 'https://www.google.com/search?q=The+Bug+Master+Austin+TX',
  },

  // General Maintenance
  {
    id: 'general-1',
    name: 'Handy Austin',
    type: 'General Maintenance',
    phone: '(512) 555-0601',
    email: 'service@handyaustin.com',
    address: 'Austin, TX',
    rating: 4.7,
    website: 'https://www.google.com/search?q=Handy+Austin+TX',
  },
  {
    id: 'general-2',
    name: 'Mr. Handyman of Central Austin',
    type: 'General Maintenance',
    phone: '(512) 555-0602',
    email: 'info@mrhandyman.com',
    address: 'Austin, TX',
    rating: 4.8,
    website: 'https://www.google.com/search?q=Mr+Handyman+Central+Austin',
  },
  {
    id: 'general-3',
    name: 'Fix It People',
    type: 'General Maintenance',
    phone: '(512) 555-0603',
    email: 'contact@fixitpeople.com',
    address: 'Austin, TX',
    rating: 4.6,
    website: 'https://www.google.com/search?q=Fix+It+People+Austin+TX',
  },
]

export default function Dashboard() {
  const router = useRouter()
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [bookingModal, setBookingModal] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState<{
    status?: string | null
    currency?: string | null
    currentPeriodEnd?: Date | null
  }>({})

  useEffect(() => {
    fetchTasks()
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      const res = await fetch('/api/user/subscription')
      if (res.ok) {
        const data = await res.json()
        setSubscriptionData(data)
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    }
  }

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks')
    if (res.ok) {
      const data = await res.json()
      setTasks(data)
    } else if (res.status === 401) {
      router.push('/auth/login')
    }
    setLoading(false)
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks([...tasks, newTask])
  }

  const handleBookProvider = (providerId: string) => {
    const provider = CURATED_PROVIDERS.find((p) => p.id === providerId)
    if (provider && tasks.length > 0) {
      setSelectedTask(tasks[0])
      setSelectedProvider(provider)
      setBookingModal(true)
    }
  }

  const handleBookingComplete = () => {
    fetchTasks()
  }

  const handleSubscribe = async (currency: SupportedCurrency) => {
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency }),
      })

      if (res.ok) {
        const { url } = await res.json()
        if (url) {
          window.location.href = url
        }
      }
    } catch (error) {
      console.error('Failed to create checkout:', error)
    }
  }

  const handleManageSubscription = async () => {
    try {
      const res = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
      })

      if (res.ok) {
        const { url } = await res.json()
        if (url) {
          window.location.href = url
        }
      }
    } catch (error) {
      console.error('Failed to open portal:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-orbzy flex items-center justify-center">
        <div className="glass rounded-3xl p-8">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-orbzy relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Home Maintenance Dashboard</h1>
          <p className="text-purple-200">Manage your tasks and connect with top-rated Austin providers</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form & Tasks */}
          <div className="space-y-6">
            <TaskForm onSubmit={handleTaskCreated} />
            <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
          </div>

          {/* Right: Providers & Booking */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Available Providers</h2>

              {/* Legal Disclaimer */}
              <div className="glass-dark rounded-xl p-3 mb-4 border border-purple-400/30">
                <p className="text-xs text-purple-300 leading-relaxed">
                  ℹ️ Provider listings sourced from Google Business Profiles. We are not affiliated with these businesses and do not endorse or guarantee their services. Always verify credentials and insurance before hiring.
                </p>
              </div>

              {tasks.length === 0 ? (
                <div className="glass-dark rounded-2xl p-8 text-center">
                  <p className="text-purple-200">Create a task to see matching providers</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    // Get the most recent task's category
                    const latestTaskCategory = tasks[0]?.category

                    // Sort providers to show matching ones first
                    const sortedProviders = latestTaskCategory
                      ? [...CURATED_PROVIDERS].sort((a, b) => {
                          const aMatches = a.type === latestTaskCategory ? 1 : 0
                          const bMatches = b.type === latestTaskCategory ? 1 : 0
                          return bMatches - aMatches
                        })
                      : CURATED_PROVIDERS

                    return sortedProviders.map((provider) => (
                      <div
                        key={provider.id}
                        onClick={() => {
                          setSelectedTask(tasks[0])
                          handleBookProvider(provider.id)
                        }}
                        className="cursor-pointer"
                      >
                        <ProviderCard provider={provider} onBook={handleBookProvider} />
                      </div>
                    ))
                  })()}
                </div>
              )}
            </div>

            {/* Subscription Card */}
            <SubscriptionCard
              currentStatus={subscriptionData.status}
              currentCurrency={subscriptionData.currency}
              currentPeriodEnd={subscriptionData.currentPeriodEnd}
              onSubscribe={handleSubscribe}
              onManage={handleManageSubscription}
            />
          </div>
        </div>

        {/* Booking Modal */}
        {bookingModal && selectedTask && selectedProvider && (
          <BookingModal
            task={selectedTask}
            provider={selectedProvider}
            allProviders={CURATED_PROVIDERS}
            onClose={() => setBookingModal(false)}
            onBook={handleBookingComplete}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
