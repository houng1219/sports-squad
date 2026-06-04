'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Clock, Users, Search, Filter } from 'lucide-react'
import { SPORT_LABELS, TAIWAN_CITIES, SKILL_LABELS, type SportType } from '@/lib/types'
import { getAllSquadCards } from '@/lib/mock-data'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

function SquadCard({ squad }: { squad: ReturnType<typeof getAllSquadCards>[0] }) {
  const sportLabel = SPORT_LABELS[squad.sport]
  const sportEmoji = sportLabel.split(' ')[0]
  const sportText = sportLabel.split(' ')[1]
  const date = new Date(squad.scheduled_at)
  const isFree = squad.price_per_person === 0
  const isFull = squad.participant_count >= squad.max_participants

  return (
    <Link href={`/squads/${squad.id}`} className="group block bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{sportEmoji}</span>
          <span className="text-white font-semibold">{sportText}</span>
        </div>
        <div className="flex items-center gap-2">
          {isFull ? (
            <span className="text-xs bg-white/30 text-white px-2 py-1 rounded-full">已額滿</span>
          ) : (
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
              <Users className="w-3.5 h-3.5 text-white" />
              <span className="text-white text-sm font-medium">
                {squad.participant_count}/{squad.max_participants}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
          {squad.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{squad.description}</p>

        <div className="space-y-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{format(date, 'M/dd (EEE) HH:mm', { locale: zhTW })}</span>
            <span className="text-gray-300">·</span>
            <span>{squad.duration_minutes}分鐘</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{squad.city}{squad.district ? ` ${squad.district}` : ''}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              squad.skill_level === 'all' ? 'bg-gray-100 text-gray-600' :
              squad.skill_level === 'beginner' ? 'bg-green-50 text-green-600' :
              squad.skill_level === 'intermediate' ? 'bg-blue-50 text-blue-600' :
              'bg-red-50 text-red-600'
            }`}>
              {SKILL_LABELS[squad.skill_level]}
            </span>
            <span className={`text-sm font-semibold ${isFree ? 'text-green-600' : 'text-gray-700'}`}>
              {isFree ? '免費' : `${squad.price_per_person}元`}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            主辦：{squad.organizer?.full_name || '未知'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function SquadsPage() {
  const [sport, setSport] = useState<SportType | 'all'>('all')
  const [city, setCity] = useState<string>('all')
  const [skill, setSkill] = useState<string>('all')
  const [search, setSearch] = useState('')

  const allSquads = getAllSquadCards('u1')

  const filtered = allSquads.filter(s => {
    if (sport !== 'all' && s.sport !== sport) return false
    if (city !== 'all' && s.city !== city) return false
    if (skill !== 'all' && s.skill_level !== skill) return false
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.description?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())

  const sports = Object.keys(SPORT_LABELS) as SportType[]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">揪團列表</h1>
          <p className="text-gray-500 text-sm">
            找到適合你的運動夥伴 — {filtered.length} 個揪團
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-3">
            {/* Sport Filter */}
            <select
              value={sport}
              onChange={e => setSport(e.target.value as SportType | 'all')}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">全部球類</option>
              {sports.map(s => (
                <option key={s} value={s}>{SPORT_LABELS[s]}</option>
              ))}
            </select>

            {/* City Filter */}
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">全部縣市</option>
              {TAIWAN_CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Skill Filter */}
            <select
              value={skill}
              onChange={e => setSkill(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">不限程度</option>
              <option value="beginner">🌱 初學者</option>
              <option value="intermediate">⭐ 中級</option>
              <option value="advanced">🔥 高級</option>
              <option value="all">👥 不限</option>
            </select>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋揪團標題..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">找不到符合條件的揪團</p>
            <p className="text-gray-400 text-sm">嘗試調整篩選條件，或許可以自己發起一個？</p>
            <Link
              href="/squads/new"
              className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium mt-4 transition-colors"
            >
              發起揪團
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(squad => (
              <SquadCard key={squad.id} squad={squad} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}