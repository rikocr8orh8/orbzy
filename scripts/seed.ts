import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create sample providers
  const providers = await prisma.provider.createMany({
    data: [
      {
        name: 'Quick Plumbing',
        type: 'Plumbing',
        phone: '(555) 123-4567',
        email: 'hello@quickplumbing.com',
        address: 'Austin, TX',
        rating: 4.8,
      },
      {
        name: 'Premier Electric',
        type: 'Electrical',
        phone: '(555) 234-5678',
        email: 'info@premierelectric.com',
        address: 'Austin, TX',
        rating: 4.9,
      },
      {
        name: 'Cool Air HVAC',
        type: 'HVAC',
        phone: '(555) 345-6789',
        email: 'service@coolair.com',
        address: 'Austin, TX',
        rating: 4.7,
      },
      {
        name: 'Top Roofing Solutions',
        type: 'Roofing',
        phone: '(555) 456-7890',
        email: 'contact@toproofing.com',
        address: 'Austin, TX',
        rating: 4.6,
      },
      {
        name: 'Pest Control Experts',
        type: 'Pest Control',
        phone: '(555) 567-8901',
        email: 'info@pestexperts.com',
        address: 'Austin, TX',
        rating: 4.5,
      },
    ],
  })

  console.log(`Created ${providers.count} providers`)
  console.log('Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
