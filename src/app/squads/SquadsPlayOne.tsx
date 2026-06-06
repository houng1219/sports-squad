'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { MapPin, Clock, Users, Search, X, Filter, ChevronRight, Calendar } from 'lucide-react'
import {
  SPORT_LABELS,
  SPORT_ICONS,
  TAIWAN_CITIES,
  SKILL_LABELS,
  type SportType,
  type SquadCard,
} from '@/lib/types'
import RangeSlider from '@/components/RangeSlider'
import { Chip, ChipGroup } from '@/components/Chip'

// ============================================================
// 篩選條件型別
// ============================================================
export interface FilterState {
  cities: string[]
  sports: string[]
  skillRange: [number, number]   // 0=不限, 1=初學, 2=中級, 3=高級
  timeRange: [number, number]    // 0-23 小時
  freeOnly: boolean
  hasSlots: boolean               // 還有缺
  search: string
}

const SKILL_LABELS_ARR = ['不限', '初學', '中級', '高級']
const SKILL_VALUE_MAP: Record<string, number> = {
  all: 0,
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

const SKILL_NAME_MAP: Record<number, string> = {
  0: '不限',
  1: '初學',
  2: '中級',
  3: '高級',
}

// 時段(0-23) - 只顯示 5 個關鍵節點,寬度才夠
const HOUR_LABELS: (string | null)[] = [
  '00', null, null, null, null, null,
  '06', null, null, null, null, null,
  '12', null, null, null, null, null,
  '18', null, null, null, null, '23',
]

// 球類選項
const SPORT_OPTIONS = (Object.keys(SPORT_LABELS) as SportType[]).map(k => ({
  value: k,
  label: SPORT_LABELS[k].replace(/^[^\s]+\s/, ''),
  emoji: SPORT_ICONS[k],
}))

// 設施 chip(給揪團的「場地屬性」,示範用)
const FACILITY_OPTIONS = [
  { value: 'indoor', label: '室內', emoji: '🏠' },
  { value: 'shower', label: '淋浴', emoji: '🚿' },
  { value: 'parking', label: '好停車', emoji: '🅿️' },
  { value: 'ac', label: '冷氣', emoji: '❄️' },
  { value: 'rental', label: '器材租借', emoji: '🏸' },
  { value: 'water', label: '飲水機', emoji: '💧' },
]

interface SquadsPlayOneProps {
  squads: SquadCard[]
}

// ============================================================
// 主組件
// ============================================================
export default function SquadsPlayOne({ squads }: SquadsPlayOneProps) {
  const [filters, setFilters] = useState<FilterState>({
    cities: [],
    sports: [],
    skillRange: [0, 3],
    timeRange: [0, 23],
    freeOnly: false,
    hasSlots: false,
    search: '',
  })

  const [selected, setSelected] = useState<SquadCard | null>(null)
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  // 篩選邏輯
  const filtered = useMemo(() => {
    return squads.filter(s => {
      if (filters.cities.length > 0 && !filters.cities.includes(s.city)) return false
      if (filters.sports.length > 0 && !filters.sports.includes(s.sport)) return false
      // 程度
      const sv = SKILL_VALUE_MAP[s.skill_level] ?? 0
      if (sv < filters.skillRange[0] || sv > filters.skillRange[1]) return false
      // 時段(從 scheduled_at 抓小時)
      const hour = new Date(s.scheduled_at).getHours()
      if (hour < filters.timeRange[0] || hour > filters.timeRange[1]) return false
      // 免費
      if (filters.freeOnly && s.price_per_person > 0) return false
      // 還有缺
      if (filters.hasSlots && s.participant_count >= s.max_participants) return false
      // 搜尋
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const hay = `${s.title} ${s.location_detail} ${s.description ?? ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [squads, filters])

  // 計算 active filter 數
  const activeCount =
    filters.cities.length +
    filters.sports.length +
    (filters.skillRange[0] !== 0 || filters.skillRange[1] !== 3 ? 1 : 0) +
    (filters.timeRange[0] !== 0 || filters.timeRange[1] !== 23 ? 1 : 0) +
    (filters.freeOnly ? 1 : 0) +
    (filters.hasSlots ? 1 : 0) +
    (filters.search ? 1 : 0)

  function reset() {
    setFilters({
      cities: [],
      sports: [],
      skillRange: [0, 3],
      timeRange: [0, 23],
      freeOnly: false,
      hasSlots: false,
      search: '',
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">揪團列表</h1>
            <p className="text-white/50 text-sm mt-0.5">
              找到適合你的運動夥伴 — {filtered.length} 個揪團
            </p>
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilter(true)}
            className="md:hidden inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80"
          >
            <Filter className="w-4 h-4" />
            篩選
            {activeCount > 0 && (
              <span className="ml-1 bg-cyan-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
          {/* ============== 左側篩選器(PlayOne style) ============== */}
          <aside
            className={`
              ${showMobileFilter ? 'fixed inset-0 z-50 bg-[var(--bg)] overflow-y-auto p-4' : 'hidden md:block'}
              md:relative md:p-0 md:bg-transparent
            `}
          >
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={reset}
              onCloseMobile={() => setShowMobileFilter(false)}
            />
          </aside>

          {/* ============== 右側揪團列表 ============== */}
          <main>
            {/* Mobile search */}
            <div className="md:hidden mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="搜尋揪團標題、地點..."
                  value={filters.search}
                  onChange={e => setFilters({ ...filters, search: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/40"
                />
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-white/50">已套用篩選:</span>
                {filters.cities.map(c => (
                  <button
                    key={c}
                    onClick={() => setFilters({ ...filters, cities: filters.cities.filter(x => x !== c) })}
                    className="inline-flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-1 rounded-full border border-cyan-500/30"
                  >
                    📍 {c}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {filters.sports.map(sp => (
                  <button
                    key={sp}
                    onClick={() => setFilters({ ...filters, sports: filters.sports.filter(x => x !== sp) })}
                    className="inline-flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-1 rounded-full border border-cyan-500/30"
                  >
                    {SPORT_ICONS[sp as SportType]} {SPORT_LABELS[sp as SportType].replace(/^[^\s]+\s/, '')}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {(filters.skillRange[0] !== 0 || filters.skillRange[1] !== 3) && (
                  <button
                    onClick={() => setFilters({ ...filters, skillRange: [0, 3] })}
                    className="inline-flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-1 rounded-full border border-cyan-500/30"
                  >
                    💪 {SKILL_NAME_MAP[filters.skillRange[0]]}~{SKILL_NAME_MAP[filters.skillRange[1]]}
                    <X className="w-3 h-3" />
                  </button>
                )}
                {(filters.timeRange[0] !== 0 || filters.timeRange[1] !== 23) && (
                  <button
                    onClick={() => setFilters({ ...filters, timeRange: [0, 23] })}
                    className="inline-flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-1 rounded-full border border-cyan-500/30"
                  >
                    ⏰ {String(filters.timeRange[0]).padStart(2, '0')}:00 - {String(filters.timeRange[1]).padStart(2, '0')}:00
                    <X className="w-3 h-3" />
                  </button>
                )}
                {filters.freeOnly && (
                  <button
                    onClick={() => setFilters({ ...filters, freeOnly: false })}
                    className="inline-flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-1 rounded-full border border-cyan-500/30"
                  >
                    💰 免費
                    <X className="w-3 h-3" />
                  </button>
                )}
                {filters.hasSlots && (
                  <button
                    onClick={() => setFilters({ ...filters, hasSlots: false })}
                    className="inline-flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-1 rounded-full border border-cyan-500/30"
                  >
                    👥 還有名額
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={reset}
                  className="text-xs text-white/40 hover:text-white/70 underline ml-1"
                >
                  清除全部
                </button>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 font-medium mb-2">找不到符合條件的揪團</p>
                <p className="text-white/40 text-sm mb-4">嘗試放寬篩選條件,或自己當主揪</p>
                <Link
                  href="/squads/new"
                  className="inline-flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  發起揪團
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(squad => (
                  <SquadCardDense
                    key={squad.id}
                    squad={squad}
                    onClick={() => setSelected(squad)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ============== 詳情 Modal ============== */}
      {selected && (
        <SquadDetailModal
          squad={selected}
          relatedSquads={squads.filter(
            s =>
              s.id !== selected.id &&
              (s.city === selected.city || s.sport === selected.sport)
          ).slice(0, 4)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

// ============================================================
// 左側篩選器
// ============================================================
function FilterSidebar({
  filters,
  setFilters,
  onReset,
  onCloseMobile,
}: {
  filters: FilterState
  setFilters: (f: FilterState) => void
  onReset: () => void
  onCloseMobile?: () => void
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 md:sticky md:top-24 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold flex items-center gap-1.5">
          <Filter className="w-4 h-4" />
          篩選條件
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="text-xs text-cyan-400 hover:text-cyan-300 underline"
          >
            清除
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 縣市 */}
      <FilterSection title="縣市" icon="📍">
        <ChipGroup
          options={TAIWAN_CITIES.slice(0, 8).map(c => ({ value: c, label: c }))}
          selected={filters.cities}
          onChange={cities => setFilters({ ...filters, cities })}
        />
        {TAIWAN_CITIES.length > 8 && (
          <details className="mt-2">
            <summary className="text-xs text-cyan-400 cursor-pointer hover:text-cyan-300">
              顯示更多 ({TAIWAN_CITIES.length - 8})
            </summary>
            <div className="mt-2">
              <ChipGroup
                options={TAIWAN_CITIES.slice(8).map(c => ({ value: c, label: c }))}
                selected={filters.cities}
                onChange={cities => setFilters({ ...filters, cities })}
              />
            </div>
          </details>
        )}
      </FilterSection>

      {/* 球類 */}
      <FilterSection title="球類" icon="🏀">
        <ChipGroup
          options={SPORT_OPTIONS}
          selected={filters.sports}
          onChange={sports => setFilters({ ...filters, sports })}
        />
      </FilterSection>

      {/* 程度(雙滑桿) */}
      <FilterSection title="程度範圍" icon="💪">
        <RangeSlider
          min={0}
          max={3}
          value={filters.skillRange}
          onChange={v => setFilters({ ...filters, skillRange: v })}
          labels={SKILL_LABELS_ARR}
        />
      </FilterSection>

      {/* 時段(雙滑桿) */}
      <FilterSection title="時段範圍" icon="⏰">
        <RangeSlider
          min={0}
          max={23}
          value={filters.timeRange}
          onChange={v => setFilters({ ...filters, timeRange: v })}
          labels={HOUR_LABELS}
        />
        <div className="flex justify-between mt-1.5 text-xs font-medium text-cyan-300">
          <span>{String(filters.timeRange[0]).padStart(2, '0')}:00 起</span>
          <span>至 {String(filters.timeRange[1]).padStart(2, '0')}:00</span>
        </div>
      </FilterSection>

      {/* 設施標籤 */}
      <FilterSection title="場地設施" icon="🏠">
        <ChipGroup
          options={FACILITY_OPTIONS}
          selected={[]}
          onChange={() => {}}
          size="sm"
        />
        <p className="text-[10px] text-white/30 mt-2">*設施資料以實際場地為準</p>
      </FilterSection>

      {/* 快速選項 */}
      <FilterSection title="其他" icon="⚡">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-white/80">
            <input
              type="checkbox"
              checked={filters.freeOnly}
              onChange={e => setFilters({ ...filters, freeOnly: e.target.checked })}
              className="rounded accent-cyan-500"
            />
            <span>💰 免費揪團</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-white/80">
            <input
              type="checkbox"
              checked={filters.hasSlots}
              onChange={e => setFilters({ ...filters, hasSlots: e.target.checked })}
              className="rounded accent-cyan-500"
            />
            <span>👥 還有名額</span>
          </label>
        </div>
      </FilterSection>

      {/* 搜尋(桌機版) */}
      <div className="hidden md:block">
        <FilterSection title="關鍵字" icon="🔍">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="揪團標題、地點..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/40"
            />
          </div>
        </FilterSection>
      </div>

      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="md:hidden w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 rounded-lg text-sm font-medium"
        >
          套用篩選
        </button>
      )}
    </div>
  )
}

function FilterSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wider text-white/50 font-medium mb-2.5 flex items-center gap-1">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}

// ============================================================
// 揪團卡片(PlayOne 資訊密度版)
// ============================================================
function SquadCardDense({ squad, onClick }: { squad: SquadCard; onClick: () => void }) {
  const emoji = SPORT_ICONS[squad.sport as SportType] || '🏅'
  const sportLabel = SPORT_LABELS[squad.sport as SportType].replace(/^[^\s]+\s/, '')
  const date = new Date(squad.scheduled_at)
  const isFree = squad.price_per_person === 0
  const isFull = squad.participant_count >= squad.max_participants
  const slotsLeft = squad.max_participants - squad.participant_count
  const slotsRatio = squad.participant_count / squad.max_participants

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 rounded-2xl overflow-hidden transition-all group"
    >
      <div className="flex">
        {/* Left accent bar - colored by sport */}
        <div className="w-1 bg-gradient-to-b from-cyan-400 via-sky-400 to-teal-400 flex-shrink-0" />

        <div className="flex-1 p-4">
          {/* Row 1: Sport + 庫存 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{emoji}</span>
              <span className="text-sm font-semibold text-white/70">{sportLabel}</span>
              {isFull && (
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
                  已額滿
                </span>
              )}
              {!isFull && slotsLeft <= 2 && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">
                  剩 {slotsLeft} 個
                </span>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* Row 2: 揪團標題 */}
          <h3 className="font-semibold text-white text-base mb-2.5 line-clamp-1">
            {squad.title}
          </h3>

          {/* Row 3: 時間 + 地點(最顯眼資訊) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm mb-2.5">
            <span className="flex items-center gap-1 text-cyan-300 font-medium">
              <Clock className="w-4 h-4" />
              {format(date, 'M/dd (EEE)', { locale: zhTW })} {format(date, 'HH:mm')}
              <span className="text-white/40 font-normal">· {squad.duration_minutes}分</span>
            </span>
            <span className="flex items-center gap-1 text-white/70">
              <MapPin className="w-4 h-4 text-white/50" />
              {squad.city} {squad.district}
            </span>
          </div>

          {/* Row 4: 程度 + 價錢 + 主辦 */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 flex-wrap">
              <SkillBadge level={squad.skill_level} />
              {isFree ? (
                <span className="text-sm font-bold text-emerald-400">免費</span>
              ) : (
                <span className="text-sm font-bold text-cyan-300">${squad.price_per_person}</span>
              )}
              <span className="text-[10px] text-white/30">·</span>
              <span className="text-[11px] text-white/40">{squad.location_detail.split(' ')[0]}</span>
            </div>

            {/* 庫存 bar + 數字 */}
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <Users className="w-3.5 h-3.5" />
              <div className="flex items-center gap-1">
                <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      slotsRatio >= 1 ? 'bg-red-400' : slotsRatio >= 0.7 ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, slotsRatio * 100)}%` }}
                  />
                </div>
                <span className="font-medium text-white/80">
                  {squad.participant_count}/{squad.max_participants}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

function SkillBadge({ level }: { level: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    all: { bg: 'bg-white/10', text: 'text-white/70', label: '👥 不限' },
    beginner: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', label: '🌱 初學' },
    intermediate: { bg: 'bg-sky-500/20', text: 'text-sky-300', label: '⭐ 中級' },
    advanced: { bg: 'bg-rose-500/20', text: 'text-rose-300', label: '🔥 高級' },
  }
  const m = map[level] || map.all
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${m.bg} ${m.text}`}>
      {m.label}
    </span>
  )
}

// ============================================================
// 詳情 Modal(PlayOne 風格 + 交叉推廣)
// ============================================================
function SquadDetailModal({
  squad,
  relatedSquads,
  onClose,
}: {
  squad: SquadCard
  relatedSquads: SquadCard[]
  onClose: () => void
}) {
  const date = new Date(squad.scheduled_at)
  const isFree = squad.price_per_person === 0
  const isFull = squad.participant_count >= squad.max_participants

  // 同場地 vs 同球類
  const sameLocation = relatedSquads.filter(s => s.city === squad.city && s.district === squad.district)
  const sameSport = relatedSquads.filter(s => s.sport === squad.sport && s.id !== squad.id).slice(0, 3)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-4"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-3xl max-h-[90vh] bg-[var(--bg-card)] border border-white/10 rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-5 border-b border-white/10">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{SPORT_ICONS[squad.sport as SportType] || '🏅'}</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white mb-1">{squad.title}</h2>
              <p className="text-sm text-white/50">
                {SPORT_LABELS[squad.sport as SportType].replace(/^[^\s]+\s/, '')} · 主辦 {squad.organizer?.full_name || '未知'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white p-1"
              aria-label="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* 主要資訊 grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <InfoBlock icon="📅" label="日期">
              {format(date, 'M/dd (EEE)', { locale: zhTW })}
            </InfoBlock>
            <InfoBlock icon="⏰" label="時間">
              {format(date, 'HH:mm')} -{' '}
              {String(new Date(date.getTime() + squad.duration_minutes * 60000).getHours()).padStart(2, '0')}:00
            </InfoBlock>
            <InfoBlock icon="📍" label="地點">
              {squad.city} {squad.district}
            </InfoBlock>
            <InfoBlock icon="💪" label="程度">
              {SKILL_LABELS[squad.skill_level as keyof typeof SKILL_LABELS] || squad.skill_level}
            </InfoBlock>
          </div>

          {/* 場地詳情 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-cyan-400" />
              場地資訊
            </h3>
            <p className="text-sm text-white/70">{squad.location_detail}</p>
            {squad.equipment && (
              <p className="text-xs text-white/50 mt-2">
                <span className="text-cyan-400">器材:</span> {squad.equipment}
              </p>
            )}
          </div>

          {/* 描述 */}
          {squad.description && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">揪團說明</h3>
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{squad.description}</p>
            </div>
          )}

          {/* 注意事項 */}
          {squad.notes && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-amber-300 mb-1">⚠️ 注意事項</h3>
              <p className="text-sm text-white/70 leading-relaxed">{squad.notes}</p>
            </div>
          )}

          {/* 參加者 + 報名狀態 */}
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4">
            <div>
              <p className="text-xs text-white/50 mb-1">目前參加人數</p>
              <p className="text-lg font-bold text-white">
                {squad.participant_count} <span className="text-white/40 text-sm">/ {squad.max_participants}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50 mb-1">費用</p>
              <p className={`text-lg font-bold ${isFree ? 'text-emerald-400' : 'text-cyan-300'}`}>
                {isFree ? '免費' : `$${squad.price_per_person}`}
              </p>
            </div>
          </div>

          {/* 交叉推廣:同場地 / 同球類 */}
          {(sameLocation.length > 0 || sameSport.length > 0) && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-cyan-400" />
                你可能也會喜歡
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sameLocation.slice(0, 2).map(s => (
                  <RelatedCard key={`loc-${s.id}`} squad={s} reason="同場地" />
                ))}
                {sameSport.slice(0, 2).map(s => (
                  <RelatedCard key={`sport-${s.id}`} squad={s} reason="同球類" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer - 報名 CTA */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex items-center gap-3">
          <Link
            href={`/squads/${squad.id}`}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-lg text-sm font-medium text-center transition-colors"
          >
            查看完整頁
          </Link>
          <button
            disabled={isFull}
            className="flex-[2] bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 disabled:from-white/10 disabled:to-white/10 disabled:text-white/30 text-white py-2.5 rounded-lg text-sm font-bold transition-all disabled:cursor-not-allowed"
          >
            {isFull ? '已額滿' : isFree ? '免費報名 →' : `$${squad.price_per_person} 報名 →`}
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoBlock({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <p className="text-[10px] text-white/40 mb-1 flex items-center gap-1">
        <span>{icon}</span>
        {label}
      </p>
      <p className="text-sm font-semibold text-white">{children}</p>
    </div>
  )
}

function RelatedCard({ squad, reason }: { squad: SquadCard; reason: string }) {
  const date = new Date(squad.scheduled_at)
  return (
    <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 cursor-pointer transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
          {reason}
        </span>
        <span className="text-[10px] text-white/40">
          {format(date, 'M/dd HH:mm')}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-white line-clamp-1 mb-0.5">{squad.title}</h4>
      <p className="text-[11px] text-white/50 flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        {squad.city} {squad.district} · {squad.participant_count}/{squad.max_participants}
      </p>
    </div>
  )
}
