export type Task = {
  id: string
  userId: string
  title: string
  description?: string
  category: string
  dueDate: Date
  completed: boolean
  createdAt: Date
}

export type Booking = {
  id: string
  taskId: string
  userId: string
  providerId: string
  scheduledDate: Date
  status: 'pending' | 'confirmed' | 'completed'
  notes?: string
  createdAt: Date
}

export type Provider = {
  id: string
  name: string
  type: string
  phone: string
  email: string
  address: string
  rating: number
  website?: string
}
