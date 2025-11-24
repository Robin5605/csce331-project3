"use client";

import { ReactNode, useState, JSX, useMemo } from "react";
import Image from "next/image";
import IdleLogout from "@/components/idleLogout";

import ItemCard from "../../components/ItemCard";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CustomizationCard from "@/components/CustomizationCard";
import { CupSoda, Minus, Plus } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//[REMOVE WHEN API IS IMPLEMENTED] Temporary data for now
interface MenuItem {
    id: number;
    name: string;
    stock: number;
    cost: number;
}

interface MenuData {
    [categoryName: string]: MenuItem[];
}

const menuData: MenuData = {
    "Fruit Tea": [
        { id: 1, name: "Mango Green Tea", stock: 80, cost: 6.5 },
        { id: 2, name: "Peach Tea With Honey Jelly", stock: 75, cost: 6.25 },
        { id: 3, name: "Passion Chess", stock: 75, cost: 6.25 },
        { id: 5, name: "Mango & Passion Fruit", stock: 75, cost: 6.25 },
        { id: 6, name: "Honey Lemonade", stock: 75, cost: 5.2 },
        { id: 4, name: "Berry Lychee Burst", stock: 74, cost: 6.25 },
    ],
    "Ice Blended": [
        { id: 7, name: "Oreo w/ Pearl", stock: 75, cost: 6.75 },
        { id: 8, name: "Taro w/ Pudding", stock: 75, cost: 6.95 },
        { id: 9, name: "Thai Tea w/ Pearl", stock: 75, cost: 6.95 },
        { id: 10, name: "Coffee w/ Ice Cream", stock: 75, cost: 6.95 },
        { id: 11, name: "Mango w/ Ice Cream", stock: 75, cost: 6.95 },
        { id: 12, name: "Strawberry w/ Ice Cream", stock: 75, cost: 6.95 },
    ],
    Milky: [
        { id: 13, name: "Clasic Pearl Milk Tea", stock: 75, cost: 5.8 },
        { id: 14, name: "Honey Pearl Milk Tea", stock: 75, cost: 6.0 },
        { id: 15, name: "Coffe Creama", stock: 75, cost: 6.5 },
        { id: 16, name: "Hokaido Pearl Milk Tea", stock: 75, cost: 6.25 },
        { id: 17, name: "Mango Green Milk Tea", stock: 75, cost: 6.5 },
        { id: 18, name: "Golden Retriever", stock: 75, cost: 6.75 },
    ],
    "Non Caffenated": [
        { id: 19, name: "Tiger Boba", stock: 75, cost: 6.5 },
        { id: 20, name: "Strawberry Coconut", stock: 75, cost: 6.5 },
        {
            id: 21,
            name: "Strawberry Coconut Ice Blended",
            stock: 75,
            cost: 6.5,
        },
        { id: 22, name: "Halo Halo", stock: 75, cost: 6.95 },
        { id: 23, name: "Wintermellon Lemonade", stock: 75, cost: 5.8 },
        { id: 24, name: "Wintermellon w/ Fresh Milk", stock: 75, cost: 5.2 },
    ],
    "Fall Seasonals": [
        { id: 25, name: "Red Bean Matcha", stock: 75, cost: 6.95 },
        { id: 26, name: "Pumpkin Chai", stock: 75, cost: 6.95 },
        { id: 27, name: "Honey and Cinnamon Milk Tea", stock: 75, cost: 6.95 },
        { id: 31, name: "temp", stock: 99, cost: 5.0 },
        { id: 32, name: "temp2", stock: 99, cost: 1.0 },
    ],
    Uncategorized: [
        { id: 33, name: "New Item", stock: 0, cost: 0 },
        { id: 34, name: "New Item", stock: 0, cost: 0 },
        { id: 35, name: "New Item", stock: 0, cost: 0 },
    ],
};

interface InventoryItem {
    id: number;
    name: string;
    stock: number;
    cost: number;
}

const inventory: InventoryItem[] = [
    { id: 9, name: "Red Bean", stock: 100, cost: 0.75 },
    { id: 12, name: "Pudding", stock: 100, cost: 0.75 },
    { id: 13, name: "Herb Jelly", stock: 100, cost: 0.75 },
    { id: 14, name: "Alyu Jelly", stock: 100, cost: 0.75 },
    { id: 15, name: "Coffee Jelly", stock: 100, cost: 0.75 },
    { id: 16, name: "Honey Jelly", stock: 100, cost: 0.75 },
    { id: 18, name: "Strawberry Popping Boba", stock: 100, cost: 1 },
    { id: 19, name: "Peach Popping Boba", stock: 100, cost: 1 },
    { id: 20, name: "Crystal Boba", stock: 100, cost: 1 },
    { id: 21, name: "Napkins", stock: 2000, cost: 0 },
    { id: 22, name: "Large Cups", stock: 1000, cost: 0 },
    { id: 23, name: "Small Cups", stock: 1000, cost: 0 },
    { id: 24, name: "Medium Cups", stock: 1000, cost: 0 },
    { id: 25, name: "Straws", stock: 1000, cost: 0 },
    { id: 26, name: "Seal", stock: 1000, cost: 0 },
    { id: 27, name: "Bag", stock: 1000, cost: 0 },
    { id: 7, name: "Lychee Jelly", stock: 40, cost: 0.75 },
    { id: 1, name: "Black Tea", stock: 100, cost: 0 },
    { id: 10, name: "Creama", stock: 94, cost: 1.25 },
    { id: 17, name: "Mango Popping Boba", stock: 95, cost: 1 },
    { id: 8, name: "Mini Pearl", stock: 0, cost: 0.75 },
    { id: 2, name: "Green Tea", stock: 4, cost: 0 },
    { id: 6, name: "Aloe Vera", stock: 94, cost: 0.75 },
    { id: 28, name: "Ice", stock: 988, cost: 0.0 },
    { id: 11, name: "Ice Cream", stock: 49, cost: 1.25 },
    { id: 4, name: "Sugar", stock: 86, cost: 0 },
    { id: 5, name: "Pearl", stock: 35, cost: 0.75 },
    { id: 3, name: "Oolong Tea", stock: 20, cost: 0 },
];

function getBoba(): InventoryItem[] {
    return inventory.filter((i) => i.name.endsWith("Boba"));
}

function getJelly(): InventoryItem[] {
    return inventory.filter((i) => i.name.endsWith("Jelly"));
}

// configurable tax rate for UI display (8.25% default)
const TAX_RATE = parseFloat(process.env.NEXT_PUBLIC_TAX_RATE ?? "0.0825");

// price helpers
const findInventoryCost = (name: string) => {
    const item = inventory.find(
        (it) => it.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );
    return item ? item.cost : 0;
};

// compute a single order's price from its fields
function getOrderPrice(order: Record<string, any>) {
    let price = 0;
    for (const [key, value] of Object.entries(order)) {
        if (
            value === "None" ||
            value === null ||
            (Array.isArray(value) && value.length === 0)
        ) {
            continue;
        }
        if (key.toLowerCase() === "drink") {
            price += (value as MenuItem).cost;
            continue;
        }
        // Ice/Sugar affect display only (no price)
        if (key === "Ice" || key === "Sugar") continue;

        if (Array.isArray(value)) {
            for (const v of value) price += findInventoryCost(v);
        } else {
            price += findInventoryCost(String(value));
        }
    }
    return price;
}

interface CategoryCardProps {
    category: string;
    isSelected: boolean;
    onClick: () => void;
}

function CategoryCard({ category, isSelected, onClick }: CategoryCardProps) {
    return (
        <div
            className={`border p-4 rounded hover:border-black cursor-pointer transition duration-300 ${isSelected ? "bg-black text-white" : ""}`}
            onClick={onClick}
        >
            <p>{category}</p>
        </div>
    );
}

interface CategorySelectorProps {
    categories: string[];
    selectedCategory: string;
    onSelectedCategoryChange: (category: string) => void;
}

function CategorySelector({
    categories,
    selectedCategory,
    onSelectedCategoryChange,
}: CategorySelectorProps) {
    return (
        <div className="w-fit space-y-4">
            <p className="text-xl">Categories</p>
            {categories.map((c, i) => (
                <CategoryCard
                    key={i}
                    category={c}
                    isSelected={c === selectedCategory}
                    onClick={() => onSelectedCategoryChange(c)}
                />
            ))}
        </div>
    );
}

interface InventoryItemCardProps {
    item: InventoryItem;
    onSelect: () => void;
    onUnselect: () => void;
}
function ToppingCard({
    item,
    onSelect,
    onUnselect,
}: InventoryItemCardProps) {
    const [selected, setSelected] = useState(false);
    return (
        <div
            className={`flex items-center justify-center border rounded p-4 cursor-pointer ${selected ? "bg-black text-white" : ""}`}
            onClick={() => {
                setSelected(!selected);
                if (selected) onSelect();
                else onUnselect();
            }}
        >
            <p className="text-center select-none">{item.name}</p>
        </div>
    );
}

function ToppingSelector() {
    const [selected, setSelected] = useState<number[]>([]);
    return (
        <div className="grid grid-cols-4 gap-2">
            {inventory.map((i) => (
                <ToppingCard
                    key={i.id}
                    item={i}
                    onSelect={() => {
                        setSelected([...selected, i.id]);
                    }}
                    onUnselect={() =>
                        setSelected(selected.filter((id) => id !== i.id))
                    }
                />
            ))}
        </div>
    );
}

function MenuItemCard({ item }: { item: MenuItem }) {
    const [ice, setIce] = useState(0);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex flex-col gap-2 items-center bg-gray-100 p-2 rounded border">
                    <CupSoda width={96} height={96} />
                    {item.name}
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-9/10 overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Customize</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                    <div>
                        <p className="text-2xl">Size</p>
                        <div className="flex space-x-4">
                            <div className="border rounded-full p-4 text-xl">
                                S
                            </div>
                            <div className="border rounded-full p-4 text-xl">
                                M
                            </div>
                            <div className="border rounded-full p-4 text-xl">
                                L
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-2xl">Ice</p>
                        <div className="flex space-x-4">
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={() => setIce(ice > 0 ? ice - 1 : 0)}
                            >
                                <Minus />
                            </Button>
                            <Input
                                type="number"
                                className="rounded-full w-fit"
                                value={ice}
                                readOnly
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={() => setIce(ice < 5 ? ice + 1 : 5)}
                            >
                                <Plus />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <p className="text-2xl">Other Toppings</p>
                        <ToppingSelector />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="default" className="w-full">Add to Order</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface MenuItemsInterface {
    menuData: MenuData;
    selectedCategory: string;
}

function MenuItems({ menuData, selectedCategory }: MenuItemsInterface) {
    return (
        <div className="space-y-4">
            <p className="text-xl">Drinks</p>
            <div className="grid grid-rows-3 grid-cols-3 gap-4">
                {Object.entries(menuData)
                    .filter(([category, _]) => category === selectedCategory)
                    .map(([_, items]) =>
                        items.map((item, i) => (
                            <MenuItemCard key={i} item={item} />
                        )),
                    )}
            </div>
        </div>
    );
}

interface CartItem {
    id: number;
    name: string;
    cost: number;
    customizations: {
        id: number;
        name: string;
        cost: number;
    }[];
}

function Cart({ items }: { items: CartItem[] }) {
    return (
        <div>
            test
        </div>
    )
}

export default function CashierPage() {
    const [selectedCategory, setSelectedCategory] = useState("Fruit Tea");
    //Sets default selection for customization options
    const defaultCustomizations = {
        Size: "Medium Cups",
        Ice: "100%",
        Boba: "None",
        Jelly: "None",
        Tea: "Black Tea",
        Toppings: [],
    };

    return (
        <div className="grid grid-cols-[auto_1fr_auto] gap-8 p-8">
            <CategorySelector
                categories={Object.keys(menuData)}
                selectedCategory={selectedCategory}
                onSelectedCategoryChange={setSelectedCategory}
            />

            <MenuItems
                menuData={menuData}
                selectedCategory={selectedCategory}
            />

            <Cart items={[]}/>
        </div>
    );
}
