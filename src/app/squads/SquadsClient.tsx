'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { MapPin, Clock, Users, Search, X, Filter, ChevronRight, Calendar, SlidersHorizontal } from 'lucide-react'
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
  skillRange: [number, number]
  timeRange: [number, number]
  freeOnly: boolean
  hasSlots: boolean
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

const HOUR_LABELS: (string | null)[] = [
  '00', null, null, null, null, null,
  '06', null, null, null, null, null,
  '12', null, null, null, null, null,
  '18', null, null, null, null, '23',
]

const SPORT_OPTIONS = (Object.keys(SPORT_LABELS) as SportType[]).map(k => ({
  value: k,
  label: SPORT_LABELS[k].replace(/^[^\s]+\s/, ''),
  emoji: SPORT_ICONS[k],
}))

const FACILITY_OPTIONS = [
  { value: 'indoor', label: '室內', emoji: '🏠' },
  { value: 'shower', label: '淋浴', emoji: '🚿' },
  { value: 'parking', label: '好停車', emoji: '🅿️' },
  { value: 'ac', label: '冷氣', emoji: '❄️' },
  { value: 'rental', label: '器材租借', emoji: '🏸' },
  { value: 'water', label: '飲水機', emoji: '💧' },
]

interface SquadsClientProps {
  squads: SquadCard[]
}

// ============================================================
// 主組件 — Apple 經典配色
// ============================================================
export default function SquadsClient({ squads }: SquadsClientProps) {
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

  const filtered = useMemo(() => {
    return squads.filter(s => {
      if (filters.cities.length > 0 && !filters.cities.includes(s.city)) return false
      if (filters.sports.length > 0 && !filters.sports.includes(s.sport)) return false
      const sv = SKILL_VALUE_MAP[s.skill_level] ?? 0
      if (sv < filters.skillRange[0] || sv > filters.skillRange[1]) return false
      const hour = new Date(s.scheduled_at).getHours()
      if (hour < filters.timeRange[0] || hour > filters.timeRange[1]) return false
      if (filters.freeOnly && s.price_per_person > 0) return false
      if (filters.hasSlots && s.participant_count >= s.max_participants) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const hay = `${s.title} ${s.location_detail} ${s.description ?? ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [squads, filters])

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
    <div className="min-h-screen bg-white">
      {/* Header — Apple 風格大量留白 */}
      <div className="border-b border-[#d2d2d7]/60 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-end justify-between">
          <div>
            <h1 className="text-[40px] font-semibold tracking-tight text-[#1d1d1f] leading-tight">揪團</h1>
            <p className="text-[#6e6e73] text-[15px] mt-1.5">
              找到適合你的運動夥伴 — 共 {filtered.length} 個揪團
            </p>
          </div>
          <button
            onClick={() => setShowMobileFilter(true)}
            className="md:hidden inline-flex items-center gap-1.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-full px-4 py-2 text-[14px] text-[#1d1d1f] font-normal"
          >
            <SlidersHorizontal className="w-4 h-4" />
            篩選
            {activeCount > 0 && (
              <span className="ml-1 bg-[#0071e3] text-white text-[10px] font-semibold px-1.5 rounded-full">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* ============== 左側篩選器 (Apple 風格) ============== */}
          <aside
            className={`
              ${showMobileFilter ? 'fixed inset-0 z-50 bg-white overflow-y-auto p-6' : 'hidden md:block'}
              md:relative md:p-0
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
            <div className="md:hidden mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                <input
                  type="text"
                  placeholder="搜尋揪團標題、地點..."
                  value={filters.search}
                  onChange={e => setFilters({ ...filters, search: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-transparent rounded-xl pl-10 pr-4 py-3 text-[14px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Active filter chips - Apple 風格藍色 pill */}
            {activeCount > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="text-[13px] text-[#6e6e73]">已篩選:</span>
                {filters.cities.map(c => (
                  <button
                    key={c}
                    onClick={() => setFilters({ ...filters, cities: filters.cities.filter(x => x !== c) })}
                    className="inline-flex items-center gap-1 bg-[#0071e3]/10 text-[#0071e3] text-[13px] px-3 py-1 rounded-full font-normal hover:bg-[#0071e3]/20"
                  >
                    📍 {c}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {filters.sports.map(sp => (
                  <button
                    key={sp}
                    onClick={() => setFilters({ ...filters, sports: filters.sports.filter(x => x !== sp) })}
                    className="inline-flex items-center gap-1 bg-[#0071e3]/10 text-[#0071e3] text-[13px] px-3 py-1 rounded-full font-normal hover:bg-[#0071e3]/20"
                  >
                    {SPORT_ICONS[sp as SportType]} {SPORT_LABELS[sp as SportType].replace(/^[^\s]+\s/, '')}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {(filters.skillRange[0] !== 0 || filters.skillRange[1] !== 3) && (
                  <button
                    onClick={() => setFilters({ ...filters, skillRange: [0, 3] })}
                    className="inline-flex items-center gap-1 bg-[#0071e3]/10 text-[#0071e3] text-[13px] px-3 py-1 rounded-full font-normal"
                  >
                    💪 {SKILL_NAME_MAP[filters.skillRange[0]]}~{SKILL_NAME_MAP[filters.skillRange[1]]}
                    <X className="w-3 h-3" />
                  </button>
                )}
                {(filters.timeRange[0] !== 0 || filters.timeRange[1] !== 23) && (
                  <button
                    onClick={() => setFilters({ ...filters, timeRange: [0, 23] })}
                    className="inline-flex items-center gap-1 bg-[#0071e3]/10 text-[#0071e3] text-[13px] px-3 py-1 rounded-full font-normal"
                  >
                    ⏰ {String(filters.timeRange[0]).padStart(2, '0')}:00 - {String(filters.timeRange[1]).padStart(2, '0')}:00
                    <X className="w-3 h-3" />
                  </button>
                )}
                {filters.freeOnly && (
                  <button onClick={() => setFilters({ ...filters, freeOnly: false })} className="inline-flex items-center gap-1 bg-[#0071e3]/10 text-[#0071e3] text-[13px] px-3 py-1 rounded-full font-normal">
                    💰 免費
                    <X className="w-3 h-3" />
                  </button>
                )}
                {filters.hasSlots && (
                  <button onClick={() => setFilters({ ...filters, hasSlots: false })} className="inline-flex items-center gap-1 bg-[#0071e3]/10 text-[#0071e3] text-[13px] px-3 py-1 rounded-full font-normal">
                    👥 還有名額
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button onClick={reset} className="text-[13px] text-[#0071e3] hover:underline ml-1">
                  清除全部
                </button>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-[#f5f5f7] rounded-2xl">
                <Users className="w-12 h-12 text-[#d2d2d7] mx-auto mb-4" />
                <p className="text-[#1d1d1f] font-semibold mb-2 text-[17px]">找不到符合條件的揪團</p>
                <p className="text-[#6e6e73] text-[14px] mb-5">嘗試放寬篩選條件,或自己當主揪</p>
                <Link
                  href="/squads/new"
                  className="inline-flex items-center gap-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 rounded-full text-[14px] font-normal transition-colors"
                >
                  發起揪團
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(squad => (
                  <SquadCardApple key={squad.id} squad={squad} onClick={() => setSelected(squad)} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ============== 詳情 Modal (Apple 風格) ============== */}
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
// 左側篩選器 - Apple 風格
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
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-16 bg-white/95 backdrop-blur-sm z-10 py-2 -mt-2">
        <h2 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f] flex items-center gap-1.5">
          <Filter className="w-4 h-4" />
          篩選
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="text-[13px] text-[#0071e3] hover:underline"
          >
            清除
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-[#6e6e73] hover:text-[#1d1d1f]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 縣市 */}
      <FilterSection title="縣市">
        <ChipGroup
          options={TAIWAN_CITIES.slice(0, 8).map(c => ({ value: c, label: c }))}
          selected={filters.cities}
          onChange={cities => setFilters({ ...filters, cities })}
        />
        {TAIWAN_CITIES.length > 8 && (
          <details className="mt-2">
            <summary className="text-[13px] text-[#0071e3] cursor-pointer hover:underline">
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
      <FilterSection title="球類">
        <ChipGroup
          options={SPORT_OPTIONS}
          selected={filters.sports}
          onChange={sports => setFilters({ ...filters, sports })}
        />
      </FilterSection>

      {/* 程度 */}
      <FilterSection title="程度範圍">
        <RangeSlider
          min={0}
          max={3}
          value={filters.skillRange}
          onChange={v => setFilters({ ...filters, skillRange: v })}
          labels={SKILL_LABELS_ARR}
        />
      </FilterSection>

      {/* 時段 */}
      <FilterSection title="時段範圍">
        <RangeSlider
          min={0}
          max={23}
          value={filters.timeRange}
          onChange={v => setFilters({ ...filters, timeRange: v })}
          labels={HOUR_LABELS}
        />
        <div className="flex justify-between mt-2 text-[13px] text-[#6e6e73]">
          <span>{String(filters.timeRange[0]).padStart(2, '0')}:00</span>
          <span>{String(filters.timeRange[1]).padStart(2, '0')}:00</span>
        </div>
      </FilterSection>

      {/* 設施 */}
      <FilterSection title="場地設施">
        <ChipGroup
          options={FACILITY_OPTIONS}
          selected={[]}
          onChange={() => {}}
          size="sm"
        />
        <p className="text-[11px] text-[#86868b] mt-2">*設施資料以實際場地為準</p>
      </FilterSection>

      {/* 快速選項 */}
      <FilterSection title="其他">
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer text-[14px] text-[#1d1d1f]">
            <input
              type="checkbox"
              checked={filters.freeOnly}
              onChange={e => setFilters({ ...filters, freeOnly: e.target.checked })}
              className="w-4 h-4 rounded accent-[#0071e3]"
            />
            <span>💰 免費揪團</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer text-[14px] text-[#1d1d1f]">
            <input
              type="checkbox"
              checked={filters.hasSlots}
              onChange={e => setFilters({ ...filters, hasSlots: e.target.checked })}
              className="w-4 h-4 rounded accent-[#0071e3]"
            />
            <span>👥 還有名額</span>
          </label>
        </div>
      </FilterSection>

      {/* 搜尋 (桌機) */}
      <div className="hidden md:block">
        <FilterSection title="關鍵字">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
            <input
              type="text"
              placeholder="揪團標題、地點..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="w-full bg-[#f5f5f7] border border-transparent rounded-lg pl-9 pr-3 py-2.5 text-[14px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
            />
          </div>
        </FilterSection>
      </div>

      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="md:hidden w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-full text-[15px] font-normal"
        >
          套用篩選
        </button>
      )}
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[13px] uppercase tracking-wider text-[#6e6e73] font-semibold mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

// ============================================================
// 揪團卡片 - Apple 風格
// ============================================================
function SquadCardApple({ squad, onClick }: { squad: SquadCard; onClick: () => void }) {
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
      className="w-full text-left bg-white hover:bg-[#fbfbfd] border border-[#d2d2d7]/60 hover:border-[#0071e3] rounded-2xl overflow-hidden transition-all group"
    >
      <div className="p-5">
        {/* Row 1: sport + 庫存狀態 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{emoji}</span>
            <span className="text-[13px] font-medium text-[#6e6e73]">{sportLabel}</span>
            {isFull && (
              <span className="text-[11px] bg-[#ff3b30]/10 text-[#ff3b30] px-2 py-0.5 rounded-full font-medium">
                已額滿
              </span>
            )}
            {!isFull && slotsLeft <= 2 && (
              <span className="text-[11px] bg-[#ff9500]/10 text-[#ff9500] px-2 py-0.5 rounded-full font-medium">
                剩 {slotsLeft} 個
              </span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-[#d2d2d7] group-hover:text-[#0071e3] group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Row 2: 標題 */}
        <h3 className="font-semibold text-[#1d1d1f] text-[19px] mb-3 leading-snug tracking-tight line-clamp-1">
          {squad.title}
        </h3>

        {/* Row 3: 時間 + 地點 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] mb-3">
          <span className="flex items-center gap-1.5 text-[#0071e3] font-medium">
            <Clock className="w-3.5 h-3.5" />
            {format(date, 'M/dd (EEE) HH:mm', { locale: zhTW })}
            <span className="text-[#86868b] font-normal">· {squad.duration_minutes}分</span>
          </span>
          <span className="flex items-center gap-1.5 text-[#6e6e73]">
            <MapPin className="w-3.5 h-3.5 text-[#86868b]" />
            {squad.city} {squad.district}
          </span>
        </div>

        {/* Row 4: 程度 + 價錢 + 庫存 */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#e8e8ed]">
          <div className="flex items-center gap-2 flex-wrap">
            <SkillBadge level={squad.skill_level} />
            {isFree ? (
              <span className="text-[14px] font-semibold text-[#00873e]">免費</span>
            ) : (
              <span className="text-[14px] font-semibold text-[#0071e3]">${squad.price_per_person}</span>
            )}
            <span className="text-[11px] text-[#86868b]">·</span>
            <span className="text-[12px] text-[#86868b]">{squad.organizer?.full_name || '未知'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[12px] text-[#6e6e73]">
            <Users className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1.5">
              <div className="w-12 h-1.5 bg-[#e8e8ed] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    slotsRatio >= 1 ? 'bg-[#ff3b30]' : slotsRatio >= 0.7 ? 'bg-[#ff9500]' : 'bg-[#00873e]'
                  }`}
                  style={{ width: `${Math.min(100, slotsRatio * 100)}%` }}
                />
              </div>
              <span className="font-medium text-[#1d1d1f]">
                {squad.participant_count}/{squad.max_participants}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

function SkillBadge({ level }: { level: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    all: { bg: 'bg-[#f5f5f7]', text: 'text-[#6e6e73]', label: '👥 不限' },
    beginner: { bg: 'bg-[#00873e]/10', text: 'text-[#00873e]', label: '🌱 初學' },
    intermediate: { bg: 'bg-[#0071e3]/10', text: 'text-[#0071e3]', label: '⭐ 中級' },
    advanced: { bg: 'bg-[#ff3b30]/10', text: 'text-[#ff3b30]', label: '🔥 高級' },
  }
  const m = map[level] || map.all
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${m.bg} ${m.text}`}>
      {m.label}
    </span>
  )
}

// ============================================================
// 詳情 Modal - Apple 風格
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
  const slotsRatio = squad.participant_count / squad.max_participants
  const endTime = new Date(date.getTime() + squad.duration_minutes * 60000)

  const sameLocation = relatedSquads.filter(s => s.city === squad.city && s.district === squad.district)
  const sameSport = relatedSquads.filter(s => s.sport === squad.sport && s.id !== squad.id).slice(0, 3)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-md p-0 md:p-6"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-3xl max-h-[92vh] bg-white md:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-6 md:p-8 border-b border-[#e8e8ed]">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{SPORT_ICONS[squad.sport as SportType] || '🏅'}</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[24px] md:text-[28px] font-semibold tracking-tight text-[#1d1d1f] leading-tight">
                {squad.title}
              </h2>
              <p className="text-[14px] text-[#6e6e73] mt-1">
                {SPORT_LABELS[squad.sport as SportType].replace(/^[^\s]+\s/, '')} · 主辦 {squad.organizer?.full_name || '未知'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#86868b] hover:text-[#1d1d1f] p-1"
              aria-label="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - scrollable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* 主要資訊 grid - Apple 風格淺灰卡片 */}
          <div className="grid grid-cols-2 gap-3">
            <InfoBlock icon="📅" label="日期">
              {format(date, 'M月dd日 (EEE)', { locale: zhTW })}
            </InfoBlock>
            <InfoBlock icon="⏰" label="時間">
              {format(date, 'HH:mm')} - {format(endTime, 'HH:mm')}
            </InfoBlock>
            <InfoBlock icon="📍" label="地點">
              {squad.city} {squad.district}
            </InfoBlock>
            <InfoBlock icon="💪" label="程度">
              {SKILL_LABELS[squad.skill_level as keyof typeof SKILL_LABELS] || squad.skill_level}
            </InfoBlock>
          </div>

          {/* 場地詳情 */}
          <div className="bg-[#f5f5f7] rounded-xl p-4">
            <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0071e3]" />
              場地資訊
            </h3>
            <p className="text-[14px] text-[#1d1d1f]">{squad.location_detail}</p>
            {squad.equipment && (
              <p className="text-[13px] text-[#6e6e73] mt-2">
                <span className="text-[#0071e3] font-medium">器材:</span> {squad.equipment}
              </p>
            )}
          </div>

          {/* 描述 */}
          {squad.description && (
            <div>
              <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-2">揪團說明</h3>
              <p className="text-[14px] text-[#1d1d1f] leading-relaxed whitespace-pre-line">{squad.description}</p>
            </div>
          )}

          {/* 注意事項 */}
          {squad.notes && (
            <div className="bg-[#fff8e1] border border-[#ff9500]/20 rounded-xl p-4">
              <h3 className="text-[15px] font-semibold text-[#ff9500] mb-1.5">⚠️ 注意事項</h3>
              <p className="text-[14px] text-[#1d1d1f] leading-relaxed">{squad.notes}</p>
            </div>
          )}

          {/* 參加者 + 報名狀態 */}
          <div className="flex items-center justify-between bg-[#f5f5f7] rounded-xl p-4">
            <div>
              <p className="text-[12px] text-[#6e6e73] mb-1">目前參加人數</p>
              <p className="text-[22px] font-semibold text-[#1d1d1f]">
                {squad.participant_count}
                <span className="text-[15px] text-[#86868b] font-normal"> / {squad.max_participants}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-[#6e6e73] mb-1">費用</p>
              <p className={`text-[22px] font-semibold ${isFree ? 'text-[#00873e]' : 'text-[#0071e3]'}`}>
                {isFree ? '免費' : `$${squad.price_per_person}`}
              </p>
            </div>
          </div>

          {/* 交叉推廣 */}
          {(sameLocation.length > 0 || sameSport.length > 0) && (
            <div>
              <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-3 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0071e3]" />
                你可能也會喜歡
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
        <div className="p-5 md:p-6 border-t border-[#e8e8ed] bg-white flex items-center gap-3">
          <Link
            href={`/squads/${squad.id}`}
            className="flex-1 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#0071e3] py-3 rounded-full text-[15px] font-normal text-center transition-colors"
          >
            查看完整頁
          </Link>
          <button
            disabled={isFull}
            className="flex-[2] bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#006edb] disabled:bg-[#d2d2d7] disabled:text-[#86868b] text-white py-3 rounded-full text-[15px] font-normal transition-colors disabled:cursor-not-allowed"
          >
            {isFull ? '已額滿' : isFree ? '免費報名' : `$${squad.price_per_person} 報名`}
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoBlock({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#f5f5f7] rounded-xl p-3.5">
      <p className="text-[11px] text-[#6e6e73] mb-1 flex items-center gap-1 uppercase tracking-wider">
        <span>{icon}</span>
        {label}
      </p>
      <p className="text-[14px] font-semibold text-[#1d1d1f]">{children}</p>
    </div>
  )
}

function RelatedCard({ squad, reason }: { squad: SquadCard; reason: string }) {
  const date = new Date(squad.scheduled_at)
  return (
    <div className="bg-white border border-[#e8e8ed] hover:border-[#0071e3] rounded-xl p-3 cursor-pointer transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] bg-[#f5f5f7] text-[#6e6e73] px-2 py-0.5 rounded-full">
          {reason}
        </span>
        <span className="text-[10px] text-[#86868b]">
          {format(date, 'M/dd HH:mm')}
        </span>
      </div>
      <h4 className="text-[14px] font-semibold text-[#1d1d1f] line-clamp-1 mb-0.5">{squad.title}</h4>
      <p className="text-[12px] text-[#6e6e73] flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        {squad.city} {squad.district} · {squad.participant_count}/{squad.max_participants}
      </p>
    </div>
  )
}
