import { getSupabaseClient } from '@/lib/supabase'
import type { Profile, SportType } from '@/lib/types'

const supabase = getSupabaseClient()

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as Profile
}

export async function updateProfile(userId: string, input: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...input, updated_at: new Date().toISOString() } as Record<string, unknown>)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

export async function upsertProfile(userId: string, email: string, fullName: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email,
      full_name: fullName,
      city: '',
      preferred_sports: [],
      skill_level: 'all',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Record<string, unknown>)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}