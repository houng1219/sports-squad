import Link from 'next/link'
import { ArrowRight, MapPin, Clock, Users, TrendingUp, ChevronDown, Shield, Heart, Sparkles, Check, Zap, Star } from 'lucide-react'
import { SPORT_LABELS, type SportType } from '@/lib/types'
import { getAllSquadCards, mockTestimonials } from '@/lib/mock-data'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

const SPORT_LIST: SportType[] = [
  'basketball', 'badminton', 'running', 'football',
  'tennis', 'volleyball', 'swimming', 'cycling',
]

// ============================================================
// Helpers / Sub-components
// ============================================================

function SquadCardHome({ squad }: { squad: ReturnType<typeof getAllSquadCards>[0] }) {
  const sportLabel = SPORT_LABELS[squad.sport]
  const sportEmoji = sportLabel.split(' ')[0]
  const sportText = sportLabel.split(' ')[1]
  const date = new Date(squad.scheduled_at)
  const isFree = squad.price_per_person === 0

  return (
    <Link
      href={`/squads/${squad.id}`}
      className="group block bg-white rounded-3xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-200 overflow-hidden"
    >
      {/* Header with sport color */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{sportEmoji}</span>
          <span className="text-white font-bold">{sportText}</span>
          <span className="text-white/80 text-xs">揪團</span>
        </div>
        <div className="flex items-center gap-1 bg-white/25 rounded-full px-3 py-1">
          <Users className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-sm font-bold">
            {squad.participant_count}/{squad.max_participants}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-base mb-3 group-hover:text-orange-600 transition-colors" style={{ color: 'var(--text)' }}>
          {squad.title}
        </h3>

        <div className="space-y-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 flex-shrink-0 text-orange-400" />
            <span>{format(date, 'M/dd (EEE) HH:mm', { locale: zhTW })}</span>
            <span className="text-gray-300">·</span>
            <span>{squad.duration_minutes}分鐘</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 flex-shrink-0 text-orange-400" />
            <span>{squad.district || squad.city} {squad.location_detail}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px dashed var(--border)' }}>
          <span className={`text-sm font-bold ${isFree ? 'text-green-600' : 'text-orange-600'}`}>
            {isFree ? '✨ 免費' : `${squad.price_per_person}元/人`}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            主辦：{squad.organizer?.full_name || '未知'}
          </span>
        </div>
      </div>
    </Link>
  )
}

function StatCard({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <div className="bg-white rounded-3xl border-2 border-orange-100 p-6 text-center hover:shadow-lg transition-shadow">
      <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Icon className="w-7 h-7 text-orange-500" />
      </div>
      <div className="text-3xl font-black mb-1" style={{ color: 'var(--text)' }}>{value}</div>
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  )
}

const SCENARIO_CARDS = [
  {
    emoji: '🌆',
    title: '剛到新城市、想找人一起動',
    desc: 'AI 根據你的位置、程度與偏好，推薦 3 個最合的揪團',
    cta: '智能推薦',
    href: '/recommend',
    color: 'from-orange-100 to-pink-100',
  },
  {
    emoji: '🏃',
    title: '一個人運動太無聊',
    desc: '12 個縣市、每天 50+ 揪團，找一個剛好在你家附近的',
    cta: '瀏覽揪團',
    href: '/squads',
    color: 'from-yellow-100 to-orange-100',
  },
  {
    emoji: '👥',
    title: '想揪朋友但湊不滿人數',
    desc: '3 分鐘發起揪團，自動曝光給同好，輕鬆補滿',
    cta: '發起揪團',
    href: '/squads/new',
    color: 'from-rose-100 to-orange-100',
  },
  {
    emoji: '🎯',
    title: '想固定時段、固定球友',
    desc: '建立你的「球隊」，每週自動開團、累積評價',
    cta: '建立球隊',
    href: '/squads/new',
    color: 'from-pink-100 to-yellow-100',
  },
]

const TRUST_PILLARS = [
  {
    icon: Shield,
    title: '實名認證 + 評價系統',
    desc: '每位揪團者都有公開評分，過濾掉不守時、放鳥的雷隊友',
  },
  {
    icon: Heart,
    title: '付款代收保障',
    desc: '費用透過平台代收，活動完成才撥款，沒玩到全額退費',
  },
  {
    icon: Sparkles,
    title: '運動意外險',
    desc: '合作運動險，意外有理賠，最高 300 萬保障',
  },
]

const HOW_STEPS = [
  { num: '1', emoji: '📍', title: '選運動 + 地點', desc: '從 8 種運動中選，球場地圖一鍵定位' },
  { num: '2', emoji: '👥', title: '設定人數與費用', desc: '3-20 人皆可，免費或分攤場地費都行' },
  { num: '3', emoji: '🚀', title: '一鍵發布揪團', desc: 'AI 推薦球友，10 秒曝光給同好' },
  { num: '4', emoji: '🎉', title: '揪團上線，開心打球', desc: '有人報名會通知，當天還有行前提醒' },
]

const FAQS = [
  {
    q: '揪團要付費嗎？',
    a: '發起揪團完全免費。如果你的揪團需要分攤場地費或球具費，可以設定「每人收費」，平台代收後活動完成才撥款。免費揪團不收任何手續費。',
  },
  {
    q: '怎麼報名揪團？需要先註冊嗎？',
    a: '可以先用 LINE 或 Google 帳號一鍵註冊，30 秒就能報名。報名後會收到 LINE 通知，活動前一天還會有行前提醒。',
  },
  {
    q: '找不到適合的球類怎麼辦？',
    a: '目前支援 8 種運動：籃球、羽球、路跑、足球、網球、排球、游泳、單車。沒看到的可以到「智能推薦」填寫需求表，AI 會幫你媒合。',
  },
  {
    q: '揪到的球友可以信任嗎？',
    a: '每位用戶都有公開評分、揪團次數、出席率。我們也提供實名認證、緊急聯絡人驗證，過濾掉不守時的雷隊友。',
  },
  {
    q: '如果活動取消，報名費會退嗎？',
    a: '會全額退費。如果是主揪方取消，平台會主動退款給所有報名者；如果是天候因素（如颱風、暴雨），也會在活動前 12 小時主動通知並退款。',
  },
  {
    q: '怎麼發起我的第一個揪團？',
    a: '點「發起揪團」→ 選運動 → 選球場（地圖搜尋）→ 選時間 → 設定人數 → 完成！全程 3 分鐘，沒有任何審核。',
  },
]

// ============================================================
// Page
// ============================================================

export default function HomePage() {
  const squads = getAllSquadCards('u1')

  return (
    <div className="min-h-screen">
      {/* ============================================================
          1. HERO
          ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-200">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl float-slow">🏀</div>
          <div className="absolute top-20 right-20 text-5xl float-slow" style={{ animationDelay: '1s' }}>🏸</div>
          <div className="absolute bottom-20 left-1/4 text-5xl float-slow" style={{ animationDelay: '2s' }}>🏃</div>
          <div className="absolute bottom-10 right-1/3 text-4xl float-slow" style={{ animationDelay: '0.5s' }}>⚽</div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                847 位運動夥伴都在用
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-shadow-warm" style={{ color: 'var(--text)' }}>
              找到對的運動夥伴<br />
              <span className="text-orange-500">一起流的汗最好玩</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: '#5C4030' }}>
              不用再揪不到人、不用再換球場、不用再尬聊陌生人。<br />
              3 分鐘發起揪團，找到對的運動夥伴。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/squads/new"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                🔥 3 分鐘發起揪團
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/squads"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-orange-50 text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-orange-200 transition-all"
              >
                瀏覽附近揪團
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. STATS
          ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 mb-16 relative z-10">
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={Users} value="847" label="運動夥伴" />
          <StatCard icon={MapPin} value="12" label="覆蓋縣市" />
          <StatCard icon={TrendingUp} value="128" label="本月揪團" />
        </div>
      </section>

      {/* ============================================================
          3. SCENARIO ROUTING (毛小愛招牌)
          ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--text)' }}>
            你是哪一種運動咖？<span className="text-orange-500">👇</span>
          </h2>
          <p className="text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
            點選最符合你的情境，我們幫你找到對的服務
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCENARIO_CARDS.map(card => (
            <Link
              key={card.title}
              href={card.href}
              className={`group block bg-gradient-to-br ${card.color} rounded-3xl p-6 border-2 border-white hover:border-orange-300 hover:shadow-xl transition-all`}
            >
              <div className="text-5xl mb-3 bounce-soft">{card.emoji}</div>
              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text)' }}>
                {card.title}
              </h3>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: '#5C4030' }}>
                {card.desc}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-orange-600 group-hover:gap-2 transition-all">
                {card.cta}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          4. SPORTS FILTER
          ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl md:text-3xl font-black" style={{ color: 'var(--text)' }}>
            🏆 探索運動
          </h2>
          <Link href="/squads" className="text-sm font-bold text-orange-500 hover:text-orange-600">
            看全部 →
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {SPORT_LIST.map(sport => {
            const label = SPORT_LABELS[sport]
            const emoji = label.split(' ')[0]
            const text = label.split(' ')[1]
            return (
              <Link
                key={sport}
                href={`/squads?sport=${sport}`}
                className="flex flex-col items-center gap-2 bg-white border-2 border-orange-100 hover:border-orange-300 hover:shadow-lg rounded-3xl px-6 py-4 min-w-[88px] transition-all"
              >
                <span className="text-3xl">{emoji}</span>
                <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{text}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ============================================================
          5. RECENT SQUADS
          ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl md:text-3xl font-black" style={{ color: 'var(--text)' }}>
            🔥 最新揪團
          </h2>
          <Link href="/squads" className="text-sm font-bold text-orange-500 hover:text-orange-600">
            看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {squads.slice(0, 6).map(squad => (
            <SquadCardHome key={squad.id} squad={squad} />
          ))}
        </div>
      </section>

      {/* ============================================================
          6. HOW IT WORKS — 3 分鐘流程
          ============================================================ */}
      <section className="bg-gradient-to-br from-orange-50 to-yellow-50 py-20 mb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-4 shadow-sm">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-500">3 分鐘搞定</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--text)' }}>
              發起揪團，比你想的還簡單
            </h2>
            <p className="text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
              不用學、不用填一堆表單，手機 3 分鐘就完成
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {HOW_STEPS.map((step, idx) => (
              <div key={step.num} className="relative">
                <div className="bg-white rounded-3xl p-6 border-2 border-orange-100 hover:shadow-xl transition-shadow h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md">
                      {step.num}
                    </div>
                    <div className="text-3xl">{step.emoji}</div>
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text)' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                </div>
                {idx < HOW_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-orange-300 z-10">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/squads/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              開始發起揪團
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. TRUST — 為什麼選 SportsSquad
          ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-4 py-2 mb-4">
            <Shield className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-500">三大保障</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--text)' }}>
            為什麼信任 SportsSquad？
          </h2>
          <p className="text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
            我們處理好信任問題，你只要專心打球
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TRUST_PILLARS.map(pillar => (
            <div
              key={pillar.title}
              className="bg-white rounded-3xl p-7 border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-4">
                <pillar.icon className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>{pillar.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          8. TESTIMONIALS — 真實揪團故事
          ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-yellow-50 rounded-full px-4 py-2 mb-4">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-yellow-700">毛爸媽都說讚</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--text)' }}>
            真實揪團故事 🏆
          </h2>
          <p className="text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
            847 位使用者怎麼說
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mockTestimonials.map(t => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 border-2 border-orange-100 hover:shadow-xl transition-shadow relative"
            >
              <div className="absolute -top-3 -right-3 bg-gradient-to-br from-orange-500 to-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {t.highlight}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center text-2xl">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {t.sport_emoji} {t.sport} · {t.city} · {t.squad_count} 場揪團
                  </div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          9. Q&A
          ============================================================ */}
      <section className="max-w-3xl mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--text)' }}>
            常見問題 🙋
          </h2>
          <p className="text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
            沒看到的問題，歡迎 LINE 私訊客服
          </p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white rounded-2xl border-2 border-orange-100 hover:border-orange-300 transition-all"
            >
              <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer font-bold list-none" style={{ color: 'var(--text)' }}>
                <span className="flex items-center gap-2">
                  <span className="text-orange-500 font-black">Q{idx + 1}.</span>
                  {faq.q}
                </span>
                <ChevronDown className="w-5 h-5 text-orange-500 group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ============================================================
          10. SOCIAL IMPACT — 社會影響力
          ============================================================ */}
      <section className="bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50 py-20 mb-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--text)' }}>
              用揪團讓世界動起來 🌏
            </h2>
            <p className="text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
              我們相信運動不只是流汗，更是連結
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="text-4xl mb-3">💪</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>73% 的人想動但沒伴</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                根據統計，超過 7 成的運動愛好者都曾因為「找不到人」而放棄運動。我們用揪團解決這件事。
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>5,000+ 個新友誼</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                透過揪團，已經有 5,000 多位原本不認識的運動愛好者變成朋友。每週穩定揪團的球友，平均會多留 3 個真心的朋友。
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="text-4xl mb-3">🌸</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>女性友善揪團</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                我們有專屬的「女性友善揪團」篩選機制、主揪者身分驗證、活動後雙向評價，讓每位女性球友都能安心運動。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          11. FINAL CTA
          ============================================================ */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-pink-400 rounded-3xl p-10 md:p-14 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-white">
            準備好發起你的第一個揪團了嗎？ 🚀
          </h2>
          <p className="text-white/90 text-base md:text-lg mb-8 max-w-xl mx-auto">
            設定地點、時間、人數，3 分鐘完成發團。<br />
            不用學、不用審核，今天就開始揪！
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/squads/new"
              className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all"
            >
              🔥 免費發起揪團
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/squads"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
            >
              先逛逛揪團
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-white/90 text-sm">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> 免費使用</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> 不用審核</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> 30 秒上手</span>
          </div>
        </div>
      </section>
    </div>
  )
}
