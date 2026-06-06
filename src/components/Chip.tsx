'use client'

import { useState } from 'react'

/**
 * PlayOne-style Chip 標籤組件
 * - 單選: variant="single"
 * - 多選: variant="multi"
 * - 預設外觀是圓角小藥丸,符合 PlayOne 「冷氣/好停車/盥洗」chip 風格
 */

interface ChipProps {
  label: string
  emoji?: string
  active?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export function Chip({ label, emoji, active = false, onClick, size = 'md' }: ChipProps) {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full border transition-all ${sizeClasses} ${
        active
          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-medium'
          : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:text-white/90'
      }`}
    >
      {emoji && <span>{emoji}</span>}
      <span>{label}</span>
    </button>
  )
}

interface ChipGroupProps {
  options: { value: string; label: string; emoji?: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
  multi?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function ChipGroup({ options, selected, onChange, multi = true, size = 'md', className = '' }: ChipGroupProps) {
  function toggle(value: string) {
    if (multi) {
      onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value])
    } else {
      onChange([value])
    }
  }
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map(opt => (
        <Chip
          key={opt.value}
          label={opt.label}
          emoji={opt.emoji}
          active={selected.includes(opt.value)}
          onClick={() => toggle(opt.value)}
          size={size}
        />
      ))}
    </div>
  )
}
