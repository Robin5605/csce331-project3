"use client";

import { useState } from "react";
import TopNav from "@/components/TopNav";
import { CupSoda } from "lucide-react";

interface MenuItem {
    id: number;
    name: string;
    stock: number;
    cost: number;
    image_url: string;
}

interface MenuData {
    [categoryName: string]: MenuItem[];
}

const menuData: MenuData = {
    "Fruit Tea": [
        {
            id: 1,
            name: "Mango Green Tea",
            stock: 80,
            cost: 6.5,
            image_url: "/drinks/mango_green_tea.png",
        },
        {
            id: 2,
            name: "Peach Tea With Honey Jelly",
            stock: 75,
            cost: 6.25,
            image_url: "/drinks/peach_tea_with_honey_jelly.png",
        },
        {
            id: 3,
            name: "Passion Chess",
            stock: 75,
            cost: 6.25,
            image_url: "/drinks/passion_chess.png",
        },
        {
            id: 5,
            name: "Mango & Passion Fruit",
            stock: 75,
            cost: 6.25,
            image_url: "/drinks/mango_passion_fruit.png",
        },
        {
            id: 6,
            name: "Honey Lemonade",
            stock: 75,
            cost: 5.2,
            image_url: "/drinks/honey_lemonade.png",
        },
        {
            id: 4,
            name: "Berry Lychee Burst",
            stock: 74,
            cost: 6.25,
            image_url: "/drinks/berry_lychee_burst.png",
        },
    ],

    "Ice Blended": [
        {
            id: 7,
            name: "Oreo w/ Pearl",
            stock: 75,
            cost: 6.75,
            image_url: "/drinks/oreo_w_pearl.png",
        },
        {
            id: 8,
            name: "Taro w/ Pudding",
            stock: 75,
            cost: 6.95,
            image_url: "/drinks/taro_w_pudding.png",
        },
        {
            id: 9,
            name: "Thai Tea w/ Pearl",
            stock: 75,
            cost: 6.95,
            image_url: "/drinks/thai_tea_w_pearl.png",
        },
        {
            id: 10,
            name: "Coffee w/ Ice Cream",
            stock: 75,
            cost: 6.95,
            image_url: "/drinks/coffee_w_ice_cream.png",
        },
        {
            id: 11,
            name: "Mango w/ Ice Cream",
            stock: 75,
            cost: 6.95,
            image_url: "/drinks/mango_w_ice_cream.png",
        },
        {
            id: 12,
            name: "Strawberry w/ Ice Cream",
            stock: 75,
            cost: 6.95,
            image_url: "/drinks/strawberry_w_ice_cream.png",
        },
    ],

    Milky: [
        {
            id: 13,
            name: "Clasic Pearl Milk Tea",
            stock: 75,
            cost: 5.8,
            image_url: "/drinks/classic_pearl_milk_tea.png",
        },
        {
            id: 14,
            name: "Honey Pearl Milk Tea",
            stock: 75,
            cost: 6.0,
            image_url: "/drinks/honey_pearl_milk_tea.png",
        },
        {
            id: 15,
            name: "Coffe Creama",
            stock: 75,
            cost: 6.5,
            image_url: "/drinks/coffe_creama.png",
        },
        {
            id: 16,
            name: "Hokaido Pearl Milk Tea",
            stock: 75,
            cost: 6.25,
            image_url: "/drinks/hokaido_pearl_milk_tea.png",
        },
        {
            id: 17,
            name: "Mango Green Milk Tea",
            stock: 75,
            cost: 6.5,
            image_url: "/drinks/mango_green_milk_tea.png",
        },
        {
            id: 18,
            name: "Golden Retriever",
            stock: 75,
            cost: 6.75,
            image_url: "/drinks/golden_retriever.png",
        },
    ],

    "Non Caffenated": [
        {
            id: 19,
            name: "Tiger Boba",
            stock: 75,
            cost: 6.5,
            image_url: "/drinks/tiger_boba.png",
        },
        {
            id: 20,
            name: "Strawberry Coconut",
            stock: 75,
            cost: 6.5,
            image_url: "/drinks/strawberry_coconut.png",
        },
        {
            id: 21,
            name: "Strawberry Coconut Ice Blended",
            stock: 75,
            cost: 6.5,
            image_url: "/drinks/strawberry_coconut_ice_blended.png",
        },
        {
            id: 22,
            name: "Halo Halo",
            stock: 75,
            cost: 6.95,
            image_url: "/drinks/halo_halo.png",
        },
        {
            id: 23,
            name: "Wintermellon Lemonade",
            stock: 75,
            cost: 5.8,
            image_url: "/drinks/wintermellon_lemonade.png",
        },
        {
            id: 24,
            name: "Wintermellon w/ Fresh Milk",
            stock: 75,
            cost: 5.2,
            image_url: "/drinks/wintermellon_w_fresh_milk.png",
        },
    ],

    "Fall Seasonals": [
        {
            id: 25,
            name: "Red Bean Matcha",
            stock: 75,
            cost: 6.95,
            image_url: "/drinks/red_bean_matcha.png",
        },
        {
            id: 26,
            name: "Pumpkin Chai",
            stock: 75,
            cost: 6.95,
            image_url: "/drinks/pumpkin_chai.png",
        },
        {
            id: 27,
            name: "Honey and Cinnamon Milk Tea",
            stock: 75,
            cost: 6.95,
            image_url: "/drinks/honey_and_cinnamon_milk_tea.png",
        },
        { id: 31, name: "temp", stock: 99, cost: 5.0, image_url: "" },
        { id: 32, name: "temp2", stock: 99, cost: 1.0, image_url: "" },
    ],

    Uncategorized: [
        { id: 33, name: "New Item", stock: 0, cost: 0, image_url: "" },
        { id: 34, name: "New Item", stock: 0, cost: 0, image_url: "" },
        { id: 35, name: "New Item", stock: 0, cost: 0, image_url: "" },
    ],
};

const CATEGORY_ORDER = [
    "Fruit Tea",
    "Ice Blended",
    "Milky",
    "Non Caffenated",
    "Fall Seasonals",
    "Uncategorized",
] as const;

function CategoryPills({
    categories,
    selected,
    onSelect,
}: {
    categories: string[];
    selected: string;
    onSelect: (c: string) => void;
}) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 px-1">
            {categories.map((c) => (
                <button
                    key={c}
                    onClick={() => onSelect(c)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold border
            transition-all
            ${
                selected === c
                    ? "bg-[#9d8189] text-white border-transparent shadow-md"
                    : "bg-white/70 text-[#4d4a55] border-[#e5c2cf] hover:bg-[#ffe5f1]"
            }`}
                >
                    {c}
                </button>
            ))}
        </div>
    );
}

function DrinkCard({ item }: { item: MenuItem }) {
    const hasImage = item.image_url && item.image_url.trim() !== "";

    return (
        <div className="group rounded-2xl bg-white/80 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col overflow-hidden border border-[#f1c4d8]">
            <div className="relative w-full aspect-[4/3] bg-[#ffe5f1] flex items-center justify-center">
                {hasImage ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <CupSoda className="w-16 h-16 text-[#c48ca4]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end text-black drop-shadow">
                    <p className="font-semibold text-lg">{item.name}</p>
                    <p className="font-bold text-xl">${item.cost.toFixed(2)}</p>
                </div>
            </div>
            <div className="px-4 py-3 flex items-center justify-between text-sm text-[#6d6875]">
                <span>Signature Drink</span>
                {/* you can later use stock to show "Sold Out" etc */}
            </div>
        </div>
    );
}

export default function MenuBoardPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>(
        CATEGORY_ORDER[0],
    );

    const categories = CATEGORY_ORDER.filter((c) => menuData[c]);

    const drinksToShow = menuData[selectedCategory] ?? [];

    return (
        <div className="min-h-screen bg-[#ffddd233] dark:bg-black font-sans flex flex-col">
            {/* Top nav – similar vibe to cashier/kiosk */}
            <TopNav subtitle="Menu Board" />

            <main className="flex-1 px-6 py-4 flex flex-col">
                <div className="mx-auto w-full max-w-6xl flex flex-col gap-4">
                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#6d6875]">
                                Our Drinks
                            </h1>
                            <p className="text-sm sm:text-base text-[#7f7a86] mt-1">
                                Full Menu
                            </p>
                        </div>
                    </div>

                    {/* Category pills */}
                    <div className="mt-2">
                        <CategoryPills
                            categories={categories}
                            selected={selectedCategory}
                            onSelect={setSelectedCategory}
                        />
                    </div>

                    {/* Category label */}
                    <div className="flex items-center justify-between mt-4">
                        <h2 className="text-2xl font-bold text-[#6d6875]">
                            {selectedCategory}
                        </h2>
                        <div className="h-px flex-1 mx-4 bg-gradient-to-r from-[#f4acb7] to-transparent" />
                    </div>

                    {/* Drinks grid */}
                    <div className="mt-4 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {drinksToShow.map((item) => (
                            <DrinkCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
