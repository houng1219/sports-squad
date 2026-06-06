import { notFound } from 'next/navigation'
import { MapPin, Clock, Users, Calendar, DollarSign, ArrowLeft, User, Sparkles } from 'lucide-react'
import { SPORT_LABELS, SPORT_ICONS, type SportType, type SquadCard } from '@/lib/types'
import { getSquadById, mockParticipations, mockProfiles } from '@/lib/mock-data'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import JoinButton from './JoinButton'

export const dynamic = 'force-dynamic'

export default async function SquadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const squad = getSquadById(id, 'u1')
  if (!squad) notFound()

  // Get participants from mock
  const participants = mockParticipations
    .filter(p => p.squad_id === id && p.status === 'confirmed')
    .map(p => ({ ...p, user: mockProfiles.find(u => u.id === p.user_id) }))

  const sportEmoji = SPORT_ICONS[squad.sport as SportType] || '🏅'
  const sportText = SPORT_LABELS[squad.sport as SportType].replace(/^[^\s]+\s/, '')
  const date = new Date(squad.scheduled_at)
  const isFree = squad.price_per_person === 0
  const isFull = squad.participant_count >= squad.max_participants
  const slotsRatio = squad.participant_count / squad.max_participants
  const endTime = new Date(date.getTime() + squad.duration_minutes * 60000)

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="border-b border-white/10 sticky top-16 z-30 bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <a href="/squads" className="inline-flex items-center gap-1.5 text-white/50 hover:text-cyan-300 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回揪團列表
          </a>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-sky-600/10 to-teal-500/10" />
        <div className="relative max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{sportEmoji}</span>
            <span className="text-lg font-semibold text-white/80">{sportText}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
              squad.status === 'open'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : squad.status === 'full'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-white/5 text-white/50 border-white/10'
            }`}>
              {squad.status === 'open' ? '報名中' : squad.status === 'full' ? '已額滿' : '已取消'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">{squad.title}</h1>
          <div className="flex items-center gap-3 text-sm text-white/50">
            <span>主辦：<span className="text-white/80">{squad.organizer?.full_name || '匿名'}</span></span>
            <span>·</span>
            <span>發布於 {format(new Date(squad.created_at), 'M/dd HH:mm', { locale: zhTW })}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
          {/* Main */}
          <div className="space-y-4">
            {/* 4 個資訊卡 */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCard icon="📅" label="日期">
                {format(date, 'M月dd日 (EEE)', { locale: zhTW })}
              </InfoCard>
              <InfoCard icon="⏰" label="時間">
                {format(date, 'HH:mm')} - {format(endTime, 'HH:mm')}
              </InfoCard>
              <InfoCard icon="📍" label="地點">
                {squad.city} {squad.district}
                <p className="text-xs text-white/50 font-normal mt-0.5">{squad.location_detail}</p>
              </InfoCard>
              <InfoCard icon="💪" label="程度">
                {squad.skill_level === 'beginner' ? '🌱 初學' :
                 squad.skill_level === 'intermediate' ? '⭐ 中級' :
                 squad.skill_level === 'advanced' ? '🔥 高級' : '👥 不限'}
              </InfoCard>
            </div>

            {/* 揪團說明 */}
            {squad.description && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="font-semibold text-white mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  揪團說明
                </h2>
                <p className="text-white/70 leading-relaxed text-sm whitespace-pre-line">{squad.description}</p>
              </div>
            )}

            {/* 器材 + 注意事項 */}
            {(squad.equipment || squad.notes) && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                {squad.equipment && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">🏸 需要自備</h3>
                    <p className="text-white/70 text-sm">{squad.equipment}</p>
                  </div>
                )}
                {squad.notes && (
                  <div className="pt-3 border-t border-amber-500/20">
                    <h3 className="text-sm font-semibold text-amber-300 mb-1">⚠️ 注意事項</h3>
                    <p className="text-white/80 text-sm">{squad.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Join Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sticky top-32">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-white mb-1">
                  {squad.participant_count}
                  <span className="text-lg text-white/40 font-normal">/{squad.max_participants}</span>
                </div>
                <p className="text-xs text-white/50 mb-3">已報名人數</p>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      slotsRatio >= 1 ? 'bg-rose-400' : slotsRatio >= 0.7 ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, slotsRatio * 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-center py-3 border-y border-white/10 mb-4">
                <p className="text-xs text-white/50 mb-1">費用</p>
                <p className={`text-xl font-bold ${isFree ? 'text-emerald-400' : 'text-cyan-300'}`}>
                  {isFree ? '免費' : `$${squad.price_per_person} / 人`}
                </p>
              </div>

              <JoinButton
                squadId={squad.id}
                isFull={isFull}
                isOrganizer={squad.is_organizer}
                userparticipationStatus={squad.userparticipation_status}
              />
            </div>

            {/* Participants List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center justify-between">
                <span>報名參加</span>
                <span className="text-cyan-300 text-sm">({participants.length})</span>
              </h3>
              {participants.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">還沒有人報名</p>
              ) : (
                <div className="space-y-2">
                  {participants.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-sky-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-cyan-300">
                          {p.user?.full_name?.[0] || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">
                          {p.user?.full_name || '匿名'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
      <p className="text-[10px] text-white/40 mb-1.5 flex items-center gap-1 uppercase tracking-wider">
        <span>{icon}</span>
        {label}
      </p>
      <p className="text-sm font-semibold text-white">{children}</p>
    </div>
  )
}
