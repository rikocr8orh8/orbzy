'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import BookingModal from '@/components/BookingModal'
import ProviderCard from '@/components/ProviderCard'
import { Task, Provider } from '@/utils/types'

const MOCK_PROVIDERS: Provider[] = [
  {
    id: '1',
    name: 'Quick Plumbing',
    type: 'Plumbing',
    phone: '(555) 123-4567',
    email: 'hello@quickplumbing.com',
    address: 'Austin, TX',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Premier Electric',
    type: 'Electrical',
    phone: '(555) 234-5678',
    email: 'info@premierelectric.com',
    address: 'Austin, TX',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Cool Air HVAC',
    type: 'HVAC',
    phone: '(555) 345-6789',
    email: 'service@coolair.com',
    address: 'Austin, TX',
    rating: 4.7,
  },
]

export default function Dashboard() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [bookingModal, setBookingModal] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

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
    const provider = MOCK_PROVIDERS.find((p) => p.id === providerId)
    if (provider && tasks.length > 0) {
      setSelectedTask(tasks[0])
      setSelectedProvider(provider)
      setBookingModal(true)
    }
  }

  const handleBookingComplete = () => {
    fetchTasks()
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
                      ? [...MOCK_PROVIDERS].sort((a, b) => {
                          const aMatches = a.type === latestTaskCategory ? 1 : 0
                          const bMatches = b.type === latestTaskCategory ? 1 : 0
                          return bMatches - aMatches
                        })
                      : MOCK_PROVIDERS

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

            {/* Free Beta Badge */}
            <div className="glass-strong rounded-3xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-block glass-light px-4 py-2 rounded-full mb-4">
                  <p className="text-purple-200 font-bold text-sm">🎉 FREE PRIVATE BETA</p>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">You're an Early Adopter!</h3>
                <p className="text-purple-200 mb-4">
                  Thank you for being part of our private beta. All features are completely free during this testing phase.
                </p>
                <div className="glass-dark rounded-2xl p-4">
                  <p className="text-purple-300 text-sm">
                    ✨ Unlimited bookings<br />
                    ✨ Access to all providers<br />
                    ✨ Priority support
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full filter blur-3xl opacity-20"></div>
            </div>

            {/*
              PAYMENT INTEGRATION (DISABLED FOR PRIVATE BETA)

              To re-enable for public launch:
              1. Uncomment the code block below
              2. Install Stripe: npm install stripe
              3. Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env
              4. Create Stripe checkout session in /api/create-checkout-session
              5. Update the href below to point to Stripe checkout
              6. Remove the "Free Beta Badge" section above
              7. Update tests to include payment flow

            <div className="glass-strong rounded-3xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Unlock Premium Features</h3>
                <p className="text-purple-200 mb-6">
                  Get unlimited bookings, priority support, and exclusive provider access
                </p>
                <a
                  href="/api/create-checkout-session"
                  className="block text-center glass-light px-8 py-4 rounded-2xl text-white font-bold hover:glow transition-all"
                >
                  Subscribe - $15/month
                </a>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full filter blur-3xl opacity-20"></div>
            </div>
            */}
          </div>
        </div>

        {/* Booking Modal */}
        {bookingModal && selectedTask && selectedProvider && (
          <BookingModal
            task={selectedTask}
            provider={selectedProvider}
            allProviders={MOCK_PROVIDERS}
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
