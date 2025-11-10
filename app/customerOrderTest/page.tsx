"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MenuItem, Order, DrinkIngredient, DrinkOrder } from "@/lib/models";

const AddItemButton: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className = "", ...props }) => (
    <button
        className={`px-3 py-2 text-sm rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 active:scale-[.99] ${className}`}
        {...props}
    >
        {children}
    </button>
);

const MenuItemIDArea: React.FC<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ children, className = "", ...props }) => (
    <textarea
        className={`px-3 py-2 text-sm rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 active:scale-[.99] ${className}`}
        {...props}
    >
        {children}
    </textarea>
);

export default function CustomerOrderTest() {
    const addMItem = async () => {
        try {
            console.log("Adding menu item...");
            // your logic here
        } catch (e: any) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 text-gray-900">
            <div className="flex flex-col gap-3 p-4">
                <MenuItemIDArea
                    id="menuItemIDTA"
                    placeholder="Enter Menu Item ID..."
                />
                <AddItemButton onClick={addMItem}>
                    Add menu item to order
                </AddItemButton>
            </div>
        </div>
    );
}
