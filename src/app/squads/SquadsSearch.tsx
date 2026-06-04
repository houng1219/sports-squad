'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MapPin, Layers, Users, ArrowRight, ArrowLeft, Check, Search } from 'lucide-react'
import { SPORT_LABELS, SKILL_LABELS, TAIWAN_CITIES, CITY_DISTRICTS, type SportType } from '@/lib/types'
import type { SquadCard } from '@/lib/types'
import Link from 'next/link'

interface SquadsSearchProps {
  currentStep: number
  selectedCity?: string
  selectedDistrict?: string
  selectedSport?: string
  availableCities: readonly string[]
  availableDistricts: string[]
  squads: SquadCard[]
}

const STEP_LABELS = ['選擇縣市', '選擇區域', '選擇球類', '揪團列表']

export default function SquadsSearch({
  currentStep,
  selectedCity,
  selectedDistrict,
  selectedSport,
  availableCities,
  availableDistricts,
  squads,
}: SquadsSearchProps) {
  const router = useRouter()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const steps = [
    { num: 1, label: '縣市', icon: '📍', key: 'city', options: availableCities },
    {
      num: 2,
      label: '區域',
      icon: '🏘️',
      key: 'district',
      options: selectedCity ? (CITY_DISTRICTS[selectedCity] || []) : [],
      requires: selectedCity,
    },
    {
      num: 3,
      label: '球類',
      icon: '🏀',
      key: 'sport',
      options: Object.entries(SPORT_LABELS).map(([k, v]) => {
        const [emoji, ...rest] = v.split(' ')
        return { value: k, emoji, label: rest.join(' ') }
      }),
      requires: selectedDistrict,
    },
    {
      num: 4,
      label: '揪團',
      icon: '👥',
      key: 'results',
      requires: selectedSport,
    },
  ]

  const currentStepData = steps.find(s => s.num === currentStep)!

  function selectOption(option: string, label: string) {
    if (currentStep === 4) return // No more selection after step 4

    const params = new URLSearchParams()
    if (selectedCity) params.set('city', selectedCity)
    if (selectedDistrict) params.set('district', selectedDistrict)
    if (selectedSport) params.set('sport', selectedSport)

    params.set('step', String(currentStep + 1))
    params.set(currentStepData.key, option)

    router.push(`/squads?${params.toString()}`)
  }

  function goBack() {
    if (currentStep <= 1) {
      router.push('/squads')
      return
    }

    const params = new URLSearchParams()
    if (selectedCity && currentStep > 1) params.set('city', selectedCity)
    if (selectedDistrict && currentStep > 2) params.set('district', selectedDistrict)
    params.set('step', String(currentStep - 1))

    router.push(`/squads?${params.toString()}`)
  }

  const sports = Object.entries(SPORT_LABELS) as [SportType, string][]

  // Show step progress bar
  return (
    <div className="min-h-screen">
      {/* Step Progress */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={goBack}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-fuchsia-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回
            </button>
            <h1 className="text-lg font-bold text-gray-900">找揪團</h1>
            <div className="w-16" />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center gap-0 flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
                    currentStep > step.num
                      ? 'bg-fuchsia-500 text-white'
                      : currentStep === step.num
                      ? 'bg-fuchsia-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {currentStep > step.num ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <span
                  className={`text-xs ml-1 hidden sm:block ${
                    currentStep >= step.num ? 'text-fuchsia-600 font-medium' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded ${
                      currentStep > step.num ? 'bg-fuchsia-400' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Current step title */}
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-500">
              {currentStep === 1 && '請先選擇所在縣市'}
              {currentStep === 2 && `你選擇了 ${selectedCity}，再選區域`}
              {currentStep === 3 && `${selectedCity} ${selectedDistrict}，選球類`}
              {currentStep === 4 && `找到了 ${squads.length} 個揪團`}
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Step 1: Select City */}
        {currentStep === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">選擇你所在的縣市</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableCities.map(city => (
                <button
                  key={city}
                  onClick={() => selectOption(city, city)}
                  onMouseEnter={() => setHoveredItem(city)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
                    selectedCity === city
                      ? 'border-fuchsia-500 bg-fuchsia-50'
                      : hoveredItem === city
                      ? 'border-fuchsia-200 bg-fuchsia-50/50'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <MapPin className={`w-6 h-6 ${selectedCity === city ? 'text-fuchsia-500' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${selectedCity === city ? 'text-fuchsia-600' : 'text-gray-700'}`}>
                    {city}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select District */}
        {currentStep === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">
              {selectedCity} — 選擇篩選的區域
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableDistricts.map(district => (
                <button
                  key={district}
                  onClick={() => selectOption(district, district)}
                  onMouseEnter={() => setHoveredItem(district)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    selectedDistrict === district
                      ? 'border-fuchsia-500 bg-fuchsia-50'
                      : hoveredItem === district
                      ? 'border-fuchsia-200 bg-fuchsia-50/50'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <span className="text-2xl">🏘️</span>
                  <span className={`text-xs font-medium ${selectedDistrict === district ? 'text-fuchsia-600' : 'text-gray-700'}`}>
                    {district}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Sport */}
        {currentStep === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">
              {selectedCity} {selectedDistrict} — 選擇想打的球類
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sports.map(([value, label]) => {
                const [emoji, ...rest] = label.split(' ')
                const text = rest.join(' ')
                return (
                  <button
                    key={value}
                    onClick={() => selectOption(value, text)}
                    onMouseEnter={() => setHoveredItem(value)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                      selectedSport === value
                        ? 'border-fuchsia-500 bg-fuchsia-50'
                        : hoveredItem === value
                        ? 'border-fuchsia-200 bg-fuchsia-50/50'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <span className="text-3xl">{emoji}</span>
                    <span className={`font-semibold ${selectedSport === value ? 'text-fuchsia-600' : 'text-gray-800'}`}>
                      {text}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4: Show Results */}
        {currentStep === 4 && (
          <div className="space-y-4">
            {/* Selected filters summary */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="bg-fuchsia-100 text-fuchsia-700 px-3 py-1 rounded-full font-medium">{selectedCity}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="bg-fuchsia-100 text-fuchsia-700 px-3 py-1 rounded-full font-medium">{selectedDistrict}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="bg-fuchsia-100 text-fuchsia-700 px-3 py-1 rounded-full font-medium">
                {SPORT_LABELS[selectedSport as SportType]}
              </span>
              <span className="ml-auto text-sm text-gray-500">共 {squads.length} 個揪團</span>
            </div>

            {/* Re-select steps */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const p = new URLSearchParams()
                  p.set('step', '1')
                  router.push('/squads?' + p.toString())
                }}
                className="text-xs text-gray-500 hover:text-fuchsia-500 underline"
              >
                重新選擇
              </button>
            </div>

            {/* Squad List */}
            {squads.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium mb-2">目前沒有揪團</p>
                <p className="text-gray-400 text-sm mb-4">
                  {selectedCity} {selectedDistrict} {SPORT_LABELS[selectedSport as SportType]} 還沒有人發起
                </p>
                <Link
                  href="/squads/new"
                  className="inline-flex items-center gap-1.5 bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  成為第一個發起的人
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {squads.map(squad => {
                  const sportLabel = SPORT_LABELS[squad.sport as SportType]
                  const [emoji, ...rest] = sportLabel.split(' ')
                  const sportText = rest.join(' ')
                  const date = new Date(squad.scheduled_at)
                  const isFull = squad.participant_count >= squad.max_participants

                  return (
                    <Link
                      key={squad.id}
                      href={`/squads/${squad.id}`}
                      className="block bg-white rounded-2xl border border-gray-100 hover:border-fuchsia-200 hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="flex">
                        {/* Left color bar */}
                        <div className="w-1 bg-gradient-to-b from-orange-400 to-orange-500 flex-shrink-0" />

                        {/* Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{emoji}</span>
                              <span className="text-sm font-semibold text-gray-600">{sportText}</span>
                              {isFull && (
                                <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">已額滿</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-400">
                              {squad.participant_count}/{squad.max_participants}人
                            </span>
                          </div>

                          <h3 className="font-semibold text-gray-900 mb-2">{squad.title}</h3>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              📅 {date.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', weekday: 'short' })} {date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="flex items-center gap-1">
                              📍 {squad.location_detail}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                            <span className={`text-sm font-semibold ${squad.price_per_person === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                              {squad.price_per_person === 0 ? '免費' : `${squad.price_per_person}元`}
                            </span>
                            <span className="text-xs text-gray-400">
                              主辦：{squad.organizer?.full_name || '未知'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}