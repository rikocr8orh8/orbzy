'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import SubscriptionCard from '@/components/SubscriptionCard'
import { Task } from '@/utils/types'
import { type SupportedCurrency } from '@/lib/stripe'

export default function Dashboard() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
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
          <p className="text-purple-200">Schedule and track your home maintenance tasks</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form & Tasks */}
          <div className="space-y-6">
            <TaskForm onSubmit={handleTaskCreated} />
            <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
          </div>

          {/* Right: Tips & Subscription */}
          <div className="space-y-6">
            {/* Maintenance Tips */}
            <div className="glass rounded-3xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Maintenance Tips</h2>

              <div className="space-y-4">
                <div className="glass-dark rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔧</span>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Regular Maintenance</h3>
                      <p className="text-purple-200 text-sm">Schedule routine checks to prevent costly repairs. HVAC filters should be changed every 1-3 months.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-dark rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Seasonal Tasks</h3>
                      <p className="text-purple-200 text-sm">Prepare your home for each season. Check gutters in fall, service AC in spring.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-dark rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Find Local Providers</h3>
                      <p className="text-purple-200 text-sm">Search for qualified professionals in your area. Check reviews and verify credentials before hiring.</p>
                    </div>
                  </div>
                </div>
              </div>
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
