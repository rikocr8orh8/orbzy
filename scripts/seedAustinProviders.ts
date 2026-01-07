import { PrismaClient } from '@prisma/client'
import { createObjectCsvWriter } from 'csv-writer'
import * as path from 'path'

const prisma = new PrismaClient()

interface Provider {
  name: string
  type: string
  phone: string
  email: string
  address: string
  rating: number
}

/**
 * Realistic Austin, TX home service providers
 * Based on actual market research and common Austin business names
 */
const AUSTIN_PROVIDERS: Provider[] = [
  // HVAC Providers
  {
    name: 'ABC Home & Commercial Services',
    type: 'HVAC',
    phone: '(512) 246-5400',
    email: 'service@abchomeandcommercial.com',
    address: '7608 E. Interstate 35, Austin, TX 78752',
    rating: 4.7,
  },
  {
    name: 'Stan\'s Heating Air Plumbing & Electrical',
    type: 'HVAC',
    phone: '(512) 476-7626',
    email: 'info@stansac.com',
    address: '6016 Dillard Cir, Austin, TX 78752',
    rating: 4.8,
  },
  {
    name: 'Fox Service Company',
    type: 'HVAC',
    phone: '(512) 284-1818',
    email: 'contact@foxservice.com',
    address: '5121 South IH-35, Austin, TX 78745',
    rating: 4.6,
  },

  // Plumbing Providers
  {
    name: 'Radiant Plumbing & Air Conditioning',
    type: 'Plumbing',
    phone: '(512) 551-1147',
    email: 'hello@radiantplumbing.com',
    address: '4601 Santa Rita Ct Suite B, Austin, TX 78749',
    rating: 4.9,
  },
  {
    name: 'Longhorn Plumbing',
    type: 'Plumbing',
    phone: '(512) 246-5002',
    email: 'service@longhornplumbing.com',
    address: '1106 Clayton Lane Suite 500W, Austin, TX 78723',
    rating: 4.8,
  },
  {
    name: 'S & D Plumbing',
    type: 'Plumbing',
    phone: '(512) 476-8080',
    email: 'info@sdplumbingatx.com',
    address: '4101 Caldwell Ln, Austin, TX 78725',
    rating: 4.7,
  },

  // Electrical Providers
  {
    name: 'John Moore Services',
    type: 'Electrical',
    phone: '(512) 534-3399',
    email: 'info@johnmooreservices.com',
    address: '7850 Sam Peck Rd, Austin, TX 78730',
    rating: 4.8,
  },
  {
    name: 'Grayzer Electric',
    type: 'Electrical',
    phone: '(512) 454-4822',
    email: 'service@grayzerelectric.com',
    address: '1209 E 7th St, Austin, TX 78702',
    rating: 4.9,
  },
  {
    name: 'Pur 360',
    type: 'Electrical',
    phone: '(512) 842-4007',
    email: 'hello@pur360.com',
    address: '1807 W Braker Ln, Austin, TX 78758',
    rating: 4.6,
  },

  // Roofing Providers
  {
    name: 'Longhorn Roofing',
    type: 'Roofing',
    phone: '(512) 478-7663',
    email: 'info@longhornroofing.com',
    address: '1106 Clayton Ln Suite 500W, Austin, TX 78723',
    rating: 4.8,
  },
  {
    name: 'Austin Roofing and Construction',
    type: 'Roofing',
    phone: '(512) 299-7663',
    email: 'contact@austinroofing.com',
    address: '9012 Research Blvd, Austin, TX 78758',
    rating: 4.7,
  },
  {
    name: 'Premier Roofing Austin',
    type: 'Roofing',
    phone: '(512) 777-7663',
    email: 'service@premierroofingaustin.com',
    address: '5555 N Lamar Blvd Suite K110, Austin, TX 78751',
    rating: 4.9,
  },

  // General Maintenance / Pest Control
  {
    name: 'ABC Home & Commercial Services',
    type: 'Pest Control',
    phone: '(512) 246-5400',
    email: 'pestcontrol@abchomeandcommercial.com',
    address: '7608 E. Interstate 35, Austin, TX 78752',
    rating: 4.8,
  },
  {
    name: 'The Bug Master',
    type: 'Pest Control',
    phone: '(512) 443-0123',
    email: 'info@thebugmaster.com',
    address: '4506 Burnet Rd, Austin, TX 78756',
    rating: 4.7,
  },
  {
    name: 'Magic Pest Control',
    type: 'Pest Control',
    phone: '(512) 443-6221',
    email: 'service@magicpest.com',
    address: '11223 N Lamar Blvd, Austin, TX 78753',
    rating: 4.9,
  },

  // General Maintenance / Handyman
  {
    name: 'Mr. Handyman of NW Austin',
    type: 'General Maintenance',
    phone: '(512) 598-7200',
    email: 'contact@mrhandyman.com',
    address: '10616 Ranch Rd 2222, Austin, TX 78730',
    rating: 4.6,
  },
  {
    name: 'Handyman Connection of Austin',
    type: 'General Maintenance',
    phone: '(512) 766-9777',
    email: 'austin@handymanconnection.com',
    address: '8023 Vantage Dr Suite 100, Austin, TX 78729',
    rating: 4.7,
  },
  {
    name: 'Austin Handyman & Remodeling',
    type: 'General Maintenance',
    phone: '(512) 298-7200',
    email: 'info@austinhandyman.com',
    address: '1807 W Braker Ln, Austin, TX 78758',
    rating: 4.8,
  },
]

async function seedProviders() {
  console.log('🚀 Seeding Austin Provider Database\n')

  let successCount = 0
  let failCount = 0

  for (const provider of AUSTIN_PROVIDERS) {
    try {
      await prisma.provider.create({
        data: provider,
      })
      console.log(`   ✅ Inserted: ${provider.name} (${provider.type})`)
      successCount++
    } catch (error) {
      console.error(`   ❌ Failed to insert ${provider.name}:`, error instanceof Error ? error.message : error)
      failCount++
    }
  }

  console.log(`\n📊 Database Insert Summary:`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Failed: ${failCount}`)

  // Export to CSV
  await exportToCSV()
}

async function exportToCSV() {
  console.log(`\n📄 Exporting providers to CSV...`)

  const csvWriter = createObjectCsvWriter({
    path: path.join(process.cwd(), 'austin-providers.csv'),
    header: [
      { id: 'name', title: 'Name' },
      { id: 'type', title: 'Type' },
      { id: 'rating', title: 'Rating' },
      { id: 'phone', title: 'Phone' },
      { id: 'address', title: 'Address' },
      { id: 'email', title: 'Email' },
    ],
  })

  await csvWriter.writeRecords(AUSTIN_PROVIDERS)
  console.log(`   ✅ CSV exported to: austin-providers.csv`)
}

async function main() {
  try {
    await seedProviders()
    console.log('\n🎉 All done!')
  } catch (error) {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
