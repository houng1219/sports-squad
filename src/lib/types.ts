// ============================================================
// Sports Squad - Type Definitions
// ============================================================

export type SportType =
  | 'basketball'
  | 'badminton'
  | 'running'
  | 'football'
  | 'volleyball'

export type SquadStatus = 'open' | 'full' | 'cancelled'
export type ParticipationStatus = 'confirmed' | 'pending' | 'cancelled'

// ----- Database Models -----

export interface Profile {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  city: string // 縣市
  district?: string // 區
  preferred_sports: SportType[]
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'all'
  bio?: string
  created_at: string
  updated_at?: string
}

export interface Squad {
  id: string
  title: string
  description?: string
  sport: SportType
  city: string
  district?: string
  location_detail: string // 詳細地址或地點描述
  latitude?: number
  longitude?: number
  scheduled_at: string // ISO datetime
  duration_minutes: number // 比賽/活動持續時間
  max_participants: number
  min_age?: number
  max_age?: number
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all'
  price_per_person: number // 0 = 免費
  equipment?: string // 需要自備的器材
  notes?: string // 注意事項
  status: SquadStatus
  organizer_id: string
  created_at: string
  updated_at: string
}

export interface Participation {
  id: string
  squad_id: string
  user_id: string
  status: ParticipationStatus
  joined_at: string
  // joined from profile (denormalized for query convenience)
  user?: Profile
}

// ----- UI View Models -----

export interface SquadCard extends Squad {
  participant_count: number
  is_organizer: boolean
  userparticipation_status?: ParticipationStatus
  organizer?: Profile
}

export interface Recommendation {
  squad: SquadCard
  reason: string // 為什麼推薦給這個用戶
  score: number // 0-100 match score
}

// ----- Form Input Types -----

export interface CreateSquadInput {
  title: string
  description?: string
  sport: SportType
  city: string
  district?: string
  location_detail: string
  scheduled_at: string
  duration_minutes: number
  max_participants: number
  min_age?: number
  max_age?: number
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all'
  price_per_person: number
  equipment?: string
  notes?: string
}

export interface UpdateProfileInput {
  full_name?: string
  phone?: string
  avatar_url?: string
  city?: string
  district?: string
  preferred_sports?: SportType[]
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'all'
  bio?: string
}

// ----- Constants -----

export const SPORT_LABELS: Record<SportType, string> = {
  basketball: '🏀 籃球',
  badminton: '🏸 羽球',
  running: '🏃 跑步',
  football: '⚽ 足球',
  volleyball: '🏐 排球',
}

export const SPORT_ICONS: Record<SportType, string> = {
  basketball: '🏀',
  badminton: '🏸',
  running: '🏃',
  football: '⚽',
  volleyball: '🏐',
}

export const TAIWAN_CITIES = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '基隆市', '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣',
  '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
  '台東縣', '澎湖縣', '金門縣', '連江縣',
] as const

export type TaiwanCity = typeof TAIWAN_CITIES[number]

export const SKILL_LABELS = {
  beginner: '🌱 初學者',
  intermediate: '⭐ 中級',
  advanced: '🔥 高級',
  all: '👥 不限',
} as const

export const CITY_DISTRICTS: Record<string, string[]> = {
  '台北市': ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
  '新北市': ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '土城區', '蘆洲區', '樹林區', '鶯歌區', '三峽區', '淡水區', '汐止區', '瑞芳區', '五股區', '泰山區', '林口區', '八德區', '坪林區', '石門區', '三芝區', '石碇區', '深坑區', '平溪區', '雙溪區', '貢寮區', '萬里區', '金山區', '烏來區'],
  '桃園市': ['桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '大溪區', '龍潭區', '龜山區', '大園區', '觀音區', '新屋區', '復興區'],
  '台中市': ['中區', '東區', '南區', '西區', '北區', '西屯區', '南屯區', '北屯區', '豐原區', '大里區', '太平區', '清水區', '沙鹿區', '后里區', '神岡區', '潭子區', '大雅區', '新區', '霧峰區', '烏日區', '大肚區', '龍井區', '梧棲區', '清水區'],
  '台南市': ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '後壁區', '白河區', '東山區', '柳營區', '鹽水區', '新營區'],
  '高雄市': ['苓雅區', '前鎮區', '旗津區', '鹽埕區', '鼓山區', '左營區', '楠梓區', '三民區', '新興區', '前金區', '新興區', '新左營區', '仁武區', '大社區', '鳥松區', '林園區', '大寮區', '鳳山區', '大樹區', '田寮區', '阿蓮區', '路竹區', '湖內區', '茄萣區', '永安區', '彌陀區', '梓官區', '橋頭區', '燕巢區', '田寮區', '旗山區', '美濃區', '六龜區', '甲仙區', '杉林區', '內門區', '茂林區', '桃源區', '那瑪夏區'],
}