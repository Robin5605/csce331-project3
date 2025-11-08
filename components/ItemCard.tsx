"use client"

import React, { memo } from "react"

interface ItemCardProps {
  itemName: string
  whenClicked?: () => void // optional callback prop
}

const ItemCard: React.FC<ItemCardProps> = memo(({ itemName, whenClicked }) => {
  return (
    <div
      onClick={whenClicked}
      className="h-[200px] w-[200px] bg-gradient-to-b from-[#fdf6f1] to-[#fde9ddec] flex justify-center items-center shadow-lg p-2 text-center transform transition-transform duration-300 hover:scale-110 cursor-pointer"
    >
      <p className="whitespace-normal break-words text-2xl">{itemName}</p>
    </div>
  )
})

export default ItemCard
