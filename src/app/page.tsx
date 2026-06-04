import Link from 'next/link'
import { ArrowRight, MapPin, Clock, Users, TrendingUp } from 'lucide-react'
import { SPORT_LABELS, type SportType } from '@/lib/types'
import { getAllSquadCards } from '@/lib/mock-data'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

const SPORT_LIST: SportType[] = [
  'basketball', 'badminton', 'running', 'football',
  'tennis', 'volleyball', 'swimming', 'cycling',
]

function SquadCardHome({ squad }: { squad: ReturnType<typeof getAllSquadCards>[0] }) {
  const sportLabel = SPORT_LABELS[squad.sport]
  const sportEmoji = sportLabel.split(' ')[0]
  const sportText = sportLabel.split(' ')[1]
  const date = new Date(squad.scheduled_at)
  const isFree = squad.price_per_person === 0

  return (
    <Link href={`/squads/${squad.id}`} className="group block bg-white rounded-2xl border border-gray-100 hover:border-fuchsia-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Header with sport color */}
      <div className="bg-gradient-to-r from-fuchsia-500 to-pink-400 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{sportEmoji}</span>
          <div>
            <span className="text-white font-semibold">{sportText}</span>
            <span className="text-fuchsia-100 text-xs ml-2">揪團</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
          <Users className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-sm font-medium">
            {squad.participant_count}/{squad.max_participants}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-fuchsia-600 transition-colors">
          {squad.title}
        </h3>

        <div className="space-y-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{format(date, 'M/dd (EEE) HH:mm', { locale: zhTW })}</span>
            <span className="text-gray-300">·</span>
            <span>{squad.duration_minutes}分鐘</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{squad.district || squad.city} {squad.location_detail}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className={`text-sm font-semibold ${isFree ? 'text-green-600' : 'text-gray-700'}`}>
            {isFree ? '免費' : `${squad.price_per_person}元/人`}
          </span>
          <span className="text-xs text-gray-400">
            主辦：{squad.organizer?.full_name || '未知'}
          </span>
        </div>
      </div>
    </Link>
  )
}

function StatCard({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
      <div className="w-12 h-12 bg-fuchsia-50 rounded-xl flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-fuchsia-500" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  )
}

export default function HomePage() {
  const squads = getAllSquadCards('u1') // u1 is current user (Rex)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-fuchsia-500 via-fuchsia-400 to-pink-300 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              找到運動夥伴
              <br />一起流的汗最好玩
            </h1>
            <p className="text-fuchsia-100 text-lg md:text-xl mb-8">
              瀏覽或發起揪團，根據你的地點與喜好，AI 智能推薦適合的運動社群
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/squads"
                className="flex items-center justify-center gap-2 bg-white text-fuchsia-600 px-6 py-3 rounded-xl font-semibold hover:bg-fuchsia-50 transition-colors"
              >
                瀏覽揪團
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/squads/new"
                className="flex items-center justify-center gap-2 bg-fuchsia-600 text-white px-6 py-3 rounded-xl font-semibold border border-fuchsia-400 hover:bg-fuchsia-500 transition-colors"
              >
                發起揪團
              </Link>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="h-8 bg-gray-50" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={Users} value="847" label="運動夥伴" />
          <StatCard icon={MapPin} value="12" label="覆蓋縣市" />
          <StatCard icon={TrendingUp} value="128" label="本月揪團" />
        </div>
      </section>

      {/* Sports Filter */}
      <section className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">探索球類</h2>
          <Link href="/squads" className="text-sm text-fuchsia-500 hover:text-fuchsia-600 font-medium">
            看全部 →
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {SPORT_LIST.map(sport => {
            const label = SPORT_LABELS[sport]
            const emoji = label.split(' ')[0]
            const text = label.split(' ')[1]
            return (
              <Link
                key={sport}
                href={`/squads?sport=${sport}`}
                className="flex items-center gap-2 bg-white border border-gray-100 hover:border-fuchsia-200 hover:shadow-md rounded-xl px-4 py-3 whitespace-nowrap transition-all"
              >
                <span className="text-xl">{emoji}</span>
                <span className="font-medium text-gray-700 text-sm">{text}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Recent Squads */}
      <section className="max-w-6xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">最新揪團</h2>
          <Link href="/squads" className="text-sm text-fuchsia-500 hover:text-fuchsia-600 font-medium">
            看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {squads.slice(0, 6).map(squad => (
            <SquadCardHome key={squad.id} squad={squad} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">準備好發起了嗎？</h2>
          <p className="text-gray-400 mb-6">設定地點、時間、人數，3分鐘完成發團</p>
          <Link
            href="/squads/new"
            className="inline-flex items-center gap-2 bg-fuchsia-500 hover:bg-fuchsia-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            發起揪團
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}