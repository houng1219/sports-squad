'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, MapPin, Calendar, Users, DollarSign, FileText, Clock } from 'lucide-react'
import { SPORT_LABELS, SPORT_ICONS, TAIWAN_CITIES, SKILL_LABELS, CITY_DISTRICTS, type SportType, type CreateSquadInput } from '@/lib/types'
import { createSquad } from '@/lib/api'

// 5 種球類(順序固定,使用者最常選的優先)
const SPORTS: { value: SportType; emoji: string; label: string }[] = [
  { value: 'basketball', emoji: '🏀', label: '籃球' },
  { value: 'badminton', emoji: '🏸', label: '羽球' },
  { value: 'running', emoji: '🏃', label: '跑步' },
  { value: 'volleyball', emoji: '🏐', label: '排球' },
  { value: 'football', emoji: '⚽', label: '足球' },
]

const STEPS = [
  { label: '基本資料', icon: '📝' },
  { label: '地點', icon: '📍' },
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
  const sportLabel = SPORT_LABELS[form.sport as SportType]?.replace(/^[^\s]+\s/, '') || '運動'

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#d2d2d7]/60 sticky top-[52px] z-30 bg-white/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/squads" className="text-[#6e6e73] hover:text-[#1d1d1f]">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-[19px] font-semibold text-[#1d1d1f] tracking-tight">發起揪團</h1>
              <p className="text-[12px] text-[#6e6e73]">設定揪團內容，邀請運動夥伴</p>
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
                className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-semibold transition-all cursor-pointer ${
                  i < step
                    ? 'bg-[#0071e3] text-white'
                    : i === step
                    ? 'bg-[#0071e3] text-white shadow-md shadow-[#0071e3]/30'
                    : 'bg-[#f5f5f7] text-[#86868b] border border-[#e8e8ed]'
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : s.icon}
              </div>
              <span className={`text-[12px] hidden sm:block whitespace-nowrap ${
                i === step ? 'text-[#0071e3] font-semibold' : i < step ? 'text-[#1d1d1f]' : 'text-[#86868b]'
              }`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded-full ${i < step ? 'bg-[#0071e3]' : 'bg-[#e8e8ed]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#e8e8ed] rounded-2xl p-6 md:p-8">
          {/* ============== Step 0: 基本資料(標題 + 球類 + 程度 + 日期時間) ============== */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#1d1d1f] mb-2">
                  <FileText className="w-4 h-4 text-[#0071e3]" />
                  揪團標題 <span className="text-[#ff3b30]">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => updateField('title', e.target.value)}
                  placeholder="例如：週六下午籃球三打三"
                  className={`w-full bg-[#f5f5f7] border rounded-xl px-4 py-3 text-[14px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all ${
                    errors.title ? 'border-[#ff3b30]/50' : 'border-transparent hover:border-[#d2d2d7]'
                  }`}
                />
                {errors.title && <p className="text-[#ff3b30] text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#1d1d1f] mb-2">
                  揪團說明 <span className="text-[#86868b] text-xs font-normal">(選填)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={e => updateField('description', e.target.value)}
                  placeholder="補充更多細節..."
                  rows={3}
                  className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-4 py-3 text-[14px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent resize-none transition-all"
                />
              </div>

              {/* 球類 — 5 種固定 */}
              <div>
                <label className="block text-[14px] font-semibold text-[#1d1d1f] mb-3">
                  選擇球類 <span className="text-[#ff3b30]">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {SPORTS.map(sport => (
                    <button
                      key={sport.value}
                      type="button"
                      onClick={() => updateField('sport', sport.value)}
                      className={`flex flex-col items-center gap-1.5 p-3.5 rounded-xl border-2 transition-all ${
                        form.sport === sport.value
                          ? 'border-[#0071e3] bg-[#0071e3]/10 shadow-sm shadow-[#0071e3]/20'
                          : 'border-[#e8e8ed] bg-[#fbfbfd] hover:border-[#d2d2d7]'
                      }`}
                    >
                      <span className="text-[28px] leading-none">{sport.emoji}</span>
                      <span className={`text-[13px] font-medium ${form.sport === sport.value ? 'text-[#0071e3]' : 'text-[#1d1d1f]'}`}>
                        {sport.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#1d1d1f] mb-3">技術程度</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['beginner', 'intermediate', 'advanced', 'all'] as const).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => updateField('skill_level', level)}
                      className={`py-2.5 rounded-xl text-[14px] font-medium border-2 transition-all ${
                        form.skill_level === level
                          ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]'
                          : 'border-[#e8e8ed] bg-white text-[#6e6e73] hover:border-[#d2d2d7]'
                      }`}
                    >
                      {SKILL_LABELS[level]}
                    </button>
                  ))}
                </div>
              </div>

              {/* 日期時間 + 持續時間(新加在 Step 0) */}
              <div className="pt-4 border-t border-[#e8e8ed] space-y-5">
                <div>
                  <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#1d1d1f] mb-2">
                    <Calendar className="w-4 h-4 text-[#0071e3]" />
                    日期時間 <span className="text-[#ff3b30]">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={e => updateField('scheduled_at', e.target.value)}
                    className={`w-full bg-[#f5f5f7] border rounded-xl px-4 py-3 text-[14px] text-[#1d1d1f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all ${
                      errors.scheduled_at ? 'border-[#ff3b30]/50' : 'border-transparent hover:border-[#d2d2d7]'
                    }`}
                  />
                  {errors.scheduled_at && <p className="text-[#ff3b30] text-xs mt-1">{errors.scheduled_at}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#1d1d1f] mb-3">
                    <Clock className="w-4 h-4 text-[#0071e3]" />
                    持續時間
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[60, 90, 120, 180].map(mins => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => updateField('duration_minutes', mins)}
                        className={`py-2.5 rounded-xl text-[14px] font-medium border-2 transition-all ${
                          form.duration_minutes === mins
                            ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]'
                            : 'border-[#e8e8ed] bg-white text-[#6e6e73] hover:border-[#d2d2d7]'
                        }`}
                      >
                        {mins < 60 ? `${mins} 分鐘` : mins === 60 ? '1 小時' : `${mins / 60} 小時`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============== Step 1: 地點(縣市 + 區 + 詳細地址) ============== */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#1d1d1f] mb-2">
                  <MapPin className="w-4 h-4 text-[#0071e3]" />
                  縣市 <span className="text-[#ff3b30]">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {TAIWAN_CITIES.slice(0, 8).map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => updateField('city', city)}
                      className={`px-3.5 py-2 rounded-full text-[14px] font-medium border transition-all ${
                        form.city === city
                          ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]'
                          : 'border-[#e8e8ed] bg-white text-[#1d1d1f] hover:border-[#d2d2d7]'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
                {TAIWAN_CITIES.length > 8 && (
                  <details className="mt-2">
                    <summary className="text-[13px] text-[#0071e3] cursor-pointer hover:underline">顯示更多 ({TAIWAN_CITIES.length - 8})</summary>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {TAIWAN_CITIES.slice(8).map(city => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => updateField('city', city)}
                          className={`px-3.5 py-2 rounded-full text-[14px] font-medium border transition-all ${
                            form.city === city
                              ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]'
                              : 'border-[#e8e8ed] bg-white text-[#1d1d1f] hover:border-[#d2d2d7]'
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
                  <label className="block text-[14px] font-semibold text-[#1d1d1f] mb-2">
                    區域 <span className="text-[#86868b] text-xs font-normal">(選填)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {districts.map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => updateField('district', d)}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                          form.district === d
                            ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]'
                            : 'border-[#e8e8ed] bg-white text-[#6e6e73] hover:border-[#d2d2d7]'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[14px] font-semibold text-[#1d1d1f] mb-2">
                  詳細地點 <span className="text-[#ff3b30]">*</span>
                </label>
                <input
                  type="text"
                  value={form.location_detail}
                  onChange={e => updateField('location_detail', e.target.value)}
                  placeholder="例如：南港運動中心 3F 籃球場"
                  className={`w-full bg-[#f5f5f7] border rounded-xl px-4 py-3 text-[14px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all ${
                    errors.location_detail ? 'border-[#ff3b30]/50' : 'border-transparent hover:border-[#d2d2d7]'
                  }`}
                />
                {errors.location_detail && <p className="text-[#ff3b30] text-xs mt-1">{errors.location_detail}</p>}
              </div>
            </div>
          )}

          {/* ============== Step 2: 人數費用 ============== */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#1d1d1f] mb-2">
                  <Users className="w-4 h-4 text-[#0071e3]" />
                  最多人數 <span className="text-[#ff3b30]">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {[4, 6, 8, 10, 12, 16].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => updateField('max_participants', n)}
                      className={`py-3 rounded-xl text-[14px] font-bold border-2 transition-all ${
                        form.max_participants === n
                          ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]'
                          : 'border-[#e8e8ed] bg-white text-[#6e6e73] hover:border-[#d2d2d7]'
                      }`}
                    >
                      {n} 人
                    </button>
                  ))}
                </div>
                {errors.max_participants && <p className="text-[#ff3b30] text-xs mt-1">{errors.max_participants}</p>}
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#1d1d1f] mb-2">
                  <DollarSign className="w-4 h-4 text-[#0071e3]" />
                  每人費用
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 50, 100, 200, 500].map(price => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => updateField('price_per_person', price)}
                      className={`py-3 rounded-xl text-[14px] font-bold border-2 transition-all ${
                        form.price_per_person === price
                          ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]'
                          : 'border-[#e8e8ed] bg-white text-[#6e6e73] hover:border-[#d2d2d7]'
                      }`}
                    >
                      {price === 0 ? '免費' : `$${price}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#1d1d1f] mb-2">
                  自備器材 <span className="text-[#86868b] text-xs font-normal">(選填)</span>
                </label>
                <input
                  type="text"
                  value={form.equipment}
                  onChange={e => updateField('equipment', e.target.value)}
                  placeholder="例如：球拍自備"
                  className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-4 py-3 text-[14px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#1d1d1f] mb-2">
                  注意事項 <span className="text-[#86868b] text-xs font-normal">(選填)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => updateField('notes', e.target.value)}
                  placeholder="例如：遲到超過 15 分鐘取消資格"
                  rows={3}
                  className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-4 py-3 text-[14px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent resize-none transition-all"
                />
              </div>
            </div>
          )}

          {/* ============== Step 3: 確認 ============== */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center pb-4 border-b border-[#e8e8ed]">
                <span className="text-5xl">{sportEmoji}</span>
                <h3 className="text-[22px] font-semibold text-[#1d1d1f] mt-3 tracking-tight">{form.title || '未命名揪團'}</h3>
                <p className="text-[13px] text-[#6e6e73] mt-1">
                  {sportLabel} · {SKILL_LABELS[form.skill_level as keyof typeof SKILL_LABELS]}
                </p>
              </div>

              <div className="space-y-3 text-[14px]">
                <div className="flex items-start gap-3 p-3 bg-[#f5f5f7] rounded-xl">
                  <Calendar className="w-4 h-4 text-[#0071e3] mt-0.5" />
                  <div>
                    <p className="text-[12px] text-[#6e6e73]">時間</p>
                    <p className="text-[#1d1d1f]">
                      {form.scheduled_at ? new Date(form.scheduled_at).toLocaleString('zh-TW') : '未設定'} · {form.duration_minutes} 分鐘
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#f5f5f7] rounded-xl">
                  <MapPin className="w-4 h-4 text-[#0071e3] mt-0.5" />
                  <div>
                    <p className="text-[12px] text-[#6e6e73]">地點</p>
                    <p className="text-[#1d1d1f]">{form.city} {form.district} · {form.location_detail || '未填寫'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#f5f5f7] rounded-xl">
                  <Users className="w-4 h-4 text-[#0071e3] mt-0.5" />
                  <div>
                    <p className="text-[12px] text-[#6e6e73]">人數 / 費用</p>
                    <p className="text-[#1d1d1f]">
                      最多 {form.max_participants} 人 ·{' '}
                      {form.price_per_person === 0
                        ? <span className="text-[#00873e] font-bold">免費</span>
                        : `$${form.price_per_person} / 人`}
                    </p>
                  </div>
                </div>

                {form.notes && (
                  <div className="p-3 bg-[#fff8e1] border border-[#ff9500]/20 rounded-xl">
                    <p className="text-[#ff9500] text-[12px] mb-1">⚠️ 注意事項</p>
                    <p className="text-[#1d1d1f] text-[14px]">{form.notes}</p>
                  </div>
                )}
              </div>

              {errors.submit && (
                <div className="p-3 bg-[#ff3b30]/10 border border-[#ff3b30]/30 rounded-xl">
                  <p className="text-[#ff3b30] text-[14px]">❌ {errors.submit}</p>
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
            className="px-5 py-2.5 rounded-full text-[14px] font-normal text-[#0071e3] hover:bg-[#f5f5f7] transition-colors"
          >
            {step === 0 ? '取消' : '上一步'}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                const e = step === 0
                  ? {
                      ...((form.title.trim() ? {} : { title: '請填寫揪團標題' })),
                      ...((form.scheduled_at ? {} : { scheduled_at: '請選擇時間' })),
                    }
                  : step === 1
                  ? (form.location_detail.trim() ? {} : { location_detail: '請填寫地點' })
                  : {}
                if (Object.keys(e).length > 0) { setErrors(e); return }
                setStep(step + 1)
              }}
              className="inline-flex items-center gap-1.5 bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#006edb] text-white px-6 py-2.5 rounded-full text-[14px] font-normal transition-colors"
            >
              下一步
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-1.5 bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#006edb] disabled:opacity-50 text-white px-7 py-2.5 rounded-full text-[14px] font-normal transition-colors"
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
