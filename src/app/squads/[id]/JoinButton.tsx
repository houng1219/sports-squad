'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
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
      // For MVP, use a mock user ID or anonymous
      // In production, this would come from AuthContext
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
      <div className="space-y-2">
        <div className="bg-fuchsia-50 text-fuchsia-600 text-center py-3 rounded-xl text-sm font-medium">
          這是你發起的揪團
        </div>
      </div>
    )
  }

  if (isJoined) {
    return (
      <div className="space-y-2">
        <div className="bg-green-50 text-green-600 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium">
          <Check className="w-4 h-4" />
          已報名參加
        </div>
        <button
          onClick={handleLeave}
          disabled={loading}
          className="w-full text-center border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? '取消中...' : '取消報名'}
        </button>
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      </div>
    )
  }

  if (isFull) {
    return (
      <div className="bg-gray-100 text-gray-500 text-center py-3 rounded-xl text-sm font-medium">
        已額滿
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 disabled:bg-orange-300 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
      >
        {loading ? '報名中...' : '報名參加'}
      </button>
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      <p className="text-xs text-gray-400 text-center">
        免費活動，無需預付
      </p>
    </div>
  )
}