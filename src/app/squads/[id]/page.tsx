import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Clock, Users, Calendar, DollarSign, ArrowLeft, Check, User } from 'lucide-react'
import { SPORT_LABELS, SKILL_LABELS } from '@/lib/types'
import { getSquadById, mockParticipations, mockProfiles } from '@/lib/mock-data'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

export default function SquadDetailPage({ params }: { params: { id: string } }) {
  const squad = getSquadById(params.id, 'u1')
  if (!squad) notFound()

  const sportLabel = SPORT_LABELS[squad.sport]
  const sportEmoji = sportLabel.split(' ')[0]
  const sportText = sportLabel.split(' ')[1]
  const date = new Date(squad.scheduled_at)
  const isFree = squad.price_per_person === 0
  const isFull = squad.participant_count >= squad.max_participants
  const isUserJoined = squad.userparticipation_status === 'confirmed'
  const isOrganizer = squad.is_organizer

  const participations = mockParticipations.filter(p => p.squad_id === squad.id && p.status === 'confirmed')

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link href="/squads" className="inline-flex items-center gap-1.5 text-gray-600 hover:text-orange-500 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回揪團列表
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-400 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{sportEmoji}</span>
            <span className="text-xl font-semibold">{sportText}</span>
            <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
              squad.status === 'open' ? 'bg-white/20' : squad.status === 'full' ? 'bg-yellow-400/30' : 'bg-gray-400/30'
            }`}>
              {squad.status === 'open' ? '報名中' : squad.status === 'full' ? '已額滿' : '已取消'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{squad.title}</h1>
          <div className="flex items-center gap-4 text-orange-100 text-sm">
            <span>主辦：{squad.organizer?.full_name}</span>
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
                      {format(date, 'HH:mm')} - {format(new Date(squad.scheduled_at + ` +${squad.duration_minutes * 60000}`), 'HH:mm')}
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
                    {SKILL_LABELS[squad.skill_level]}
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

            {/* Participants */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                報名參加 ({participations.length})
              </h2>
              {participations.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">還沒有人報名，成為第一個吧！</p>
              ) : (
                <div className="space-y-3">
                  {participations.map(p => {
                    const user = mockProfiles.find(u => u.id === p.user_id)
                    const isCurrentUser = p.user_id === 'u1'
                    return (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="w-4.5 h-4.5 text-orange-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {user?.full_name || '匿名'}
                            {isCurrentUser && <span className="text-orange-500 ml-1">(你)</span>}
                          </p>
                        </div>
                        {isOrganizer && p.user_id !== 'u1' && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">已確認</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Join Action */}
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

              {isOrganizer ? (
                <div className="space-y-2">
                  <div className="bg-orange-50 text-orange-600 text-center py-3 rounded-xl text-sm font-medium">
                    這是你發起的揪團
                  </div>
                  <Link
                    href={`/squads/${squad.id}/edit`}
                    className="block w-full text-center border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    編輯揪團
                  </Link>
                </div>
              ) : isUserJoined ? (
                <div className="space-y-2">
                  <div className="bg-green-50 text-green-600 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium">
                    <Check className="w-4 h-4" />
                    已報名參加
                  </div>
                  <button className="w-full text-center border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition-colors">
                    取消報名
                  </button>
                </div>
              ) : isFull ? (
                <div className="bg-gray-100 text-gray-500 text-center py-3 rounded-xl text-sm font-medium">
                  已額滿
                </div>
              ) : (
                <div className="space-y-2">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
                    報名參加
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    {isFree ? '免費活動，無需預付' : `報名費 ${squad.price_per_person}元`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}