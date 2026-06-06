import SquadsPlayOne from '../SquadsPlayOne'
import { getAllSquadCards } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: '揪團列表 (PlayOne 風格) | Sports Squad',
  description: 'PlayOne 風格的進階揪團搜尋介面 - 時段/程度雙滑桿 + Chip 篩選 + Modal 詳情',
}

export default async function SquadsPlayOnePage() {
  // 使用 mock data 確保可離線展示(Supabase 連線不在本機環境)
  const squads = getAllSquadCards('u1')
  return <SquadsPlayOne squads={squads} />
}
