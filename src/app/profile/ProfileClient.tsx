'use client'

import { useState } from 'react'
import { User, MapPin, Phone, Edit3, Check, Activity, Target, Mail, Calendar } from 'lucide-react'
import { SPORT_LABELS, SPORT_ICONS, SKILL_LABELS, type Profile, type SportType } from '@/lib/types'
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
    await new Promise(r => setTimeout(r, 500))
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#d2d2d7]/60">
        <div className="absolute inset-0 bg-[#fbfbfd]" />
        <div className="relative max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-sky-500/20 border border-[#0071e3]/30 rounded-full flex items-center justify-center text-3xl">
              <User className="w-9 h-9 text-[#0071e3]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#1d1d1f]">{form.full_name || '未設定'}</h1>
              <p className="text-[#6e6e73] text-sm flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5" />
                {form.email}
              </p>
              <p className="text-[#6e6e73] text-sm flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {form.city || '未設定城市'} {form.district}
              </p>
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 bg-[#0071e3]/10 hover:bg-[#0071e3]/10 border border-[#0071e3]/30 text-[#0071e3] px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                編輯
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 bg-[#0071e3] hover:from-cyan-400 hover:to-sky-400 text-[#1d1d1f] px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
              >
                <Check className="w-4 h-4" />
                {saving ? '儲存中...' : '完成'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {/* Bio */}
        <div className="bg-[#f5f5f7] border border-[#d2d2d7]/60 rounded-2xl p-5">
          <h2 className="font-semibold text-[#1d1d1f] mb-3 flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#0071e3]" />
            自我介紹
          </h2>
          {editing ? (
            <textarea
              value={form.bio || ''}
              onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full bg-[#f5f5f7] border border-[#d2d2d7]/60 rounded-xl px-4 py-3 text-sm text-[#1d1d1f] placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all"
            />
          ) : (
            <p className="text-[#1d1d1f] text-sm leading-relaxed">
              {form.bio || <span className="text-[#86868b]">還沒填寫自我介紹</span>}
            </p>
          )}
        </div>

        {/* Preferred Sports */}
        <div className="bg-[#f5f5f7] border border-[#d2d2d7]/60 rounded-2xl p-5">
          <h2 className="font-semibold text-[#1d1d1f] mb-3 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#0071e3]" />
            喜歡的球類 <span className="text-[#86868b] text-xs font-normal">({form.preferred_sports.length} 項)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {SPORTS.map(sport => {
              const emoji = SPORT_ICONS[sport as SportType] || '🏅'
              const text = SPORT_LABELS[sport].replace(/^[^\s]+\s/, '')
              const active = form.preferred_sports.includes(sport as SportType)
              return (
                <button
                  key={sport}
                  onClick={() => toggleSport(sport)}
                  disabled={!editing}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    active
                      ? 'border-cyan-400 bg-[#0071e3]/10 text-[#0071e3]'
                      : 'border-[#d2d2d7]/60 bg-white/[0.02] text-[#86868b]'
                  } ${editing ? 'cursor-pointer hover:border-white/30' : 'cursor-default'}`}
                >
                  <span>{emoji}</span>
                  <span>{text}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Skill Level */}
        <div className="bg-[#f5f5f7] border border-[#d2d2d7]/60 rounded-2xl p-5">
          <h2 className="font-semibold text-[#1d1d1f] mb-3 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-[#0071e3]" />
            技術程度
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {(['beginner', 'intermediate', 'advanced', 'all'] as const).map(level => (
              <button
                key={level}
                onClick={() => editing && setForm(prev => ({ ...prev, skill_level: level }))}
                disabled={!editing}
                className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                  form.skill_level === level
                    ? 'border-cyan-400 bg-[#0071e3]/10 text-[#0071e3]'
                    : 'border-[#d2d2d7]/60 bg-white/[0.02] text-[#86868b]'
                } ${editing ? 'cursor-pointer hover:border-white/30' : 'cursor-default'}`}
              >
                {SKILL_LABELS[level]}
              </button>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-[#f5f5f7] border border-[#d2d2d7]/60 rounded-2xl p-5">
          <h2 className="font-semibold text-[#1d1d1f] mb-3 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-[#0071e3]" />
            聯絡方式
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#6e6e73]">📱 電話</span>
              {editing ? (
                <input
                  type="tel"
                  value={form.phone || ''}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-[#f5f5f7] border border-[#d2d2d7]/60 rounded-lg px-3 py-1.5 text-sm text-[#1d1d1f] text-right focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="0912345678"
                />
              ) : (
                <span className="text-sm font-medium text-[#1d1d1f]">{form.phone || '未填寫'}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6e6e73]">📧 Email</span>
              <span className="text-sm font-medium text-[#1d1d1f]">{form.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6e6e73]">📍 所在地</span>
              {editing ? (
                <input
                  type="text"
                  value={`${form.city} ${form.district || ''}`}
                  onChange={e => {
                    const parts = e.target.value.trim().split(' ')
                    setForm(prev => ({ ...prev, city: parts[0] || '', district: parts.slice(1).join(' ') }))
                  }}
                  className="bg-[#f5f5f7] border border-[#d2d2d7]/60 rounded-lg px-3 py-1.5 text-sm text-[#1d1d1f] text-right focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              ) : (
                <span className="text-sm font-medium text-[#1d1d1f]">{form.city} {form.district}</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#f5f5f7] border border-[#d2d2d7]/60 rounded-2xl p-5">
          <h2 className="font-semibold text-[#1d1d1f] mb-4">我的揪團統計</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-xl">
              <div className="text-2xl font-bold text-[#0071e3]">3</div>
              <div className="text-xs text-[#6e6e73] mt-1">已參加</div>
            </div>
            <div className="text-center p-4 bg-[#00873e]/10 border border-emerald-500/20 rounded-xl">
              <div className="text-2xl font-bold text-[#00873e]">1</div>
              <div className="text-xs text-[#6e6e73] mt-1">發起</div>
            </div>
            <div className="text-center p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl">
              <div className="text-2xl font-bold text-sky-300">100%</div>
              <div className="text-xs text-[#6e6e73] mt-1">出席率</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#d2d2d7]/60 flex items-center justify-between text-sm text-[#6e6e73]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              加入時間
            </span>
            <span className="text-[#1d1d1f]">{format(new Date(profile.created_at), 'yyyy年 M月 d日')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
