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
      <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-center py-3 rounded-xl text-sm font-medium">
        這是你發起的揪團
      </div>
    )
  }

  if (isJoined) {
    return (
      <div className="space-y-2">
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold">
          <Check className="w-4 h-4" />
          已報名參加
        </div>
        <button
          onClick={handleLeave}
          disabled={loading}
          className="w-full text-center border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          <span className="inline-flex items-center gap-1.5">
            <LogOut className="w-3.5 h-3.5" />
            {loading ? '取消中...' : '取消報名'}
          </span>
        </button>
        {error && <p className="text-rose-400 text-xs text-center">{error}</p>}
      </div>
    )
  }

  if (isFull) {
    return (
      <div className="bg-white/5 border border-white/10 text-white/50 text-center py-3 rounded-xl text-sm font-medium">
        已額滿
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 disabled:opacity-50 text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20"
      >
        <span className="inline-flex items-center gap-1.5">
          <UserPlus className="w-4 h-4" />
          {loading ? '報名中...' : '立即報名'}
        </span>
      </button>
      {error && <p className="text-rose-400 text-xs text-center">{error}</p>}
    </div>
  )
}
