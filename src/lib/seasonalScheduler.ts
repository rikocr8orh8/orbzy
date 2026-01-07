/**
 * Orbzy Seasonal Maintenance Scheduling Algorithm
 * Intelligently suggests maintenance tasks based on season, location, and home type
 */

export interface SeasonalTask {
  id: string
  title: string
  category: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedCost: { min: number; max: number }
  frequency: 'monthly' | 'quarterly' | 'biannual' | 'annual'
  bestMonths: number[] // 1-12
  description: string
  whyNow: string
  consequences: string
}

export interface Location {
  city: string
  state: string
  climate: 'hot-humid' | 'hot-dry' | 'temperate' | 'cold'
}

export interface HomeProfile {
  type: 'single-family' | 'condo' | 'townhouse' | 'apartment'
  age: number // years
  squareFeet: number
  hasAC: boolean
  hasHeating: boolean
  hasPool: boolean
  hasYard: boolean
  roofAge: number
}

/**
 * Austin-specific seasonal maintenance schedule
 */
const AUSTIN_SEASONAL_TASKS: SeasonalTask[] = [
  // SPRING (March-May)
  {
    id: 'spring-ac-tuneup',
    title: 'AC Pre-Summer Tune-up',
    category: 'HVAC',
    priority: 'critical',
    estimatedCost: { min: 75, max: 150 },
    frequency: 'annual',
    bestMonths: [3, 4, 5],
    description: 'Clean filters, check refrigerant, test thermostat, inspect condenser',
    whyNow: 'Austin summers reach 100°F+ . AC failure in July means $300+ emergency repairs',
    consequences: '30% higher energy bills, potential system failure during peak heat'
  },
  {
    id: 'spring-gutter-cleaning',
    title: 'Gutter Cleaning & Inspection',
    category: 'General',
    priority: 'high',
    estimatedCost: { min: 100, max: 200 },
    frequency: 'biannual',
    bestMonths: [4, 5],
    description: 'Remove debris, check for leaks, ensure proper drainage',
    whyNow: 'Spring storms can overwhelm clogged gutters, causing foundation damage',
    consequences: 'Water damage to foundation, roof leaks, landscape erosion ($5000+ repairs)'
  },
  {
    id: 'spring-pest-control',
    title: 'Spring Pest Prevention Treatment',
    category: 'Pest Control',
    priority: 'high',
    estimatedCost: { min: 80, max: 150 },
    frequency: 'quarterly',
    bestMonths: [3, 4],
    description: 'Interior/exterior treatment for ants, roaches, spiders',
    whyNow: 'Warm weather activates insect breeding cycles',
    consequences: 'Full infestation by summer, food contamination, structural damage from termites'
  },

  // SUMMER (June-August)
  {
    id: 'summer-ac-filter',
    title: 'AC Filter Replacement',
    category: 'HVAC',
    priority: 'critical',
    estimatedCost: { min: 20, max: 50 },
    frequency: 'monthly',
    bestMonths: [6, 7, 8],
    description: 'Replace air filter (MERV 8-13 recommended for allergies)',
    whyNow: 'AC runs 24/7 in Austin summer heat - dirty filters strain system',
    consequences: '20% higher bills, reduced cooling capacity, premature compressor failure ($2000+)'
  },
  {
    id: 'summer-pool-maintenance',
    title: 'Pool Chemical Balance & Cleaning',
    category: 'Pool',
    priority: 'high',
    estimatedCost: { min: 120, max: 200 },
    frequency: 'monthly',
    bestMonths: [5, 6, 7, 8, 9],
    description: 'Test pH/chlorine, clean filters, shock treatment, algae prevention',
    whyNow: 'High temps accelerate algae growth and chemical consumption',
    consequences: 'Green pool, skin irritation, $500+ to restore chemical balance'
  },
  {
    id: 'summer-drought-irrigation',
    title: 'Irrigation System Audit',
    category: 'Landscaping',
    priority: 'medium',
    estimatedCost: { min: 75, max: 150 },
    frequency: 'annual',
    bestMonths: [5, 6],
    description: 'Check for leaks, adjust spray patterns, verify timer settings',
    whyNow: 'Austin water restrictions - maximize efficiency before peak summer',
    consequences: 'Dead landscaping ($2000+ to replace), water waste fines ($500+)'
  },

  // FALL (September-November)
  {
    id: 'fall-heating-prep',
    title: 'Heating System Pre-Winter Check',
    category: 'HVAC',
    priority: 'high',
    estimatedCost: { min: 80, max: 140 },
    frequency: 'annual',
    bestMonths: [9, 10],
    description: 'Test furnace/heat pump, replace filter, check carbon monoxide detector',
    whyNow: 'Ensure heat works before first cold snap (Texas ice storms happen)',
    consequences: 'No heat during freeze, frozen pipes ($3000+ repairs), safety risk'
  },
  {
    id: 'fall-roof-inspection',
    title: 'Roof & Attic Inspection',
    category: 'Roofing',
    priority: 'high',
    estimatedCost: { min: 150, max: 300 },
    frequency: 'annual',
    bestMonths: [9, 10, 11],
    description: 'Check for missing/damaged shingles, attic ventilation, signs of leaks',
    whyNow: 'Identify summer storm damage before winter rains',
    consequences: 'Interior water damage, mold growth, $8000+ roof replacement'
  },
  {
    id: 'fall-chimney-sweep',
    title: 'Chimney Cleaning & Inspection',
    category: 'General',
    priority: 'medium',
    estimatedCost: { min: 120, max: 250 },
    frequency: 'annual',
    bestMonths: [9, 10],
    description: 'Remove creosote buildup, check for blockages, inspect liner',
    whyNow: 'Prepare for fireplace season - prevent house fires',
    consequences: 'Chimney fire risk, carbon monoxide poisoning, $5000+ repairs'
  },

  // WINTER (December-February)
  {
    id: 'winter-pipe-insulation',
    title: 'Pipe Insulation & Freeze Protection',
    category: 'Plumbing',
    priority: 'critical',
    estimatedCost: { min: 100, max: 300 },
    frequency: 'annual',
    bestMonths: [11, 12],
    description: 'Insulate exposed pipes, install freeze protection, service outdoor faucets',
    whyNow: 'Austin gets surprise freezes - pipes burst in attics and crawl spaces',
    consequences: 'Burst pipes = $5000-$15000 in water damage, mold, repairs'
  },
  {
    id: 'winter-weatherstrip',
    title: 'Weatherstripping & Insulation Check',
    category: 'General',
    priority: 'medium',
    estimatedCost: { min: 100, max: 250 },
    frequency: 'annual',
    bestMonths: [10, 11],
    description: 'Seal air leaks around doors/windows, add attic insulation if needed',
    whyNow: 'Reduce heating costs during occasional cold spells',
    consequences: '25% higher energy bills, uncomfortable drafts'
  },

  // YEAR-ROUND
  {
    id: 'quarterly-hvac-filter',
    title: 'HVAC Filter Check',
    category: 'HVAC',
    priority: 'high',
    estimatedCost: { min: 15, max: 40 },
    frequency: 'quarterly',
    bestMonths: [1, 4, 7, 10],
    description: 'Inspect and replace if dirty (every 1-3 months depending on usage)',
    whyNow: 'Cedar fever season in Austin clogs filters faster',
    consequences: 'Poor air quality, higher bills, system strain'
  },
  {
    id: 'annual-water-heater',
    title: 'Water Heater Flush & Inspection',
    category: 'Plumbing',
    priority: 'medium',
    estimatedCost: { min: 100, max: 175 },
    frequency: 'annual',
    bestMonths: [3, 4, 9, 10],
    description: 'Drain sediment, check pressure relief valve, inspect for leaks',
    whyNow: 'Austin hard water causes mineral buildup - flush extends lifespan',
    consequences: 'Premature failure (10yr → 6yr lifespan), $1200+ replacement'
  },
  {
    id: 'biannual-dryer-vent',
    title: 'Dryer Vent Cleaning',
    category: 'General',
    priority: 'high',
    estimatedCost: { min: 90, max: 150 },
    frequency: 'biannual',
    bestMonths: [3, 9],
    description: 'Remove lint from vent duct, check exterior vent flap',
    whyNow: 'Lint buildup is #1 cause of house fires',
    consequences: 'House fire risk, 50% longer dry times, $200/yr wasted energy'
  }
]

/**
 * Algorithm to generate personalized maintenance schedule
 */
export function generateMaintenanceSchedule(
  location: Location,
  homeProfile: HomeProfile,
  currentDate: Date = new Date()
): SeasonalTask[] {
  const currentMonth = currentDate.getMonth() + 1 // 1-12
  const nextThreeMonths = [
    currentMonth,
    currentMonth % 12 + 1,
    (currentMonth + 1) % 12 + 1
  ]

  // Filter tasks based on home profile
  const applicableTasks = AUSTIN_SEASONAL_TASKS.filter(task => {
    // Skip pool tasks if no pool
    if (task.category === 'Pool' && !homeProfile.hasPool) return false

    // Skip heating tasks if no heating system
    if (task.title.includes('Heating') && !homeProfile.hasHeating) return false

    // Skip AC tasks if no AC (rare in Austin!)
    if (task.category === 'HVAC' && !homeProfile.hasAC && task.title.includes('AC')) return false

    // Skip yard tasks for condos/apartments
    if (task.category === 'Landscaping' && !homeProfile.hasYard) return false

    return true
  })

  // Score tasks based on timing and urgency
  const scoredTasks = applicableTasks.map(task => {
    let score = 0

    // Priority scoring
    const priorityScores = { critical: 100, high: 75, medium: 50, low: 25 }
    score += priorityScores[task.priority]

    // Timing scoring (is it the right month?)
    const isOptimalMonth = task.bestMonths.includes(currentMonth)
    const isUpcomingMonth = nextThreeMonths.some(m => task.bestMonths.includes(m))

    if (isOptimalMonth) score += 50
    else if (isUpcomingMonth) score += 25

    // Age-based scoring (older homes need more maintenance)
    if (homeProfile.age > 15) {
      if (task.category === 'Roofing' || task.category === 'Plumbing') score += 20
    }
    if (homeProfile.age > 25) score += 10 // All tasks more critical

    // Size-based scoring
    if (homeProfile.squareFeet > 2500) {
      if (task.category === 'HVAC') score += 15 // Larger systems need more care
    }

    return { ...task, score }
  })

  // Sort by score (highest first) and return top recommendations
  return scoredTasks
    .sort((a, b) => b.score - a.score)
    .slice(0, 10) // Return top 10 tasks
}

/**
 * Get tasks due in a specific month
 */
export function getTasksForMonth(month: number, homeProfile: HomeProfile): SeasonalTask[] {
  return AUSTIN_SEASONAL_TASKS.filter(task => {
    // Apply home profile filters
    if (task.category === 'Pool' && !homeProfile.hasPool) return false
    if (!homeProfile.hasYard && task.category === 'Landscaping') return false

    // Check if task is recommended for this month
    return task.bestMonths.includes(month)
  })
}

/**
 * Calculate annual maintenance budget
 */
export function estimateAnnualCost(homeProfile: HomeProfile): { min: number; max: number } {
  const applicableTasks = AUSTIN_SEASONAL_TASKS.filter(task => {
    if (task.category === 'Pool' && !homeProfile.hasPool) return false
    if (!homeProfile.hasYard && task.category === 'Landscaping') return false
    return true
  })

  const frequencyMultipliers = {
    monthly: 12,
    quarterly: 4,
    biannual: 2,
    annual: 1
  }

  let minTotal = 0
  let maxTotal = 0

  applicableTasks.forEach(task => {
    const multiplier = frequencyMultipliers[task.frequency]
    minTotal += task.estimatedCost.min * multiplier
    maxTotal += task.estimatedCost.max * multiplier
  })

  return { min: Math.round(minTotal), max: Math.round(maxTotal) }
}

/**
 * Send proactive reminders based on schedule
 */
export function shouldSendReminder(task: SeasonalTask, currentDate: Date): boolean {
  const currentMonth = currentDate.getMonth() + 1
  const nextMonth = currentMonth % 12 + 1

  // Send reminder 2-4 weeks before optimal month
  return task.bestMonths.includes(nextMonth)
}
