"use client"

import React, { memo } from "react"

interface CustomizationCardProps {
  itemName: string
  whenClicked?: (name: string) => void
  categorySelection: string // current selection passed from parent
}

const CustomizationCard: React.FC<CustomizationCardProps> = memo(
  ({ itemName, whenClicked, categorySelection }) => {
    const isSelected = itemName === categorySelection

    return (
      <div
        onClick={() => whenClicked?.(itemName)}
        className={`h-[100px] w-[100px] flex justify-center items-center shadow-lg p-2 text-center transform transition-transform duration-300 hover:scale-110 cursor-pointer rounded-md
          ${isSelected ? "bg-green-800 text-white" : "bg-gray-200 text-black"}
        `}
      >
        <p className="whitespace-normal break-words text-xl font-medium">
          {itemName}
        </p>
      </div>
    )
  }
)

export default CustomizationCard
