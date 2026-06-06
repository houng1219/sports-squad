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
  const sizeClasses = size === 'sm' ? 'px-3 py-1 text-[12px]' : 'px-3.5 py-1.5 text-[13px]'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full border transition-all ${sizeClasses} ${
        active
          ? 'bg-[#0071e3] border-[#0071e3] text-white font-medium'
          : 'bg-white border-[#d2d2d7] text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3]'
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
