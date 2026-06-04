import { Suspense } from 'react'
import SquadsList from './SquadsList'
import { fetchSquads } from '@/lib/api'
import type { SportType } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function SquadsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; city?: string; skill?: string }>
}) {
  const params = await searchParams

  const squads = await fetchSquads({
    sport: params.sport as SportType | undefined,
    city: params.city,
    skill: params.skill,
  })

  return (
    <Suspense fallback={<div className="text-center py-20">載入中...</div>}>
      <SquadsList initialSquads={squads} />
    </Suspense>
  )
}