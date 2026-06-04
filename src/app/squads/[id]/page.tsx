import { notFound } from 'next/navigation'
import { MapPin, Clock, Users, Calendar, DollarSign, ArrowLeft, Check, User } from 'lucide-react'
import { SPORT_LABELS, SKILL_LABELS } from '@/lib/types'
import { fetchSquadById, fetchParticipants } from '@/lib/api'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import JoinButton from './JoinButton'

export const dynamic = 'force-dynamic'

export default async function SquadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const squad = await fetchSquadById(id)
  if (!squad) notFound()

  const participants = await fetchParticipants(id)

  const sportLabel = SPORT_LABELS[squad.sport as keyof typeof SPORT_LABELS]
  const [emoji, ...rest] = sportLabel.split(' ')
  const sportText = rest.join(' ')
  const date = new Date(squad.scheduled_at)
  const isFree = squad.price_per_person === 0
  const isFull = squad.participant_count >= squad.max_participants

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <a href="/squads" className="inline-flex items-center gap-1.5 text-gray-600 hover:text-orange-500 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回揪團列表
          </a>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-400 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{emoji}</span>
            <span className="text-xl font-semibold">{sportText}</span>
            <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
              squad.status === 'open' ? 'bg-white/20' : squad.status === 'full' ? 'bg-yellow-400/30' : 'bg-gray-400/30'
            }`}>
              {squad.status === 'open' ? '報名中' : squad.status === 'full' ? '已額滿' : '已取消'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{squad.title}</h1>
          <div className="flex items-center gap-4 text-orange-100 text-sm">
            <span>主辦：{squad.organizer?.full_name || '匿名'}</span>
            <span>·</span>
            <span>發布於 {format(new Date(squad.created_at), 'M/dd HH:mm', { locale: zhTW })}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Info Cards */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">揪團資訊</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4.5 h-4.5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">時間</p>
                    <p className="font-medium text-gray-900">
                      {format(date, 'M月dd日 (EEE)', { locale: zhTW })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(date, 'HH:mm')} - {new Date(new Date(squad.scheduled_at).getTime() + squad.duration_minutes * 60000).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4.5 h-4.5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">地點</p>
                    <p className="font-medium text-gray-900">{squad.city} {squad.district}</p>
                    <p className="text-sm text-gray-600">{squad.location_detail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4.5 h-4.5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">人數</p>
                    <p className="font-medium text-gray-900">
                      {squad.participant_count} / {squad.max_participants} 人
                    </p>
                    <p className="text-xs text-gray-500">
                      {isFull ? '已額滿' : '報名中'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4.5 h-4.5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">費用</p>
                    <p className={`font-medium ${isFree ? 'text-green-600' : 'text-gray-900'}`}>
                      {isFree ? '免費' : `${squad.price_per_person}元/人`}
                    </p>
                    {squad.price_per_person > 0 && (
                      <p className="text-xs text-gray-500">現場支付</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Skill Level */}
              <div className="mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">技術程度</span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    squad.skill_level === 'all' ? 'bg-gray-100 text-gray-600' :
                    squad.skill_level === 'beginner' ? 'bg-green-50 text-green-600' :
                    squad.skill_level === 'intermediate' ? 'bg-blue-50 text-blue-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {SKILL_LABELS[squad.skill_level as keyof typeof SKILL_LABELS]}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {squad.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-3">揪團說明</h2>
                <p className="text-gray-600 leading-relaxed">{squad.description}</p>
              </div>
            )}

            {/* Equipment & Notes */}
            {(squad.equipment || squad.notes) && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                {squad.equipment && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">需要自備</h3>
                    <p className="text-gray-600 text-sm">{squad.equipment}</p>
                  </div>
                )}
                {squad.notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">注意事項</h3>
                    <p className="text-gray-600 text-sm">{squad.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar: Join + Participants */}
          <div className="space-y-4">
            {/* Join Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {squad.participant_count}
                  <span className="text-lg text-gray-400 font-normal">/{squad.max_participants}</span>
                </div>
                <p className="text-sm text-gray-500">已報名人數</p>
              </div>

              <JoinButton
                squadId={squad.id}
                isFull={isFull}
                isOrganizer={squad.is_organizer}
                userparticipationStatus={squad.userparticipation_status}
              />
            </div>

            {/* Participants List */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                報名參加 ({participants.length})
              </h3>
              {participants.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">還沒有人報名</p>
              ) : (
                <div className="space-y-3">
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {p.user?.full_name || '匿名'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}