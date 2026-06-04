import { Suspense } from 'react'
import SquadsSearch from './SquadsSearch'
import SquadsList from './SquadsList'
import { fetchSquads } from '@/lib/api'
import type { SportType } from '@/lib/types'
import { TAIWAN_CITIES, CITY_DISTRICTS } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function SquadsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; district?: string; sport?: string; skill?: string; step?: string }>
}) {
  const params = await searchParams
  const currentStep = params.step ? parseInt(params.step) : 1

  // Collect available cities from the database
  const allCities = TAIWAN_CITIES

  const squads = await fetchSquads({
    sport: params.sport as SportType | undefined,
    city: params.city,
    skill: params.skill,
  })

  const cityDistricts = params.city ? (CITY_DISTRICTS[params.city] || []) : []

  return (
    <Suspense fallback={<div className="text-center py-20">載入中...</div>}>
      <SquadsSearch
        currentStep={currentStep}
        selectedCity={params.city}
        selectedDistrict={params.district}
        selectedSport={params.sport}
        availableCities={allCities}
        availableDistricts={cityDistricts}
        squads={squads}
      />
    </Suspense>
  )
}