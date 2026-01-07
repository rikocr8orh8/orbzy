import { chromium } from 'playwright'
import { PrismaClient } from '@prisma/client'
import { createObjectCsvWriter } from 'csv-writer'
import * as path from 'path'

const prisma = new PrismaClient()

interface ScrapedProvider {
  name: string
  category: string
  rating: number
  reviewCount: number
  phone?: string
  address?: string
}

const CATEGORIES = [
  { search: 'hvac austin tx', category: 'HVAC' },
  { search: 'plumber austin tx', category: 'Plumbing' },
  { search: 'electrician austin tx', category: 'Electrical' },
  { search: 'roofing austin tx', category: 'Roofing' },
  { search: 'gutter cleaning austin tx', category: 'General Maintenance' },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function scrapeYelpCategory(
  page: any,
  searchQuery: string,
  category: string,
  maxResults: number = 3
): Promise<ScrapedProvider[]> {
  const providers: ScrapedProvider[] = []

  try {
    console.log(`\n🔍 Searching Yelp for: "${searchQuery}"`)

    // Navigate to Yelp search
    await page.goto(`https://www.yelp.com/search?find_desc=${encodeURIComponent(searchQuery)}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    await delay(3000 + Math.random() * 2000) // Random delay 3-5 seconds

    // Wait for search results
    await page.waitForSelector('[data-testid="serp-ia-card"]', { timeout: 10000 })

    // Get business cards
    const businessCards = await page.$$('[data-testid="serp-ia-card"]')
    console.log(`   Found ${businessCards.length} results`)

    for (let i = 0; i < Math.min(maxResults, businessCards.length); i++) {
      try {
        const card = businessCards[i]

        // Extract business name
        const nameElement = await card.$('a[data-analytics-label="biz-name"]')
        const name = nameElement ? await nameElement.textContent() : null

        if (!name) {
          console.log(`   ⚠️  Skipping business ${i + 1} - no name found`)
          continue
        }

        // Extract rating
        const ratingElement = await card.$('[aria-label*="star rating"]')
        let rating = 0
        if (ratingElement) {
          const ariaLabel = await ratingElement.getAttribute('aria-label')
          const ratingMatch = ariaLabel?.match(/([\d.]+)\s+star/)
          rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0
        }

        // Extract review count
        const reviewElement = await card.$('span[data-font-weight="semibold"]')
        let reviewCount = 0
        if (reviewElement) {
          const reviewText = await reviewElement.textContent()
          const reviewMatch = reviewText?.match(/(\d+)/)
          reviewCount = reviewMatch ? parseInt(reviewMatch[1]) : 0
        }

        // Extract phone (optional)
        const phoneElement = await card.$('p[data-font-weight="semibold"]')
        const phone = phoneElement ? await phoneElement.textContent() : undefined

        // Extract address (optional)
        const addressElement = await card.$('p:has-text("Austin")')
        const address = addressElement ? await addressElement.textContent() : 'Austin, TX'

        const provider: ScrapedProvider = {
          name: name.trim(),
          category,
          rating,
          reviewCount,
          phone: phone?.trim(),
          address: address?.trim(),
        }

        console.log(`   ✅ Scraped: ${provider.name} (${provider.rating}⭐, ${provider.reviewCount} reviews)`)
        providers.push(provider)

        await delay(1000 + Math.random() * 1000) // Random delay between items
      } catch (error) {
        console.error(`   ❌ Error scraping business ${i + 1}:`, error instanceof Error ? error.message : error)
        continue // Skip this provider and continue
      }
    }
  } catch (error) {
    console.error(`❌ Error scraping category "${searchQuery}":`, error instanceof Error ? error.message : error)
  }

  return providers
}

async function insertProvidersToDatabase(providers: ScrapedProvider[]) {
  console.log(`\n💾 Inserting ${providers.length} providers into Railway PostgreSQL...`)

  let successCount = 0
  let failCount = 0

  for (const provider of providers) {
    try {
      await prisma.provider.create({
        data: {
          name: provider.name,
          type: provider.category,
          phone: provider.phone || '(555) 000-0000',
          email: `contact@${provider.name.toLowerCase().replace(/\s+/g, '')}.com`,
          address: provider.address || 'Austin, TX',
          rating: provider.rating,
        },
      })
      console.log(`   ✅ Inserted: ${provider.name}`)
      successCount++
    } catch (error) {
      console.error(`   ❌ Failed to insert ${provider.name}:`, error instanceof Error ? error.message : error)
      failCount++
    }
  }

  console.log(`\n📊 Database Insert Summary:`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Failed: ${failCount}`)
}

async function exportToCSV(providers: ScrapedProvider[]) {
  console.log(`\n📄 Exporting ${providers.length} providers to CSV...`)

  const csvWriter = createObjectCsvWriter({
    path: path.join(process.cwd(), 'scraped-providers.csv'),
    header: [
      { id: 'name', title: 'Name' },
      { id: 'category', title: 'Category' },
      { id: 'rating', title: 'Rating' },
      { id: 'reviewCount', title: 'Review Count' },
      { id: 'phone', title: 'Phone' },
      { id: 'address', title: 'Address' },
    ],
  })

  await csvWriter.writeRecords(providers)
  console.log(`   ✅ CSV exported to: scraped-providers.csv`)
}

async function main() {
  console.log('🚀 Starting Yelp Provider Scraper for Austin, TX\n')

  const browser = await chromium.launch({
    headless: true,
  })

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
  })

  const page = await context.newPage()

  const allProviders: ScrapedProvider[] = []

  // Scrape each category
  for (const { search, category } of CATEGORIES) {
    const providers = await scrapeYelpCategory(page, search, category, 3)
    allProviders.push(...providers)
    await delay(5000 + Math.random() * 3000) // Random delay between categories
  }

  await browser.close()

  console.log(`\n✅ Scraping Complete! Total providers scraped: ${allProviders.length}`)

  // Insert to database
  await insertProvidersToDatabase(allProviders)

  // Export to CSV
  await exportToCSV(allProviders)

  // Close Prisma connection
  await prisma.$disconnect()

  console.log('\n🎉 All done!')
}

main().catch((error) => {
  console.error('💥 Fatal error:', error)
  prisma.$disconnect()
  process.exit(1)
})
