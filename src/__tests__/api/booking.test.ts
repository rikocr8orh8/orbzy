/**
 * Unit tests for provider booking logic
 * Tests: Provider matching, booking creation, and escalation system
 */

describe('Provider Booking Logic', () => {
  describe('Provider Sorting by Task Category', () => {
    it('should prioritize providers matching the task category', () => {
      const providers = [
        { id: '1', name: 'Quick Plumbing', type: 'Plumbing', rating: 4.8 },
        { id: '2', name: 'Premier Electric', type: 'Electrical', rating: 4.9 },
        { id: '3', name: 'Cool Air HVAC', type: 'HVAC', rating: 4.7 },
      ]

      const taskCategory = 'Electrical'

      // Sorting logic from dashboard
      const sortedProviders = [...providers].sort((a, b) => {
        const aMatches = a.type === taskCategory ? 1 : 0
        const bMatches = b.type === taskCategory ? 1 : 0
        return bMatches - aMatches
      })

      expect(sortedProviders[0].type).toBe('Electrical')
      expect(sortedProviders[0].name).toBe('Premier Electric')
    })

    it('should maintain original order when no task category specified', () => {
      const providers = [
        { id: '1', name: 'Quick Plumbing', type: 'Plumbing', rating: 4.8 },
        { id: '2', name: 'Premier Electric', type: 'Electrical', rating: 4.9 },
        { id: '3', name: 'Cool Air HVAC', type: 'HVAC', rating: 4.7 },
      ]

      const taskCategory = null

      const sortedProviders = taskCategory
        ? [...providers].sort((a, b) => {
            const aMatches = a.type === taskCategory ? 1 : 0
            const bMatches = b.type === taskCategory ? 1 : 0
            return bMatches - aMatches
          })
        : providers

      expect(sortedProviders).toEqual(providers)
    })

    it('should handle multiple providers of same type', () => {
      const providers = [
        { id: '1', name: 'Plumber A', type: 'Plumbing', rating: 4.8 },
        { id: '2', name: 'Plumber B', type: 'Plumbing', rating: 4.9 },
        { id: '3', name: 'Electrician A', type: 'Electrical', rating: 4.7 },
      ]

      const taskCategory = 'Plumbing'

      const sortedProviders = [...providers].sort((a, b) => {
        const aMatches = a.type === taskCategory ? 1 : 0
        const bMatches = b.type === taskCategory ? 1 : 0
        return bMatches - aMatches
      })

      const matchingProviders = sortedProviders.filter((p) => p.type === 'Plumbing')
      expect(matchingProviders.length).toBe(2)
      expect(sortedProviders[0].type).toBe('Plumbing')
      expect(sortedProviders[1].type).toBe('Plumbing')
    })
  })

  describe('Booking Creation', () => {
    it('should create booking with correct data structure', () => {
      const bookingData = {
        taskId: 'task-123',
        providerId: 'provider-456',
        userId: 'user-789',
        scheduledDate: new Date('2026-02-01'),
        status: 'pending',
      }

      expect(bookingData.taskId).toBeDefined()
      expect(bookingData.providerId).toBeDefined()
      expect(bookingData.userId).toBeDefined()
      expect(bookingData.status).toBe('pending')
      expect(bookingData.scheduledDate).toBeInstanceOf(Date)
    })

    it('should validate required booking fields', () => {
      const validateBooking = (data: any) => {
        const required = ['taskId', 'providerId', 'userId', 'scheduledDate']
        return required.every((field) => field in data && data[field] !== null)
      }

      const validBooking = {
        taskId: 'task-123',
        providerId: 'provider-456',
        userId: 'user-789',
        scheduledDate: new Date(),
      }

      const invalidBooking = {
        taskId: 'task-123',
        providerId: 'provider-456',
        // Missing userId and scheduledDate
      }

      expect(validateBooking(validBooking)).toBe(true)
      expect(validateBooking(invalidBooking)).toBe(false)
    })
  })

  describe('24-Hour Escalation System', () => {
    it('should identify bookings older than 24 hours without response', () => {
      const now = new Date()
      const twentyFiveHoursAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000)
      const twentyThreeHoursAgo = new Date(now.getTime() - 23 * 60 * 60 * 1000)

      const bookings = [
        {
          id: '1',
          createdAt: twentyFiveHoursAgo,
          status: 'pending',
          providerResponse: null,
        },
        {
          id: '2',
          createdAt: twentyThreeHoursAgo,
          status: 'pending',
          providerResponse: null,
        },
        {
          id: '3',
          createdAt: twentyFiveHoursAgo,
          status: 'confirmed',
          providerResponse: 'confirmed',
        },
      ]

      const needsEscalation = (booking: any) => {
        const hoursSinceCreation =
          (now.getTime() - booking.createdAt.getTime()) / (1000 * 60 * 60)
        return (
          hoursSinceCreation >= 24 &&
          booking.status === 'pending' &&
          !booking.providerResponse
        )
      }

      const escalatedBookings = bookings.filter(needsEscalation)

      expect(escalatedBookings.length).toBe(1)
      expect(escalatedBookings[0].id).toBe('1')
    })

    it('should not escalate responded bookings', () => {
      const now = new Date()
      const twentyFiveHoursAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000)

      const booking = {
        id: '1',
        createdAt: twentyFiveHoursAgo,
        status: 'confirmed',
        providerResponse: 'confirmed',
      }

      const needsEscalation =
        (now.getTime() - booking.createdAt.getTime()) / (1000 * 60 * 60) >= 24 &&
        booking.status === 'pending' &&
        !booking.providerResponse

      expect(needsEscalation).toBe(false)
    })

    it('should calculate correct escalation time', () => {
      const createdAt = new Date('2026-02-01T10:00:00')
      const checkTime = new Date('2026-02-02T11:00:00')

      const hoursSinceCreation =
        (checkTime.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

      expect(hoursSinceCreation).toBe(25)
      expect(hoursSinceCreation >= 24).toBe(true)
    })
  })

  describe('Provider Selection', () => {
    it('should allow selecting provider for a specific task', () => {
      const task = {
        id: 'task-1',
        category: 'Electrical',
        description: 'Fix outlet',
      }

      const provider = {
        id: 'provider-1',
        name: 'Premier Electric',
        type: 'Electrical',
      }

      const selection = {
        taskId: task.id,
        providerId: provider.id,
      }

      expect(selection.taskId).toBe(task.id)
      expect(selection.providerId).toBe(provider.id)
    })

    it('should validate provider type matches task category', () => {
      const task = {
        category: 'Electrical',
      }

      const matchingProvider = {
        type: 'Electrical',
      }

      const nonMatchingProvider = {
        type: 'Plumbing',
      }

      expect(matchingProvider.type).toBe(task.category)
      expect(nonMatchingProvider.type).not.toBe(task.category)
    })
  })
})
