'use client'

import { SORT_OPTIONS, SortOption } from '@/types'

interface SortDropdownProps {
  value: SortOption
  onChange: (sort: SortOption) => void
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
