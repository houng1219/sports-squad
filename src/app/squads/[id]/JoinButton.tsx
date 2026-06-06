'use client'

import { useState } from 'react'
import { Check, X, UserPlus, LogOut } from 'lucide-react'
import { joinSquad, leaveSquad } from '@/lib/api'

export default function JoinButton({
  squadId,
  isFull,
  isOrganizer,
  userparticipationStatus,
}: {
  squadId: string
  isFull: boolean
  isOrganizer: boolean
  userparticipationStatus?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isJoined = userparticipationStatus === 'confirmed'

  async function handleJoin() {
    setLoading(true)
    setError(null)
    try {
      await joinSquad(squadId, 'demo-user-id')
      window.location.reload()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '報名失敗')
      setLoading(false)
    }
  }

  async function handleLeave() {
    setLoading(true)
    setError(null)
    try {
      await leaveSquad(squadId, 'demo-user-id')
      window.location.reload()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '取消失敗')
      setLoading(false)
    }
  }

  if (isOrganizer) {
    return (
      <div className="bg-[#0071e3]/10 border border-[#0071e3]/30 text-[#0071e3] text-center py-3 rounded-xl text-sm font-medium">
        這是你發起的揪團
      </div>
    )
  }

  if (isJoined) {
    return (
      <div className="space-y-2">
        <div className="bg-[#00873e]/10 border border-emerald-500/30 text-[#00873e] flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold">
          <Check className="w-4 h-4" />
          已報名參加
        </div>
        <button
          onClick={handleLeave}
          disabled={loading}
          className="w-full text-center border border-rose-500/30 text-[#ff3b30] hover:bg-rose-500/10 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          <span className="inline-flex items-center gap-1.5">
            <LogOut className="w-3.5 h-3.5" />
            {loading ? '取消中...' : '取消報名'}
          </span>
        </button>
        {error && <p className="text-[#ff3b30] text-xs text-center">{error}</p>}
      </div>
    )
  }

  if (isFull) {
    return (
      <div className="bg-[#f5f5f7] border border-[#d2d2d7]/60 text-[#6e6e73] text-center py-3 rounded-xl text-sm font-medium">
        已額滿
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full bg-[#0071e3] hover:from-cyan-400 hover:to-sky-400 disabled:opacity-50 text-[#1d1d1f] py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm"
      >
        <span className="inline-flex items-center gap-1.5">
          <UserPlus className="w-4 h-4" />
          {loading ? '報名中...' : '立即報名'}
        </span>
      </button>
      {error && <p className="text-[#ff3b30] text-xs text-center">{error}</p>}
    </div>
  )
}
