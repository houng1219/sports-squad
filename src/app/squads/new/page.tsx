'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { SPORT_LABELS, TAIWAN_CITIES, SKILL_LABELS, CITY_DISTRICTS, type SportType, type CreateSquadInput } from '@/lib/types'
import { createSquad } from '@/lib/api'

const SPORTS = Object.entries(SPORT_LABELS) as [SportType, string][]

const STEPS = [
  { label: '球類', icon: '🏀' },
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
      // For MVP, use a demo user ID
      await createSquad(form, 'demo-user-id')
      router.push('/squads')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '發布失敗，請稍後再試'
      setErrors({ submit: message })
      setLoading(false)
    }
  }

  const districts = CITY_DISTRICTS[form.city] || []

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/squads" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">發起揪團</h1>
              <p className="text-xs text-gray-500">設定揪團內容，邀請運動夥伴</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2" onClick={() => i < step && setStep(i)}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                i < step ? 'bg-sky-500 text-white' : i === step ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : s.icon}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? 'text-sky-600 font-medium' : 'text-gray-400'}`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 w-8 sm:w-12 mx-1 rounded ${i < step ? 'bg-sky-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">

          {/* Step 0: Sport */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  揪團標題 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => updateField('title', e.target.value)}
                  placeholder="例如：週六下午籃球三打三"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">揪團說明 <span className="text-gray-400 text-xs">(選填)</span></label>
                <textarea
                  value={form.description}
                  onChange={e => updateField('description', e.target.value)}
                  placeholder="補充更多細節..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">選擇球類 <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {SPORTS.map(([value, label]) => {
                    const [emoji, ...rest] = label.split(' ')
                    const text = rest.join(' ')
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateField('sport', value)}
                        className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${
                          form.sport === value
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <span className="text-2xl">{emoji}</span>
                        <span className={`text-xs font-medium ${form.sport === value ? 'text-sky-600' : 'text-gray-600'}`}>{text}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">技術程度</label>
                <div className="flex gap-2">
                  {(['beginner', 'intermediate', 'advanced', 'all'] as const).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => updateField('skill_level', level)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        form.skill_level === level
                          ? 'border-sky-500 bg-sky-50 text-sky-600'
                          : 'border-gray-100 text-gray-500 hover:border-gray-200'
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  日期時間 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={e => updateField('scheduled_at', e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.scheduled_at ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.scheduled_at && <p className="text-red-500 text-xs mt-1">{errors.scheduled_at}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">持續時間</label>
                <select
                  value={form.duration_minutes}
                  onChange={e => updateField('duration_minutes', parseInt(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={60}>1 小時</option>
                  <option value={90}>1.5 小時</option>
                  <option value={120}>2 小時</option>
                  <option value={180}>3 小時</option>
                  <option value={240}>4 小時</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">縣市</label>
                  <select
                    value={form.city}
                    onChange={e => { updateField('city', e.target.value); updateField('district', '') }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {TAIWAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">區</label>
                  <select
                    value={form.district}
                    onChange={e => updateField('district', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">選擇區（選填）</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  詳細地點 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.location_detail}
                  onChange={e => updateField('location_detail', e.target.value)}
                  placeholder="例如：南港運動中心 3F 籃球場"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.location_detail ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.location_detail && <p className="text-red-500 text-xs mt-1">{errors.location_detail}</p>}
              </div>
            </div>
          )}

          {/* Step 2: People & Price */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">人數上限</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min={2}
                    max={100}
                    value={form.max_participants}
                    onChange={e => updateField('max_participants', parseInt(e.target.value) || 2)}
                    className="w-24 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-center"
                  />
                  <span className="text-sm text-gray-500">人</span>
                </div>
                {errors.max_participants && <p className="text-red-500 text-xs mt-1">{errors.max_participants}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">每人費用</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    value={form.price_per_person}
                    onChange={e => updateField('price_per_person', parseInt(e.target.value) || 0)}
                    className="w-28 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-center"
                  />
                  <span className="text-sm text-gray-500">元 / 人</span>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">0 = 免費活動</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">需要自備 <span className="text-gray-400 text-xs">(選填)</span></label>
                <input
                  type="text"
                  value={form.equipment}
                  onChange={e => updateField('equipment', e.target.value)}
                  placeholder="例如：籃球鞋、球拍自備"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">注意事項 <span className="text-gray-400 text-xs">(選填)</span></label>
                <textarea
                  value={form.notes}
                  onChange={e => updateField('notes', e.target.value)}
                  placeholder="遲到規則、臨時取消政策..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              {errors.submit && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{errors.submit}</div>
              )}
              <div className="bg-sky-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{form.title || '（未填標題）'}</h3>
                <p className="text-sm text-gray-600">{SPORT_LABELS[form.sport]} · {SKILL_LABELS[form.skill_level]}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">📅 時間</p>
                  <p className="font-medium text-gray-900">
                    {form.scheduled_at ? new Date(form.scheduled_at).toLocaleString('zh-TW', { dateStyle: 'medium', timeStyle: 'short' }) : '未設定'}
                  </p>
                  <p className="text-xs text-gray-500">持續 {form.duration_minutes} 分鐘</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">📍 地點</p>
                  <p className="font-medium text-gray-900">{form.city} {form.district}</p>
                  <p className="text-xs text-gray-500">{form.location_detail || '未填寫'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">👥 人數</p>
                  <p className="font-medium text-gray-900">上限 {form.max_participants} 人</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">💰 費用</p>
                  <p className={`font-medium ${form.price_per_person === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {form.price_per_person === 0 ? '免費' : `${form.price_per_person}元/人`}
                  </p>
                </div>
              </div>
              {form.description && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">說明</p>
                  <p className="text-sm text-gray-700">{form.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                上一步
              </button>
            ) : (
              <Link href="/squads" className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                取消
              </Link>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 0 && !form.title.trim()) { setErrors({ title: '請填寫揪團標題' }); return }
                  setStep(s => s + 1)
                }}
                className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                下一步
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 disabled:bg-orange-300 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                {loading ? '發布中...' : '確認發布'}
                {!loading && <Check className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}