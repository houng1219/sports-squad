'use client'

import { useState } from 'react'
import { User, MapPin, Phone, Edit3, Check, Activity, Target } from 'lucide-react'
import { SPORT_LABELS, SKILL_LABELS, type Profile, type SportType } from '@/lib/types'
import { format } from 'date-fns'

export default function ProfilePage({ profile }: { profile: Profile }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Profile>(profile)
  const [saving, setSaving] = useState(false)

  const SPORTS = Object.keys(SPORT_LABELS) as (keyof typeof SPORT_LABELS)[]

  function toggleSport(sport: string) {
    if (!editing) return
    setForm(prev => ({
      ...prev,
      preferred_sports: prev.preferred_sports.includes(sport as SportType)
        ? prev.preferred_sports.filter(s => s !== sport as SportType)
        : [...prev.preferred_sports, sport as SportType],
    }))
  }

  async function handleSave() {
    setSaving(true)
    // In production, call updateProfile API
    await new Promise(r => setTimeout(r, 500))
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-400 text-white">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{form.full_name || '未設定'}</h1>
              <p className="text-orange-100 text-sm">{form.email}</p>
              <p className="text-orange-100 text-sm flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {form.city || '未設定城市'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">

          {/* Bio */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">自我介紹</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600">
                  <Edit3 className="w-4 h-4" />
                  編輯
                </button>
              ) : (
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700">
                  <Check className="w-4 h-4" />
                  {saving ? '儲存中...' : '完成'}
                </button>
              )}
            </div>
            {editing ? (
              <textarea
                value={form.bio || ''}
                onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            ) : (
              <p className="text-gray-600 text-sm leading-relaxed">
                {form.bio || '還沒填寫自我介紹'}
              </p>
            )}
          </div>

          {/* Preferred Sports */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-orange-500" />
              喜歡的球類
            </h2>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map(sport => {
                const label = SPORT_LABELS[sport]
                const [emoji, ...rest] = label.split(' ')
                const text = rest.join(' ')
                const active = form.preferred_sports.includes(sport as SportType)
                return (
                  <button
                    key={sport}
                    onClick={() => toggleSport(sport)}
                    disabled={!editing}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                      active
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-100 text-gray-400 bg-gray-50'
                    } ${editing ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span>{emoji}</span>
                    <span>{text}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Skill Level */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-4.5 h-4.5 text-orange-500" />
              技術程度
            </h2>
            <div className="flex gap-3">
              {(['beginner', 'intermediate', 'advanced', 'all'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => editing && setForm(prev => ({ ...prev, skill_level: level }))}
                  disabled={!editing}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                    form.skill_level === level
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-100 text-gray-400'
                  } ${editing ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {SKILL_LABELS[level]}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-4.5 h-4.5 text-orange-500" />
              聯絡方式
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">電話</span>
                {editing ? (
                  <input
                    type="tel"
                    value={form.phone || ''}
                    onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0912345678"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-900">{form.phone || '未填寫'}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium text-gray-900">{form.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">所在地</span>
                {editing ? (
                  <input
                    type="text"
                    value={`${form.city} ${form.district || ''}`}
                    onChange={e => {
                      const parts = e.target.value.trim().split(' ')
                      setForm(prev => ({ ...prev, city: parts[0] || '', district: parts.slice(1).join(' ') }))
                    }}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-900">{form.city} {form.district}</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">我的揪團統計</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-xs text-gray-500 mt-1">已參加</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-xs text-gray-500 mt-1">發起</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">--</div>
                <div className="text-xs text-gray-500 mt-1">出席率</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500">
              <span>加入時間</span>
              <span>{format(new Date(profile.created_at), 'yyyy年 M月 d日')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}