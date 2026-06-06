import SquadsClient from './SquadsClient'
import { getAllSquadCards } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: '揪團列表 | Sports Squad',
  description: '找到適合你的運動夥伴 - 進階篩選揪團,智能匹配時段與程度',
}

export default async function SquadsPage() {
  // Mock data 模式,確保離線也能展示
  const squads = getAllSquadCards('u1')
  return <SquadsClient squads={squads} />
}
