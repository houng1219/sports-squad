import { getSupabaseClient } from '@/lib/supabase'
import type { Squad, SquadCard, CreateSquadInput, SportType, Profile, Participation } from './types'

const supabase = getSupabaseClient()

// ============================================================
// Fetch all squads with participant count + organizer
// ============================================================

export async function fetchSquads(options?: {
  sport?: SportType
  city?: string
  skill?: string
  limit?: number
}): Promise<SquadCard[]> {
  let query = supabase
    .from('squads')
    .select('*')
    .eq('status', 'open')
    .order('scheduled_at', { ascending: true })

  if (options?.sport) query = query.eq('sport', options.sport)
  if (options?.city) query = query.eq('city', options.city)
  if (options?.skill && options.skill !== 'all') query = query.eq('skill_level', options.skill)
  if (options?.limit) query = query.limit(options.limit)

  const { data: squads, error } = await query
  if (error || !squads) return []

  // Get organizer profiles
  const organizerIds = [...new Set(squads.map((s: Squad) => s.organizer_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('id', organizerIds)
  const profileMap: Record<string, Profile> = Object.fromEntries((profiles || []).map((p: Profile) => [p.id, p]))

  // Get participation counts per squad
  const squadIds = squads.map((s: Squad) => s.id)
  const { data: allParticipations } = await supabase
    .from('participations')
    .select('squad_id')
    .in('squad_id', squadIds)
    .eq('status', 'confirmed')

  const countMap: Record<string, number> = {}
  for (const p of allParticipations || []) {
    countMap[p.squad_id as string] = (countMap[p.squad_id as string] || 0) + 1
  }

  return squads.map((s: Squad) => ({
    ...s,
    participant_count: countMap[s.id] || 0,
    is_organizer: false,
    organizer: profileMap[s.organizer_id],
  })) as SquadCard[]
}

// ============================================================
// Fetch single squad by ID with participants
// ============================================================

export async function fetchSquadById(id: string): Promise<SquadCard | null> {
  const { data: squad, error } = await supabase
    .from('squads')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !squad) return null

  const { data: organizer } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', (squad as Squad).organizer_id)
    .single()

  const { data: participations } = await supabase
    .from('participations')
    .select('*')
    .eq('squad_id', id)
    .eq('status', 'confirmed')
    .order('joined_at', { ascending: true })

  const userIds = (participations || []).map((p: Participation) => p.user_id as string)
  const { data: profiles } = userIds.length
    ? await supabase.from('profiles').select('*').in('id', userIds)
    : { data: null }

  const profileMap: Record<string, Profile> = Object.fromEntries((profiles || []).map((p: Profile) => [p.id, p]))

  const enrichedParticipations = (participations || []).map((p: Participation) => ({
    ...p,
    user: profileMap[p.user_id as string],
  }))

  return {
    ...squad,
    participant_count: participations?.length || 0,
    is_organizer: false,
    organizer: organizer as Profile,
    participations_list: enrichedParticipations,
  } as SquadCard
}

// ============================================================
// Create a squad
// ============================================================

export async function createSquad(input: CreateSquadInput, userId: string): Promise<Squad> {
  const { data, error } = await supabase
    .from('squads')
    .insert({ ...input, organizer_id: userId } as Record<string, unknown>)
    .select()
    .single()

  if (error) throw error
  return data as Squad
}

// ============================================================
// Join a squad
// ============================================================

export async function joinSquad(squadId: string, userId: string): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from('participations')
    .upsert({
      squad_id: squadId,
      user_id: userId,
      status: 'confirmed',
      joined_at: new Date().toISOString(),
    } as Record<string, unknown>)

  if (error) throw error

  // Check if now full and update status
  const { data: squad } = await supabase
    .from('squads')
    .select('max_participants, status')
    .eq('id', squadId)
    .single()

  if (squad && squad.status === 'open') {
    const { count } = await supabase
      .from('participations')
      .select('*', { count: 'exact', head: true })
      .eq('squad_id', squadId)
      .eq('status', 'confirmed')

    if (count !== null && count >= squad.max_participants) {
      await supabase.from('squads').update({ status: 'full' }).eq('id', squadId)
    }
  }

  return { success: true }
}

// ============================================================
// Leave a squad
// ============================================================

export async function leaveSquad(squadId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('participations')
    .delete()
    .eq('squad_id', squadId)
    .eq('user_id', userId)

  if (error) throw error

  // Reopen if was full
  const { data: squad } = await supabase
    .from('squads')
    .select('max_participants, status')
    .eq('id', squadId)
    .single()

  if (squad?.status === 'full') {
    const { count } = await supabase
      .from('participations')
      .select('*', { count: 'exact', head: true })
      .eq('squad_id', squadId)
      .eq('status', 'confirmed')

    if (count !== null && count < squad.max_participants) {
      await supabase.from('squads').update({ status: 'open' }).eq('id', squadId)
    }
  }
}

// ============================================================
// Fetch recommendations
// ============================================================

export async function fetchRecommendations(userId: string): Promise<SquadCard[]> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('city, preferred_sports')
    .eq('id', userId)
    .single()

  const allSquads = await fetchSquads()

  if (!profile) return allSquads.slice(0, 6)

  return allSquads
    .map((squad: SquadCard) => {
      let score = 50
      const reasons: string[] = []

      if (squad.city === (profile as Profile).city) { score += 30; reasons.push('同縣市') }

      const userSports = (profile as Profile).preferred_sports || []
      if (userSports.includes(squad.sport as SportType)) {
        score += 20
        reasons.push(`喜歡的${squad.sport}`)
      }

      const slots = squad.max_participants - squad.participant_count
      if (slots >= 5) { score += 10; reasons.push('名額充足') }

      const hoursUntil = (new Date(squad.scheduled_at).getTime() - Date.now()) / 3600000
      if (hoursUntil <= 24 && hoursUntil > 0) { score += 5; reasons.push('即將開始') }
      if (squad.price_per_person === 0) { score += 5; reasons.push('免費') }

      return { squad, score: Math.min(100, score), reason: reasons.join(' · ') || '符合你的偏好' }
    })
    .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
    .slice(0, 6)
    .map((item: { squad: SquadCard }) => item.squad)
}

// ============================================================
// Fetch user participations
// ============================================================

export async function fetchUserSquads(userId: string): Promise<SquadCard[]> {
  const { data: participations } = await supabase
    .from('participations')
    .select('squad_id')
    .eq('user_id', userId)
    .eq('status', 'confirmed')

  if (!participations?.length) return []

  const { data: squads } = await supabase
    .from('squads')
    .select('*')
    .in('id', participations.map((p: Participation) => p.squad_id as string))

  if (!squads) return []

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('id', squads.map((s: Squad) => s.organizer_id))

  const profileMap: Record<string, Profile> = Object.fromEntries((profiles || []).map((p: Profile) => [p.id, p]))

  return squads.map((s: Squad) => ({
    ...s,
    participant_count: 0,
    is_organizer: s.organizer_id === userId,
    organizer: profileMap[s.organizer_id],
  })) as SquadCard[]
}

// ============================================================
// Fetch participants for a squad (for detail page sidebar)
// ============================================================

export async function fetchParticipants(squadId: string) {
  const { data } = await supabase
    .from('participations')
    .select('*, user:profiles(*)')
    .eq('squad_id', squadId)
    .eq('status', 'confirmed')
    .order('joined_at', { ascending: true })

  return (data || []) as (Participation & { user?: Profile })[]
}