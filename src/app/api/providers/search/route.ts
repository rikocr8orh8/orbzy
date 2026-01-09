import { NextRequest, NextResponse } from 'next/server'
import { searchProviders, getGoogleMapsUrl } from '@/lib/googlePlaces'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const location = searchParams.get('location')
    const serviceType = searchParams.get('serviceType')

    if (!location || !serviceType) {
      return NextResponse.json(
        { error: 'location and serviceType are required' },
        { status: 400 }
      )
    }

    // Check if we have cached results in database first
    const cachedProviders = await prisma.provider.findMany({
      where: {
        type: serviceType,
        city: {
          contains: location.split(',')[0].trim(),
          mode: 'insensitive',
        },
      },
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      take: 20,
    })

    // If we have fresh cached results (less than 7 days old), return them
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const freshCachedProviders = cachedProviders.filter(
      (p) => p.updatedAt > sevenDaysAgo
    )

    if (freshCachedProviders.length >= 5) {
      return NextResponse.json({
        providers: freshCachedProviders.map((p) => ({
          id: p.id,
          name: p.name,
          type: p.type,
          phone: p.phone,
          email: p.email,
          address: p.address,
          rating: p.rating,
          reviewCount: p.reviewCount,
          website: p.website || getGoogleMapsUrl(p.googlePlaceId || ''),
          photoUrl: p.photoUrl,
          latitude: p.latitude,
          longitude: p.longitude,
          googlePlaceId: p.googlePlaceId,
        })),
        source: 'cache',
      })
    }

    // Otherwise, fetch from Google Places API
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      // Fallback to static providers if Google API not configured
      return NextResponse.json({
        providers: cachedProviders.map((p) => ({
          id: p.id,
          name: p.name,
          type: p.type,
          phone: p.phone,
          email: p.email,
          address: p.address,
          rating: p.rating,
          reviewCount: p.reviewCount,
          website: p.website,
        })),
        source: 'database',
      })
    }

    const results = await searchProviders({
      location,
      serviceType,
      radius: 25000, // 25km
      minRating: 4.0,
      minReviews: 50,
    })

    // Store or update providers in database
    const providers = await Promise.all(
      results.map(async (result) => {
        // Check if provider already exists
        let provider = await prisma.provider.findUnique({
          where: { googlePlaceId: result.placeId },
        })

        const providerData = {
          name: result.name,
          type: serviceType,
          phone: result.phone || null,
          email: null, // Google doesn't provide emails
          address: result.address,
          rating: result.rating || 5,
          reviewCount: result.userRatingsTotal || 0,
          googlePlaceId: result.placeId,
          website: result.website || null,
          latitude: result.location.lat,
          longitude: result.location.lng,
          photoUrl: result.photoReference
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${result.photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
            : null,
          city: location.split(',')[0].trim(),
          country: location.split(',').slice(-1)[0].trim(),
        }

        if (provider) {
          // Update existing provider
          provider = await prisma.provider.update({
            where: { id: provider.id },
            data: providerData,
          })
        } else {
          // Create new provider
          provider = await prisma.provider.create({
            data: providerData,
          })
        }

        return provider
      })
    )

    return NextResponse.json({
      providers: providers.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        phone: p.phone,
        email: p.email,
        address: p.address,
        rating: p.rating,
        reviewCount: p.reviewCount,
        website: p.website || getGoogleMapsUrl(p.googlePlaceId || ''),
        photoUrl: p.photoUrl,
        latitude: p.latitude,
        longitude: p.longitude,
        googlePlaceId: p.googlePlaceId,
      })),
      source: 'google',
      count: providers.length,
    })
  } catch (error) {
    console.error('Provider search error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to search providers',
      },
      { status: 500 }
    )
  }
}
