'use client'

import { useState } from 'react'

const SERVICES = [
  'HVAC',
  'Plumbing',
  'Electrical',
  'Roofing',
  'Pest Control',
  'General Maintenance',
]

export default function TaskForm({ onSubmit }: { onSubmit: (task: any) => void }) {
  const [service, setService] = useState(SERVICES[0])
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Auto-generate task title from service + description
    const autoTitle = description.trim()
      ? `${service} - ${description.trim()}`
      : `${service} Maintenance`

    const taskData = {
      title: autoTitle,
      description,
      category: service,
      location,
      dueDate,
    }

    // Console log for verification
    console.log('📋 Task Form Submitted:', taskData)

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })

    if (res.ok) {
      const task = await res.json()
      console.log('✅ Task Created:', task)
      onSubmit(task)
      // Reset form
      setService(SERVICES[0])
      setLocation('')
      setDescription('')
      setDueDate('')
    } else {
      console.error('❌ Task Creation Failed:', await res.text())
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-3xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Book a Service</h2>

      <label className="block text-sm font-medium text-purple-200 mb-2">
        Select a Service <span className="text-pink-400">*</span>
      </label>
      <select
        value={service}
        onChange={(e) => setService(e.target.value)}
        required
        className="w-full p-3 glass-dark rounded-xl mb-4 font-medium text-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
      >
        {SERVICES.map((srv) => (
          <option key={srv} value={srv} className="bg-gray-900">
            {srv}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium text-purple-200 mb-2">
        Your Location <span className="text-pink-400">*</span>
      </label>
      <input
        type="text"
        placeholder="e.g., London, UK or New York, NY"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
        className="w-full p-3 glass-dark rounded-xl mb-4 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
      />

      <label className="block text-sm font-medium text-purple-200 mb-2">
        What needs fixing? (optional)
      </label>
      <textarea
        placeholder="Describe the issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full p-3 glass-dark rounded-xl mb-4 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
      />

      <label className="block text-sm font-medium text-purple-200 mb-2">
        Preferred Date <span className="text-pink-400">*</span>
      </label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
        className="w-full p-3 glass-dark rounded-xl mb-6 text-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full glass-light px-6 py-4 rounded-2xl text-white font-bold hover:glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  )
}
