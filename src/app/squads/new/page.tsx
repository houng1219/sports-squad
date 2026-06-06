'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, MapPin, Calendar, Users, DollarSign, FileText } from 'lucide-react'
import { SPORT_LABELS, SPORT_ICONS, TAIWAN_CITIES, SKILL_LABELS, CITY_DISTRICTS, type SportType, type CreateSquadInput } from '@/lib/types'
import { createSquad } from '@/lib/api'

const SPORTS = Object.entries(SPORT_LABELS) as [SportType, string][]

const STEPS = [
  { label: '球類程度', icon: '🏀' },
  { label: '時間地點', icon: '📍' },
  { label: '人數費用', icon: '👥' },
  { label: '確認發布', icon: '✅' },
]

export default function NewSquadPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CreateSquadInput>({
    title: '',
    description: '',
    sport: 'basketball',
    city: '台北市',
    district: '',
    location_detail: '',
    scheduled_at: '',
    duration_minutes: 120,
    max_participants: 10,
    skill_level: 'all',
    price_per_person: 0,
    equipment: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateField<K extends keyof CreateSquadInput>(key: K, value: CreateSquadInput[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e })
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = '請填寫揪團標題'
    if (!form.location_detail.trim()) e.location_detail = '請填寫地點'
    if (!form.scheduled_at) e.scheduled_at = '請選擇時間'
    if (form.max_participants < 2) e.max_participants = '人數至少 2 人'
    if (form.price_per_person < 0) e.price_per_person = '費用不能為負數'
    return e
  }

  async function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    setLoading(true)
    try {
      await createSquad(form, 'demo-user-id')
      router.push('/squads')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '發布失敗，請稍後再試'
      setErrors({ submit: message })
      setLoading(false)
    }
  }

  const districts = CITY_DISTRICTS[form.city] || []
  const sportEmoji = SPORT_ICONS[form.sport as SportType] || '🏅'

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/10 sticky top-16 z-30 bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/squads" className="text-white/50 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">發起揪團</h1>
              <p className="text-xs text-white/50">設定揪團內容，邀請運動夥伴</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
              <div
                onClick={() => i < step && setStep(i)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${
                  i < step
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white'
                    : i === step
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-white/5 border border-white/10 text-white/30'
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : s.icon}
              </div>
              <span className={`text-xs hidden sm:block whitespace-nowrap ${
                i === step ? 'text-cyan-300 font-medium' : i < step ? 'text-white/60' : 'text-white/30'
              }`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded ${i < step ? 'bg-cyan-500' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          {/* Step 0: Sport & Title */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-white mb-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  揪團標題 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => updateField('title', e.target.value)}
                  placeholder="例如：週六下午籃球三打三"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                    errors.title ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-white mb-2">
                  揪團說明 <span className="text-white/30 text-xs font-normal">(選填)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={e => updateField('description', e.target.value)}
                  placeholder="補充更多細節..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  選擇球類 <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {SPORTS.map(([value, label]) => {
                    const emoji = SPORT_ICONS[value as SportType]
                    const text = label.replace(/^[^\s]+\s/, '')
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateField('sport', value)}
                        className={`flex flex-col items-center gap-1.5 p-3.5 rounded-xl border-2 transition-all ${
                          form.sport === value
                            ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                            : 'border-white/10 hover:border-white/30 bg-white/[0.02]'
                        }`}
                      >
                        <span className="text-2xl">{emoji}</span>
                        <span className={`text-xs font-medium ${form.sport === value ? 'text-cyan-300' : 'text-white/60'}`}>{text}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">技術程度</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['beginner', 'intermediate', 'advanced', 'all'] as const).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => updateField('skill_level', level)}
                      className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        form.skill_level === level
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30'
                      }`}
                    >
                      {SKILL_LABELS[level]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Time & Location */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-white mb-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  日期時間 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={e => updateField('scheduled_at', e.target.value)}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all [color-scheme:dark] ${
                    errors.scheduled_at ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.scheduled_at && <p className="text-rose-400 text-xs mt-1">{errors.scheduled_at}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">持續時間</label>
                <div className="grid grid-cols-4 gap-2">
                  {[60, 90, 120, 180].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => updateField('duration_minutes', mins)}
                      className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        form.duration_minutes === mins
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30'
                      }`}
                    >
                      {mins < 60 ? `${mins} 分鐘` : mins === 60 ? '1 小時' : `${mins / 60} 小時`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-white mb-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  縣市 <span className="text-rose-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {TAIWAN_CITIES.slice(0, 8).map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => updateField('city', city)}
                      className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                        form.city === city
                          ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
                {TAIWAN_CITIES.length > 8 && (
                  <details className="mt-2">
                    <summary className="text-xs text-cyan-400 cursor-pointer hover:text-cyan-300">顯示更多 ({TAIWAN_CITIES.length - 8})</summary>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {TAIWAN_CITIES.slice(8).map(city => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => updateField('city', city)}
                          className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                            form.city === city
                              ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300'
                              : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </details>
                )}
              </div>

              {districts.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">區域 <span className="text-white/30 text-xs font-normal">(選填)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {districts.map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => updateField('district', d)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          form.district === d
                            ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300'
                            : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  詳細地點 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.location_detail}
                  onChange={e => updateField('location_detail', e.target.value)}
                  placeholder="例如：南港運動中心 3F 籃球場"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                    errors.location_detail ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.location_detail && <p className="text-rose-400 text-xs mt-1">{errors.location_detail}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Participants & Price */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-white mb-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  最多人數 <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {[4, 6, 8, 10, 12, 16].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => updateField('max_participants', n)}
                      className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                        form.max_participants === n
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30'
                      }`}
                    >
                      {n} 人
                    </button>
                  ))}
                </div>
                {errors.max_participants && <p className="text-rose-400 text-xs mt-1">{errors.max_participants}</p>}
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-white mb-2">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  每人費用
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 50, 100, 200, 500].map(price => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => updateField('price_per_person', price)}
                      className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                        form.price_per_person === price
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30'
                      }`}
                    >
                      {price === 0 ? '免費' : `$${price}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  自備器材 <span className="text-white/30 text-xs font-normal">(選填)</span>
                </label>
                <input
                  type="text"
                  value={form.equipment}
                  onChange={e => updateField('equipment', e.target.value)}
                  placeholder="例如：球拍自備"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  注意事項 <span className="text-white/30 text-xs font-normal">(選填)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => updateField('notes', e.target.value)}
                  placeholder="例如：遲到超過 15 分鐘取消資格"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center pb-4 border-b border-white/10">
                <span className="text-5xl">{sportEmoji}</span>
                <h3 className="text-xl font-bold text-white mt-3">{form.title || '未命名揪團'}</h3>
                <p className="text-sm text-white/50 mt-1">
                  {SPORT_LABELS[form.sport as SportType].replace(/^[^\s]+\s/, '')} · {SKILL_LABELS[form.skill_level as keyof typeof SKILL_LABELS]}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                  <Calendar className="w-4 h-4 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="text-white/50 text-xs">時間</p>
                    <p className="text-white">{form.scheduled_at ? new Date(form.scheduled_at).toLocaleString('zh-TW') : '未設定'} · {form.duration_minutes} 分鐘</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                  <MapPin className="w-4 h-4 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="text-white/50 text-xs">地點</p>
                    <p className="text-white">{form.city} {form.district} · {form.location_detail || '未填寫'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                  <Users className="w-4 h-4 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="text-white/50 text-xs">人數 / 費用</p>
                    <p className="text-white">
                      最多 {form.max_participants} 人 · {form.price_per_person === 0 ? <span className="text-emerald-400 font-bold">免費</span> : `$${form.price_per_person} / 人`}
                    </p>
                  </div>
                </div>

                {form.notes && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <p className="text-amber-300 text-xs mb-1">⚠️ 注意事項</p>
                    <p className="text-white/80 text-sm">{form.notes}</p>
                  </div>
                )}
              </div>

              {errors.submit && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                  <p className="text-rose-300 text-sm">❌ {errors.submit}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => step > 0 ? setStep(step - 1) : router.push('/squads')}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all"
          >
            {step === 0 ? '取消' : '上一步'}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                const e: Record<string, string> = step === 0
                  ? (form.title.trim() ? {} : { title: '請填寫揪團標題' })
                  : step === 1
                    ? {
                        ...(form.scheduled_at ? {} : { scheduled_at: '請選擇時間' }),
                        ...(form.location_detail.trim() ? {} : { location_detail: '請填寫地點' }),
                      }
                    : {}
                if (Object.keys(e).length > 0) { setErrors(e); return }
                setStep(step + 1)
              }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20"
            >
              下一步
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 disabled:opacity-50 text-white px-7 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20"
            >
              {loading ? '發布中...' : '確認發布'}
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
