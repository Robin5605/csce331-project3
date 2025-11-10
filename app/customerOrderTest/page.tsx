"use client";
import React, { useEffect, useMemo, useState } from "react";

import { MenuItem, Order, DrinkIngredient, DrinkOrder } from "@/lib/models";

const addItemButton: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className = "", ...props }) => (
    <button
        className={`px-3 py-2 text-sm rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 active:scale-[.99] ${className}`}
        {...props}
    >
        {children}
    </button>
);

const menuItemIDArea: React.FC<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ children, className = "", ...props }) => (
    <textarea
        className={`px-3 py-2 text-sm rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 active:scale-[.99] ${className}`}
        {...props}
    >
        {children}
    </textarea>
);

export default function customerOrderTest() {
    const addMItem = async () => {
        try {
        } catch (e: any) {}
    };

    return (
        <div className="min-h-screen bg-neutral-100 text-gray-900">
            <div>
                <textarea id="menuItemIDTA"></textarea>
                <addItemButton onClick={addMItem}>
                    add menuitem to order
                </addItemButton>
            </div>
            <div></div>
        </div>
    );
}
