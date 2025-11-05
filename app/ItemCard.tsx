import React, { memo } from 'react';

interface ItemCardProps {
  itemName: string;
}

const ItemCard: React.FC<ItemCardProps> = memo(({ itemName }) => {
  return (
    <div className="h-[150px] w-[150px] bg-gray-200 flex justify-center items-center shadow-lg p-2 text-center">
      <p className="whitespace-normal wrap-break-words">{itemName}</p>
    </div>
  );
});

export default ItemCard;
