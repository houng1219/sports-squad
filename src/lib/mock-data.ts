import type { Squad, Profile, SquadCard, Participation } from './types'

// ============================================================
// Mock Profiles
// ============================================================

export const mockProfiles: Profile[] = [
  {
    id: 'u1',
    email: 'rex@gmail.com',
    full_name: 'Rex',
    phone: '0912345678',
    city: '台北市',
    district: '大安區',
    preferred_sports: ['basketball', 'badminton'],
    skill_level: 'intermediate',
    bio: '週末籃球/羽球，常在南港運動中心',
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'u2',
    email: 'wei@example.com',
    full_name: '阿偉',
    phone: '0922333444',
    city: '新北市',
    district: '板橋區',
    preferred_sports: ['badminton', 'running'],
    skill_level: 'intermediate',
    bio: '羽球雙打，業餘好手',
    created_at: '2025-01-05T00:00:00Z',
  },
  {
    id: 'u3',
    email: 'andy@example.com',
    full_name: 'Andy',
    phone: '0933555666',
    city: '台北市',
    district: '信義區',
    preferred_sports: ['basketball'],
    skill_level: 'advanced',
    bio: '業餘籃球，控球後衛',
    created_at: '2025-01-10T00:00:00Z',
  },
  {
    id: 'u4',
    email: 'ting@example.com',
    full_name: '小庭',
    phone: '0944777888',
    city: '桃園市',
    district: '中壢區',
    preferred_sports: ['volleyball', 'running'],
    skill_level: 'beginner',
    bio: '排球初學者，想要多練習',
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'u5',
    email: 'chris@example.com',
    full_name: 'Chris',
    phone: '0955999000',
    city: '台中市',
    district: '西屯區',
    preferred_sports: ['tennis', 'cycling'],
    skill_level: 'intermediate',
    bio: '網球單打，假日喜歡騎車',
    created_at: '2025-01-20T00:00:00Z',
  },
]

// ============================================================
// Mock Squads
// ============================================================

export const mockSquads: Squad[] = [
  {
    id: 's1',
    title: '週六下午籃球三打三',
    description: '南港運動中心室內球場，3對3半場比賽，歡迎各level組隊',
    sport: 'basketball',
    city: '台北市',
    district: '南港區',
    location_detail: '南港運動中心 3F 籃球場',
    scheduled_at: '2025-06-07T14:00:00+08:00',
    duration_minutes: 120,
    max_participants: 12,
    skill_level: 'all',
    price_per_person: 0,
    equipment: '穿籃球鞋即可，球場提供',
    notes: '報名者請準時到場，遲到超過15分鐘取消資格',
    status: 'open',
    organizer_id: 'u1',
    created_at: '2025-06-01T10:00:00Z',
    updated_at: '2025-06-01T10:00:00Z',
  },
  {
    id: 's2',
    title: '平日羽球雙打',
    description: '星期三晚上 2 小時，4組雙打， Intermediate 以上',
    sport: 'badminton',
    city: '新北市',
    district: '板橋區',
    location_detail: '板橋體育館 羽球場',
    scheduled_at: '2025-06-04T19:00:00+08:00',
    duration_minutes: 120,
    max_participants: 8,
    skill_level: 'intermediate',
    price_per_person: 100,
    equipment: '球拍自備，球由主辦提供',
    notes: '繳費後報名成功，臨時取消不退費',
    status: 'open',
    organizer_id: 'u2',
    created_at: '2025-05-30T08:00:00Z',
    updated_at: '2025-05-30T08:00:00Z',
  },
  {
    id: 's3',
    title: '梅雨季路跑團',
    description: '每週二早上 6:30 彩虹河濱公園繞圈，5-10公里自由配速',
    sport: 'running',
    city: '台北市',
    district: '中山區',
    location_detail: '彩虹橋下（法務部後方）',
    scheduled_at: '2025-06-03T06:30:00+08:00',
    duration_minutes: 90,
    max_participants: 20,
    skill_level: 'all',
    price_per_person: 0,
    equipment: '跑鞋、飲水（現場無販賣機）',
    notes: '中雨照常舉行，大雨改室內健身房',
    status: 'open',
    organizer_id: 'u3',
    created_at: '2025-05-28T20:00:00Z',
    updated_at: '2025-05-28T20:00:00Z',
  },
  {
    id: 's4',
    title: '週末排球友誼賽',
    description: '週日下午 3 點，新店籃、排球共用場地，4對4友誼賽',
    sport: 'volleyball',
    city: '新北市',
    district: '新店區',
    location_detail: '新店國民運動中心 2F',
    scheduled_at: '2025-06-08T15:00:00+08:00',
    duration_minutes: 120,
    max_participants: 16,
    skill_level: 'all',
    price_per_person: 0,
    equipment: '排球自備或現場租借（50元）',
    notes: '新手友好，有經驗者帶新手',
    status: 'open',
    organizer_id: 'u4',
    created_at: '2025-06-02T12:00:00Z',
    updated_at: '2025-06-02T12:00:00Z',
  },
  {
    id: 's5',
    title: '週末足球賽',
    description: '週末上午 8 點，市立網球場，COMP 單淘汰',
    sport: 'football',
    city: '台北市',
    district: '北屯區',
    location_detail: '台中市網球中心',
    scheduled_at: '2025-06-14T08:00:00+08:00',
    duration_minutes: 180,
    max_participants: 8,
    skill_level: 'intermediate',
    price_per_person: 200,
    equipment: '球拍自備，比賽用球主辦提供',
    notes: '報名者需自評實力，主辦有權審查資格',
    status: 'open',
    organizer_id: 'u5',
    created_at: '2025-06-01T15:00:00Z',
    updated_at: '2025-06-01T15:00:00Z',
  },
  {
    id: 's6',
    title: '足球友誼賽 5v5',
    description: '下雨備案：室內五人制足球場，5對5，含用鞋',
    sport: 'football',
    city: '台北市',
    district: '松山區',
    location_detail: '迎風球場（台北市松山區南京東路四段）',
    scheduled_at: '2025-06-05T18:00:00+08:00',
    duration_minutes: 90,
    max_participants: 14,
    skill_level: 'intermediate',
    price_per_person: 250,
    equipment: '護脛建議自備，室內球鞋必須',
    notes: '場地費已攤，臨時不來不退費，請找好替補',
    status: 'open',
    organizer_id: 'u2',
    created_at: '2025-05-29T09:00:00Z',
    updated_at: '2025-05-29T09:00:00Z',
  },
  {
    id: 's7',
    title: '晨泳團 每週三五',
    description: '早上6:00 國泳館見，深水水道練習',
    sport: 'volleyball',
    city: '新北市',
    district: '三重區',
    location_detail: '三重國民運動中心 游泳池',
    scheduled_at: '2025-06-06T06:00:00+08:00',
    duration_minutes: 60,
    max_participants: 15,
    skill_level: 'intermediate',
    price_per_person: 80,
    equipment: '泳具自備，泳帽必備',
    notes: '深水區，須能游200m以上',
    status: 'open',
    organizer_id: 'u3',
    created_at: '2025-05-27T07:00:00Z',
    updated_at: '2025-05-27T07:00:00Z',
  },
  {
    id: 's8',
    title: '北投籃球鬥牛',
    description: '週末早上 8 點，北投動作公園，隨到隨打，3對3',
    sport: 'basketball',
    city: '台北市',
    district: '北投區',
    location_detail: '北投動作公園籃球場',
    scheduled_at: '2025-06-07T08:00:00+08:00',
    duration_minutes: 120,
    max_participants: 18,
    skill_level: 'all',
    price_per_person: 0,
    equipment: '籃球鞋，水',
    notes: '免報名，現到現打，但場地人滿需排隊',
    status: 'open',
    organizer_id: 'u4',
    created_at: '2025-06-02T22:00:00Z',
    updated_at: '2025-06-02T22:00:00Z',
  },
]

// ============================================================
// Mock Participations
// ============================================================

export const mockParticipations: Participation[] = [
  { id: 'p1', squad_id: 's1', user_id: 'u2', status: 'confirmed', joined_at: '2025-06-01T11:00:00Z' },
  { id: 'p2', squad_id: 's1', user_id: 'u3', status: 'confirmed', joined_at: '2025-06-01T12:00:00Z' },
  { id: 'p3', squad_id: 's1', user_id: 'u4', status: 'confirmed', joined_at: '2025-06-02T09:00:00Z' },
  { id: 'p4', squad_id: 's2', user_id: 'u1', status: 'confirmed', joined_at: '2025-05-30T10:00:00Z' },
  { id: 'p5', squad_id: 's2', user_id: 'u3', status: 'confirmed', joined_at: '2025-05-31T08:00:00Z' },
  { id: 'p6', squad_id: 's3', user_id: 'u2', status: 'confirmed', joined_at: '2025-05-28T21:00:00Z' },
  { id: 'p7', squad_id: 's4', user_id: 'u1', status: 'confirmed', joined_at: '2025-06-02T13:00:00Z' },
  { id: 'p8', squad_id: 's5', user_id: 'u2', status: 'pending', joined_at: '2025-06-01T16:00:00Z' },
  { id: 'p9', squad_id: 's6', user_id: 'u1', status: 'confirmed', joined_at: '2025-05-29T10:00:00Z' },
  { id: 'p10', squad_id: 's6', user_id: 'u4', status: 'confirmed', joined_at: '2025-05-29T11:00:00Z' },
  { id: 'p11', squad_id: 's6', user_id: 'u5', status: 'confirmed', joined_at: '2025-05-30T07:00:00Z' },
  { id: 'p12', squad_id: 's7', user_id: 'u1', status: 'confirmed', joined_at: '2025-05-27T08:00:00Z' },
]

// ============================================================
// Helper: enrich squad with participation count + organizer
// ============================================================

export function getSquadCard(squad: Squad, currentUserId?: string): SquadCard {
  const participations = mockParticipations.filter(p => p.squad_id === squad.id)
  const organizer = mockProfiles.find(p => p.id === squad.organizer_id)
  return {
    ...squad,
    participant_count: participations.filter(p => p.status === 'confirmed').length,
    is_organizer: currentUserId === squad.organizer_id,
    userparticipation_status: currentUserId
      ? participations.find(p => p.user_id === currentUserId)?.status
      : undefined,
    organizer: organizer,
  }
}

export function getAllSquadCards(currentUserId?: string): SquadCard[] {
  return mockSquads.map(s => getSquadCard(s, currentUserId))
}

export function getSquadById(id: string, currentUserId?: string): SquadCard | undefined {
  const squad = mockSquads.find(s => s.id === id)
  if (!squad) return undefined
  return getSquadCard(squad, currentUserId)
}
// ============================================================
// Testimonials (見證)
// ============================================================

export interface Testimonial {
  id: string
  name: string
  avatar: string
  sport: string
  sport_emoji: string
  rating: number
  quote: string
  highlight: string
  squad_count: number
  city: string
}

export const mockTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: '阿偉',
    avatar: '🦊',
    sport: '羽球',
    sport_emoji: '🏸',
    rating: 5,
    quote: '本來揪羽球都要一個一個私訊問，現在用 SportsSquad 一發就湊滿 8 個人。每週三固定場，還認識了幾個實力相近的球友，進步超有感。',
    highlight: '每週穩定揪到 8 人',
    squad_count: 47,
    city: '新北 板橋',
  },
  {
    id: 't2',
    name: 'Rex',
    avatar: '🐯',
    sport: '籃球',
    sport_emoji: '🏀',
    rating: 5,
    quote: '我以前發籃球揪團最怕「人剛好少一個」。自從用 SportsSquad，系統會主動推薦程度相近的球友，三打三湊到五打五也不是問題。',
    highlight: '從 3 人湊到 12 人',
    squad_count: 23,
    city: '台北 南港',
  },
  {
    id: 't3',
    name: 'Andy',
    avatar: '🐻',
    sport: '路跑',
    sport_emoji: '🏃',
    rating: 5,
    quote: '我原本是跑齡不到一年的新手，自己跑常常偷懶。透過揪團我認識了一群跑友，半年內完成了人生第一場半馬。',
    highlight: '陪 5 個跑友完成半馬',
    squad_count: 31,
    city: '台北 信義',
  },
]
