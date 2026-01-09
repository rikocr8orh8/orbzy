import { Client, PlaceInputType } from '@googlemaps/google-maps-services-js'

if (!process.env.GOOGLE_PLACES_API_KEY) {
  console.warn('GOOGLE_PLACES_API_KEY is not defined - provider search will be disabled')
}

const client = new Client({})

// Service type mapping to Google Places keywords
export const SERVICE_TYPE_KEYWORDS: Record<string, string[]> = {
  HVAC: ['hvac', 'heating cooling', 'air conditioning'],
  Plumbing: ['plumber', 'plumbing'],
  Electrical: ['electrician', 'electrical'],
  Roofing: ['roofing', 'roofer'],
  'Pest Control': ['pest control', 'exterminator'],
  'General Maintenance': ['handyman', 'home repair'],
}

export interface GooglePlaceResult {
  placeId: string
  name: string
  rating?: number
  userRatingsTotal?: number
  address: string
  phone?: string
  website?: string
  types: string[]
  location: {
    lat: number
    lng: number
  }
  photoReference?: string
}

export interface SearchProvidersParams {
  location: string // "Austin, TX" or "latitude,longitude"
  serviceType: string // HVAC, Plumbing, etc.
  radius?: number // meters, default 25000 (25km)
  minRating?: number // default 4.0
  minReviews?: number // default 50
}

/**
 * Search for providers using Google Places API
 */
export async function searchProviders(
  params: SearchProvidersParams
): Promise<GooglePlaceResult[]> {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key not configured')
  }

  const { location, serviceType, radius = 25000, minRating = 4.0, minReviews = 50 } = params

  // Get keywords for this service type
  const keywords = SERVICE_TYPE_KEYWORDS[serviceType] || [serviceType.toLowerCase()]

  const allResults: GooglePlaceResult[] = []

  // Search for each keyword variant
  for (const keyword of keywords) {
    try {
      const response = await client.textSearch({
        params: {
          query: `${keyword} ${location}`,
          key: process.env.GOOGLE_PLACES_API_KEY,
          type: PlaceInputType.textQuery,
          radius,
        },
      })

      if (response.data.results) {
        const filteredResults = response.data.results
          .filter((place) => {
            const rating = place.rating || 0
            const reviews = place.user_ratings_total || 0
            return rating >= minRating && reviews >= minReviews
          })
          .map((place) => ({
            placeId: place.place_id || '',
            name: place.name || '',
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
            address: place.formatted_address || '',
            types: place.types || [],
            location: {
              lat: place.geometry?.location.lat || 0,
              lng: place.geometry?.location.lng || 0,
            },
            photoReference: place.photos?.[0]?.photo_reference,
          }))

        allResults.push(...filteredResults)
      }
    } catch (error) {
      console.error(`Error searching for ${keyword}:`, error)
    }
  }

  // Remove duplicates based on placeId
  const uniqueResults = allResults.filter(
    (result, index, self) =>
      index === self.findIndex((r) => r.placeId === result.placeId)
  )

  // Sort by rating and review count
  return uniqueResults.sort((a, b) => {
    const scoreA = (a.rating || 0) * Math.log10((a.userRatingsTotal || 1) + 1)
    const scoreB = (b.rating || 0) * Math.log10((b.userRatingsTotal || 1) + 1)
    return scoreB - scoreA
  })
}

/**
 * Get detailed information about a specific place
 */
export async function getPlaceDetails(placeId: string) {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key not configured')
  }

  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_PLACES_API_KEY,
        fields: [
          'name',
          'rating',
          'user_ratings_total',
          'formatted_address',
          'formatted_phone_number',
          'website',
          'opening_hours',
          'reviews',
          'photos',
          'types',
          'geometry',
        ],
      },
    })

    const place = response.data.result

    return {
      placeId,
      name: place.name || '',
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      address: place.formatted_address || '',
      phone: place.formatted_phone_number,
      website: place.website,
      types: place.types || [],
      location: {
        lat: place.geometry?.location.lat || 0,
        lng: place.geometry?.location.lng || 0,
      },
      openingHours: place.opening_hours?.weekday_text,
      reviews: place.reviews?.slice(0, 5), // Top 5 reviews
      photoReference: place.photos?.[0]?.photo_reference,
    }
  } catch (error) {
    console.error('Error fetching place details:', error)
    throw error
  }
}

/**
 * Get Google Maps URL for a place
 */
export function getGoogleMapsUrl(placeId: string): string {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`
}

/**
 * Get photo URL from photo reference
 */
export function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  if (!process.env.GOOGLE_PLACES_API_KEY) return ''
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
}
