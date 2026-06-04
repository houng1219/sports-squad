'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, MapPin, Clock, Users, ArrowRight, ThumbsUp } from 'lucide-react'
import { SPORT_LABELS, SKILL_LABELS, type SportType, type Recommendation } from '@/lib/types'
import { getAllSquadCards } from '@/lib/mock-data'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

// Simple recommendation logic
function computeRecommendations(userCity: string, userSports: SportType[], currentUserId: string): Recommendation[] {
  const allSquads = getAllSquadCards(currentUserId)

  return allSquads
    .map(squad => {
      let score = 50
      let reasons: string[] = []

      // City match: +30
      if (squad.city === userCity) {
        score += 30
        reasons.push('同縣市')
      }

      // Sport preference match: +20
      if (userSports.includes(squad.sport)) {
        score += 20
        reasons.push(`喜歡的${SPORT_LABELS[squad.sport].split(' ')[1]}`)
      }

      // Available slots: +10
      const slots = squad.max_participants - squad.participant_count
      if (slots >= 5) {
        score += 10
        reasons.push('名額充足')
      }

      // Soon: +5
      const hoursUntil = (new Date(squad.scheduled_at).getTime() - Date.now()) / 3600000
      if (hoursUntil <= 24 && hoursUntil > 0) {
        score += 5
        reasons.push('即將開始')
      }

      // Free: +5
      if (squad.price_per_person === 0) {
        score += 5
        reasons.push('免費')
      }

      return {
        squad,
        score: Math.min(100, score),
        reason: reasons.join(' · ') || '符合你的偏好',
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
}

const SPORTS = Object.keys(SPORT_LABELS) as SportType[]

export default function RecommendPage() {
  const [selectedSports, setSelectedSports] = useState<Set<SportType>>(new Set(['basketball', 'badminton']))
  const [userCity, setUserCity] = useState('台北市')

  function toggleSport(sport: SportType) {
    setSelectedSports(prev => {
      const next = new Set(prev)
      if (next.has(sport)) next.delete(sport)
      else if (next.size < 5) next.add(sport)
      return next
    })
  }

  const recommendations = computeRecommendations(userCity, Array.from(selectedSports), 'u1')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium text-purple-200">智能推薦</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">為你精選的揪團</h1>
          <p className="text-purple-200 text-sm">根據你的所在地與運動喜好，AI 推薦最適合的揪團</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Preference Tuning */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">調整偏好</h2>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">你的所在</label>
                <select
                  value={userCity}
                  onChange={e => setUserCity(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  喜歡的球類 <span className="text-xs text-gray-400">(最多5項)</span>
                </label>
                <div className="space-y-2">
                  {SPORTS.map(sport => {
                    const label = SPORT_LABELS[sport]
                    const emoji = label.split(' ')[0]
                    const text = label.split(' ')[1]
                    const active = selectedSports.has(sport)
                    return (
                      <button
                        key={sport}
                        onClick={() => toggleSport(sport)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          active
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <span>{emoji}</span>
                        <span className="font-medium">{text}</span>
                        {active && <Sparkles className="w-3.5 h-3.5 ml-auto text-purple-400" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main: Recommendations */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">推薦結果 ({recommendations.length})</h2>
            </div>

            {recommendations.length === 0 ? (
              <div className="text-center py-16">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium mb-2">調整偏好試試看</p>
                <p className="text-gray-400 text-sm">選擇你喜歡的球類與所在縣市，我們就幫你找揪團</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map(rec => {
                  const sportLabel = SPORT_LABELS[rec.squad.sport]
                  const sportEmoji = sportLabel.split(' ')[0]
                  const sportText = sportLabel.split(' ')[1]
                  const date = new Date(rec.squad.scheduled_at)
                  const isFree = rec.squad.price_per_person === 0
                  const isFull = rec.squad.participant_count >= rec.squad.max_participants

                  return (
                    <Link
                      key={rec.squad.id}
                      href={`/squads/${rec.squad.id}`}
                      className="group block bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all overflow-hidden"
                    >
                      <div className="flex">
                        {/* Score Badge */}
                        <div className="flex flex-col items-center justify-center px-5 py-6 bg-gradient-to-b from-purple-50 to-indigo-50 border-r border-purple-100 min-w-[80px]">
                          <div className="text-2xl font-bold text-purple-600">{rec.score}</div>
                          <div className="text-xs text-purple-400">match</div>
                          <ThumbsUp className="w-4 h-4 text-purple-400 mt-1" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{sportEmoji}</span>
                              <span className="text-sm font-semibold text-gray-600">{sportText}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                isFull ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
                              }`}>
                                {isFull ? '已額滿' : '可報名'}
                              </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors" />
                          </div>

                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                            {rec.squad.title}
                          </h3>

                          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {format(date, 'M/dd (EEE) HH:mm', { locale: zhTW })}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {rec.squad.city} {rec.squad.district}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {rec.squad.participant_count}/{rec.squad.max_participants}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-semibold ${isFree ? 'text-green-600' : 'text-gray-700'}`}>
                              {isFree ? '免費' : `${rec.squad.price_per_person}元`}
                            </span>
                            <span className="text-xs text-purple-500 bg-purple-50 px-2 py-1 rounded-full">
                              {rec.reason}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}