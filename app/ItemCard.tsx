import React, { memo } from 'react';

interface ItemCardProps {
  itemName: string;
}

const ItemCard: React.FC<ItemCardProps> = memo(({ itemName }) => {
  return (
    <div className="h-[200px] w-[200px] bg-gray-200 flex justify-center items-center shadow-lg p-2 text-center transform transition-transform duration-300 hover:scale-110">
        <p className="whitespace-normal break-words text-2xl">{itemName}</p>
    </div>
  );
});

export default ItemCard;
