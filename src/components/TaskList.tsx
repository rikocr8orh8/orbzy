'use client'

import { Task } from '@/utils/types'
import { useState } from 'react'

export default function TaskList({ tasks, onTaskUpdate }: { tasks: Task[]; onTaskUpdate: () => void }) {
  const [completing, setCompleting] = useState<string | null>(null)

  const handleComplete = async (taskId: string) => {
    setCompleting(taskId)
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    })

    if (res.ok) {
      onTaskUpdate()
    }
    setCompleting(null)
  }

  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Your Tasks</h2>
      {tasks.length === 0 ? (
        <div className="glass-dark rounded-2xl p-8 text-center">
          <p className="text-purple-200">No tasks yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="glass-light rounded-2xl p-4 border-l-4 border-purple-400">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white mb-1">{task.title}</h3>
                  <div className="inline-block glass-dark px-3 py-1 rounded-full mb-2">
                    <p className="text-xs text-purple-300 font-medium">{task.category}</p>
                  </div>
                  {task.description && <p className="text-purple-200 text-sm mt-2">{task.description}</p>}
                  <p className="text-xs text-purple-300 mt-3 flex items-center gap-2">
                    <span>📅</span>
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleComplete(task.id)}
                  disabled={completing === task.id || task.completed}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    task.completed
                      ? 'glass-dark text-green-400 cursor-default'
                      : 'glass-light text-white hover:glow'
                  } disabled:opacity-50`}
                >
                  {task.completed ? '✓ Done' : 'Mark Done'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
