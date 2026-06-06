'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Sparkles, MapPin, Clock, Users, ArrowRight, ThumbsUp, Filter } from 'lucide-react'
import { SPORT_LABELS, SPORT_ICONS, TAIWAN_CITIES, type SportType, type SquadCard } from '@/lib/types'
import { getAllSquadCards } from '@/lib/mock-data'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

// AI scoring
function scoreSquad(squad: SquadCard, userCity: string, userSports: SportType[]): { score: number; reasons: string[] } {
  let score = 50
  const reasons: string[] = []
  if (squad.city === userCity) { score += 30; reasons.push('同縣市') }
  if (userSports.includes(squad.sport as SportType)) { score += 20; reasons.push('喜歡的球類') }
  const slots = squad.max_participants - squad.participant_count
  if (slots >= 5) { score += 10; reasons.push('名額充足') }
  const hoursUntil = (new Date(squad.scheduled_at).getTime() - Date.now()) / 3600000
  if (hoursUntil <= 24 && hoursUntil > 0) { score += 5; reasons.push('即將開始') }
  if (squad.price_per_person === 0) { score += 5; reasons.push('免費') }
  return { score: Math.min(100, score), reasons }
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

  const allSquads = useMemo(() => getAllSquadCards('u1'), [])
  const recommendations = useMemo(() => {
    return allSquads
      .map(squad => {
        const { score, reasons } = scoreSquad(squad, userCity, Array.from(selectedSports))
        return { squad, score, reason: reasons.join(' · ') || '符合你的偏好' }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }, [allSquads, userCity, selectedSports])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-sky-600/10 to-teal-500/10" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(56,189,248,0.3) 0%, transparent 50%)'
        }} />
        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-cyan-500/15 border border-cyan-500/30 rounded-full p-1.5">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
            <span className="text-sm font-medium text-cyan-300">AI 智能推薦</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">為你精選的揪團</h1>
          <p className="text-white/50 text-sm">根據你的所在地與運動喜好，AI 推薦最適合的揪團</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar: Preference */}
          <aside>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sticky top-24">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-cyan-400" />
                調整偏好
              </h2>

              <div className="mb-5">
                <label className="block text-xs uppercase tracking-wider text-white/50 font-medium mb-2">📍 你的所在</label>
                <div className="flex flex-wrap gap-1.5">
                  {['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市'].map(c => (
                    <button
                      key={c}
                      onClick={() => setUserCity(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        userCity === c
                          ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 font-medium mb-2">
                  🏀 喜歡的球類 <span className="text-white/30">(最多 5 項,已選 {selectedSports.size})</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {SPORTS.map(sport => {
                    const emoji = SPORT_ICONS[sport]
                    const text = SPORT_LABELS[sport].replace(/^[^\s]+\s/, '')
                    const active = selectedSports.has(sport)
                    return (
                      <button
                        key={sport}
                        onClick={() => toggleSport(sport)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                          active
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/50 font-medium'
                            : 'bg-white/[0.02] text-white/60 border border-white/10 hover:border-white/30'
                        }`}
                      >
                        <span>{emoji}</span>
                        <span className="flex-1 text-left">{text}</span>
                        {active && <Sparkles className="w-3 h-3" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main: Recommendations */}
          <main>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                推薦結果
                <span className="text-sm font-normal text-cyan-300">({recommendations.length})</span>
              </h2>
            </div>

            {recommendations.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
                <Sparkles className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 font-medium mb-2">調整偏好試試看</p>
                <p className="text-white/40 text-sm">選擇你喜歡的球類與所在縣市</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map(rec => {
                  const emoji = SPORT_ICONS[rec.squad.sport as SportType] || '🏅'
                  const sportText = SPORT_LABELS[rec.squad.sport as SportType].replace(/^[^\s]+\s/, '')
                  const date = new Date(rec.squad.scheduled_at)
                  const isFree = rec.squad.price_per_person === 0
                  const isFull = rec.squad.participant_count >= rec.squad.max_participants
                  const slotsRatio = rec.squad.participant_count / rec.squad.max_participants

                  return (
                    <Link
                      key={rec.squad.id}
                      href={`/squads/${rec.squad.id}`}
                      className="group block bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 rounded-2xl overflow-hidden transition-all"
                    >
                      <div className="flex">
                        {/* Score Badge */}
                        <div className="flex flex-col items-center justify-center px-4 py-5 bg-gradient-to-b from-cyan-500/15 to-sky-500/10 border-r border-cyan-500/20 min-w-[78px]">
                          <div className="text-2xl font-bold text-cyan-300">{rec.score}</div>
                          <div className="text-[10px] text-cyan-400/80 uppercase tracking-wider">match</div>
                          <ThumbsUp className="w-3.5 h-3.5 text-cyan-400/60 mt-1" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-lg">{emoji}</span>
                              <span className="text-sm font-semibold text-white/70">{sportText}</span>
                              {isFull ? (
                                <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-medium">已額滿</span>
                              ) : (
                                <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full font-medium">可報名</span>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                          </div>

                          <h3 className="font-semibold text-white text-base mb-2 line-clamp-1">{rec.squad.title}</h3>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-white/60 mb-2.5">
                            <span className="flex items-center gap-1 text-cyan-300 font-medium">
                              🕐 {format(date, 'M/dd (EEE) HH:mm', { locale: zhTW })}
                            </span>
                            <span className="flex items-center gap-1">📍 {rec.squad.city} {rec.squad.district}</span>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/5">
                            <div className="flex items-center gap-2">
                              {isFree ? (
                                <span className="text-sm font-bold text-emerald-400">免費</span>
                              ) : (
                                <span className="text-sm font-bold text-cyan-300">${rec.squad.price_per_person}</span>
                              )}
                              <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                                ✨ {rec.reason}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-white/60">
                              <Users className="w-3.5 h-3.5" />
                              <div className="flex items-center gap-1">
                                <div className="w-10 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <div className={`h-full ${slotsRatio >= 1 ? 'bg-rose-400' : slotsRatio >= 0.7 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${Math.min(100, slotsRatio * 100)}%` }} />
                                </div>
                                <span className="font-medium text-white/80">{rec.squad.participant_count}/{rec.squad.max_participants}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
