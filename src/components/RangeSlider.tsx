'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * PlayOne-style 雙滑桿 (Dual Range Slider)
 * 參考: https://www.playone.tw/ 的階級 Slider
 * 用法: <RangeSlider min={1} max={7} value={[1,7]} onChange={...} />
 */

interface RangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (val: [number, number]) => void
  className?: string
  /** 顯示在 min/max 旁的標籤(陣列長度需 = max-min+1) */
  labels?: string[]
}

export default function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  className = '',
  labels,
}: RangeSliderProps) {
  const [localVal, setLocalVal] = useState<[number, number]>(value)
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<'min' | 'max' | null>(null)

  useEffect(() => {
    setLocalVal(value)
  }, [value[0], value[1]])

  const range = max - min
  const leftPct = ((localVal[0] - min) / range) * 100
  const rightPct = ((localVal[1] - min) / range) * 100

  const updateFromClientX = useCallback(
    (clientX: number) => {
      if (!trackRef.current || !draggingRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const raw = min + ratio * range
      const snapped = Math.round(raw / step) * step
      const clamped = Math.max(min, Math.min(max, snapped))

      if (draggingRef.current === 'min') {
        const newMin = Math.min(clamped, localVal[1] - step)
        setLocalVal([newMin, localVal[1]])
        onChange([newMin, localVal[1]])
      } else {
        const newMax = Math.max(clamped, localVal[0] + step)
        setLocalVal([localVal[0], newMax])
        onChange([localVal[0], newMax])
      }
    },
    [draggingRef, localVal, min, max, step, range, onChange]
  )

  useEffect(() => {
    const onMove = (e: MouseEvent) => updateFromClientX(e.clientX)
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updateFromClientX(e.touches[0].clientX)
    }
    const onUp = () => {
      draggingRef.current = null
    }
    if (draggingRef.current) {
      window.addEventListener('mousemove', onMove)
      window.addEventListener('touchmove', onTouchMove)
      window.addEventListener('mouseup', onUp)
      window.addEventListener('touchend', onUp)
    }
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [updateFromClientX])

  const ticks: (string | null)[] = labels ?? Array.from({ length: max - min + 1 }, (_, i) => String(min + i))

  return (
    <div className={`w-full select-none ${className}`}>
      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-2 bg-white/10 rounded-full cursor-pointer"
        onClick={(e) => {
          if (!trackRef.current) return
          const rect = trackRef.current.getBoundingClientRect()
          const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
          const raw = min + ratio * range
          const snapped = Math.round(raw / step) * step
          // 點擊軌道:移動最近的 handle
          const distMin = Math.abs(snapped - localVal[0])
          const distMax = Math.abs(snapped - localVal[1])
          if (distMin < distMax) {
            const newMin = Math.min(Math.max(snapped, min), localVal[1] - step)
            setLocalVal([newMin, localVal[1]])
            onChange([newMin, localVal[1]])
          } else {
            const newMax = Math.max(Math.min(snapped, max), localVal[0] + step)
            setLocalVal([localVal[0], newMax])
            onChange([localVal[0], newMax])
          }
        }}
      >
        {/* Selected range */}
        <div
          className="absolute h-full bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full"
          style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
        />

        {/* Min handle */}
        <div
          className="absolute w-5 h-5 -top-1.5 -ml-2.5 bg-white border-2 border-cyan-400 rounded-full cursor-grab shadow-md active:cursor-grabbing hover:scale-110 transition-transform"
          style={{ left: `${leftPct}%` }}
          onMouseDown={(e) => {
            e.stopPropagation()
            draggingRef.current = 'min'
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
            draggingRef.current = 'min'
          }}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={localVal[1]}
          aria-valuenow={localVal[0]}
        />

        {/* Max handle */}
        <div
          className="absolute w-5 h-5 -top-1.5 -ml-2.5 bg-white border-2 border-cyan-400 rounded-full cursor-grab shadow-md active:cursor-grabbing hover:scale-110 transition-transform"
          style={{ left: `${rightPct}%` }}
          onMouseDown={(e) => {
            e.stopPropagation()
            draggingRef.current = 'max'
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
            draggingRef.current = 'max'
          }}
          role="slider"
          aria-valuemin={localVal[0]}
          aria-valuemax={max}
          aria-valuenow={localVal[1]}
        />
      </div>

      {/* Tick labels */}
      <div className="flex justify-between mt-2 px-1">
        {ticks.map((label, i) => {
          if (!label) {
            return <span key={i} className="w-0" />  // 隱藏空白刻度
          }
          const tickVal = min + i
          const isActive = tickVal >= localVal[0] && tickVal <= localVal[1]
          return (
            <span
              key={i}
              className={`text-[9px] sm:text-[10px] transition-colors whitespace-nowrap ${
                isActive ? 'text-cyan-400 font-medium' : 'text-white/40'
              }`}
            >
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
