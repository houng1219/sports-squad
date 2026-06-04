import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProfileClient from './ProfileClient'
import type { Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  // For MVP, show a demo profile since we don't have auth yet
  // In production, this would use createServerSupabaseClient().auth.getUser()
  const demoProfile: Profile = {
    id: 'demo-user-id',
    email: 'rex@example.com',
    full_name: 'Rex',
    city: '台北市',
    district: '大安區',
    preferred_sports: ['basketball', 'badminton'],
    skill_level: 'intermediate',
    bio: '週末籃球/羽球，常在南港運動中心',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return <ProfileClient profile={demoProfile} />
}