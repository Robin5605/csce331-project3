"use client";

import { ReactNode, useState, JSX, useMemo } from "react";
import Image from "next/image";
import IdleLogout from "@/components/idleLogout";
import TopNav from "@/components/TopNav";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

type DrinkSize = "small" | "medium" | "large";

interface CartItem {
    id: number;
    size: DrinkSize;
    ice: number;
    name: string;
    cost: number;
    customizations: {
        id: number;
        name: string;
        cost: number;
    }[];
}

//[REMOVE WHEN API IS IMPLEMENTED] Temporary data for now
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
interface InventoryItem {
    id: number;
    name: string;
    stock: number;
    cost: number;
    ingredient_type: number;
}

const inventory: InventoryItem[] = [
    { id: 21, name: "Napkins", stock: 2000, cost: 0, ingredient_type: 0 },
    { id: 22, name: "Large Cups", stock: 1000, cost: 0, ingredient_type: 0 },
    { id: 23, name: "Small Cups", stock: 1000, cost: 0, ingredient_type: 0 },
    { id: 24, name: "Medium Cups", stock: 1000, cost: 0, ingredient_type: 0 },
    { id: 25, name: "Straws", stock: 1000, cost: 0, ingredient_type: 0 },
    { id: 26, name: "Seal", stock: 1000, cost: 0, ingredient_type: 0 },
    { id: 27, name: "Bag", stock: 1000, cost: 0, ingredient_type: 0 },

    { id: 4, name: "Sugar", stock: 86, cost: 0, ingredient_type: 1 },

    { id: 9, name: "Red Bean", stock: 96, cost: 0.75, ingredient_type: 100 },
    { id: 12, name: "Pudding", stock: 92, cost: 0.75, ingredient_type: 100 },
    { id: 8, name: "Mini Pearl", stock: 51, cost: 0.75, ingredient_type: 100 },
    { id: 5, name: "Pearl", stock: 28, cost: 0.75, ingredient_type: 100 },
    { id: 6, name: "Aloe Vera", stock: 89, cost: 0.75, ingredient_type: 100 },

    { id: 20, name: "Crystal Boba", stock: 92, cost: 1, ingredient_type: 20 },
    {
        id: 18,
        name: "Strawberry Popping Boba",
        stock: 98,
        cost: 1,
        ingredient_type: 20,
    },
    {
        id: 17,
        name: "Mango Popping Boba",
        stock: 89,
        cost: 1,
        ingredient_type: 20,
    },
    {
        id: 19,
        name: "Peach Popping Boba",
        stock: 96,
        cost: 1,
        ingredient_type: 20,
    },

    { id: 3, name: "Oolong Tea", stock: 13, cost: 0, ingredient_type: 30 },
    { id: 2, name: "Green Tea", stock: 0, cost: 0, ingredient_type: 30 },
    { id: 1, name: "Black Tea", stock: 70, cost: 1, ingredient_type: 30 },

    { id: 13, name: "Herb Jelly", stock: 100, cost: 0.75, ingredient_type: 40 },
    { id: 7, name: "Lychee Jelly", stock: 37, cost: 0.75, ingredient_type: 40 },
    { id: 14, name: "Alyu Jelly", stock: 96, cost: 0.75, ingredient_type: 40 },
    {
        id: 15,
        name: "Coffee Jelly",
        stock: 93,
        cost: 0.75,
        ingredient_type: 40,
    },
    { id: 16, name: "Honey Jelly", stock: 96, cost: 0.75, ingredient_type: 40 },

    { id: 28, name: "Ice", stock: 813, cost: 0.0, ingredient_type: 1 },

    { id: 10, name: "Creama", stock: 84, cost: 1.25, ingredient_type: 100 },
    { id: 11, name: "Ice Cream", stock: 36, cost: 1.25, ingredient_type: 100 },
];

// configurable tax rate for UI display (8.25% default)
const TAX_RATE = parseFloat(process.env.NEXT_PUBLIC_TAX_RATE ?? "0.0825");

// price helpers
const findInventoryCost = (name: string) => {
    const item = inventory.find(
        (it) => it.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );
    return item ? item.cost : 0;
};

function calculateSubtotal(cartItems: CartItem[]): number {
    console.log(JSON.stringify(cartItems));
    let total = 0;

    for (const item of cartItems) {
        for (const customization of item.customizations)
            total += customization.cost;
        total += item.cost;
    }

    return total;
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
function ToppingCard({ item, onSelect, onUnselect }: InventoryItemCardProps) {
    const [selected, setSelected] = useState(false);
    return (
        <div
            className={`flex-col items-center justify-center border rounded p-4 cursor-pointer ${selected ? "bg-black text-white" : ""}`}
            onClick={() => {
                setSelected(!selected);
                if (!selected) onSelect();
                else onUnselect();
            }}
        >
            <p className="text-center select-none">{item.name}</p>
            {item.cost > 0 ? (
                <p className="text-center select-none">(${item.cost})</p>
            ) : (
                <></>
            )}
        </div>
    );
}

interface ToppingSelectorProps {
    onToppingSelect: (toppings: InventoryItem[]) => void;
    ingredientType: number;
}
function ToppingSelector({
    onToppingSelect,
    ingredientType,
}: ToppingSelectorProps) {
    const [selected, setSelected] = useState<InventoryItem[]>([]);
    return (
        <div className="grid grid-cols-4 gap-2">
            {inventory
                .filter((i) => {
                    if (i.ingredient_type === ingredientType) {
                        return true;
                    }
                    return false;
                })
                .map((i) => (
                    <ToppingCard
                        key={i.id}
                        item={i}
                        onSelect={() => {
                            const newArr = [...selected, i];
                            setSelected(newArr);
                            onToppingSelect(newArr);
                        }}
                        onUnselect={() => {
                            const newArr = selected.filter(
                                (item) => item.id !== i.id,
                            );
                            setSelected(newArr);
                            onToppingSelect(newArr);
                        }}
                    />
                ))}
        </div>
    );
}

interface MenuItemCardProps {
    item: MenuItem;
    onConfirm: (item: CartItem) => void;
}
function MenuItemCard({ item, onConfirm }: MenuItemCardProps) {
    const [ice, setIce] = useState(0);
    const [size, setSize] = useState<DrinkSize>("medium");
    const [selectedToppings, setSelectedToppings] = useState<InventoryItem[]>(
        [],
    );
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex flex-col gap-2 items-center bg-gray-100 p-2 rounded border">
                    {item.image_url !== "" ? (
                        <img
                            src={item.image_url}
                            alt={"drink image"}
                            className="w-[120] h-[120] object-cover"
                        />
                    ) : (
                        <CupSoda width={120} height={120} />
                    )}
                    {item.name}
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-9/10 overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Customize {item.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                    <div>
                        <p className="text-2xl">Size</p>
                        <div className="flex space-x-4">
                            <div
                                className={`cursor-pointer duration-300 border rounded-full p-4 text-xl ${size === "small" ? "bg-black text-white" : ""}`}
                                onClick={() => setSize("small")}
                            >
                                S
                            </div>
                            <div
                                className={`cursor-pointer duration-300 border rounded-full p-4 text-xl ${size === "medium" ? "bg-black text-white" : ""}`}
                                onClick={() => setSize("medium")}
                            >
                                M
                            </div>
                            <div
                                className={`cursor-pointer duration-300 border rounded-full p-4 text-xl ${size === "large" ? "bg-black text-white" : ""}`}
                                onClick={() => setSize("large")}
                            >
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

                    <div className="flex flex-col space-y-4">
                        <div>
                            <p className="text-2xl mb-3">Boba</p>
                            <ToppingSelector
                                onToppingSelect={setSelectedToppings}
                                ingredientType={20}
                            />
                        </div>
                        <div>
                            <p className="text-2xl mb-3">Tea</p>
                            <ToppingSelector
                                onToppingSelect={setSelectedToppings}
                                ingredientType={30}
                            />
                        </div>
                        <div>
                            <p className="text-2xl mb-3">Jelly</p>
                            <ToppingSelector
                                onToppingSelect={setSelectedToppings}
                                ingredientType={40}
                            />
                        </div>
                        <div>
                            <p className="text-2xl mb-3">Other Toppings</p>
                            <ToppingSelector
                                onToppingSelect={setSelectedToppings}
                                ingredientType={100}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            variant="default"
                            className="w-full"
                            onClick={() =>
                                onConfirm({
                                    id: item.id,
                                    size,
                                    ice,
                                    name: item.name,
                                    cost: item.cost,
                                    customizations: selectedToppings.map(
                                        (t) => ({
                                            id: t.id,
                                            name: t.name,
                                            cost: t.cost,
                                        }),
                                    ),
                                })
                            }
                        >
                            Add to Order
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface MenuItemsInterface {
    menuData: MenuData;
    selectedCategory: string;
    onItemOrder: (item: CartItem) => void;
}

function MenuItems({
    menuData,
    selectedCategory,
    onItemOrder,
}: MenuItemsInterface) {
    return (
        <div className="space-y-4">
            <p className="text-xl">Drinks</p>
            <div className="grid grid-rows-3 grid-cols-3 gap-4">
                {Object.entries(menuData)
                    .filter(([category, _]) => category === selectedCategory)
                    .map(([_, items]) =>
                        items.map((item, i) => (
                            <MenuItemCard
                                key={i}
                                item={item}
                                onConfirm={onItemOrder}
                            />
                        )),
                    )}
            </div>
        </div>
    );
}

function CartItemCard({ item }: { item: CartItem }) {
    return (
        <div className="border rounded p-4">
            <p className="text-xl font-bold">
                {item.size.charAt(0).toUpperCase() + item.size.substring(1)}{" "}
                {item.name}
            </p>
            <p>Ice: {item.ice}</p>
            {item.customizations.map((c) => (
                <p key={c.id}>{c.name}</p>
            ))}
            <Separator className="my-4" />
            <p>Total: ${calculateSubtotal([item])}</p>
        </div>
    );
}
function Cart({
    items,
    setItems,
}: {
    items: CartItem[];
    setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}) {
    const subtotal = calculateSubtotal(items);
    const tax = TAX_RATE * subtotal;
    const total = subtotal + tax;

    function handleCheckout() {
        fetch("/api/customer/order", {
            method: "POST",
            body: JSON.stringify({
                drinks: items.map((i) => ({
                    id: i.id,
                    customizations: i.customizations.map((i) => i.id),
                })),
                employeeId: 1,
                paymentMethod: "CARD",
            }),
        });
        setItems([]);
    }

    return (
        <div className="flex flex-col h-full gap-3">
            {/* Cart title */}
            <p className="text-xl text-center">Cart</p>

            {/* Scrollable list of items */}
            <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-3">
                    {items.map((i, idx) => (
                        <CartItemCard key={idx} item={i} />
                    ))}
                </div>
            </ScrollArea>

            {/* Totals + Checkout (always visible at bottom) */}
            <div className="border rounded p-3 space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full mt-1">Checkout</Button>
                    </DialogTrigger>

                    <DialogContent className="max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle className="text-center text-2xl">
                                Confirm Order?
                            </DialogTitle>
                        </DialogHeader>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    variant="default"
                                    className="w-full"
                                    onClick={handleCheckout}
                                >
                                    Yes, Place Order
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default function CashierPage() {
    const [selectedCategory, setSelectedCategory] = useState("Fruit Tea");
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    console.log(cartItems);
    //Sets default selection for customization options
    const defaultCustomizations = {
        Size: "Medium Cups",
        Ice: "100%",
        Boba: "None",
        Jelly: "None",
        Tea: "Black Tea",
        Toppings: [],
    };

    const placeholderItems: CartItem[] = [
        {
            id: 1,
            name: "Mango Green Tea",
            ice: 3,
            size: "large",
            cost: 6.5,
            customizations: [
                { id: 9, name: "Red Bean", cost: 0.75 },
                { id: 12, name: "Pudding", cost: 0.75 },
                { id: 13, name: "Herb Jelly", cost: 0.75 },
            ],
        },
    ];
    return (
        <div className="min-h-screen bg-[#ffddd233] font-sans dark:bg-black flex flex-col">
            {/* Top navigation bar */}
            <TopNav subtitle="Self-Service Kiosk" />

            {/* Main 3-column layout under the nav */}
            <div className="grid grid-cols-[1fr_7fr_2fr] gap-8 p-8 flex-1">
                <CategorySelector
                    categories={Object.keys(menuData)}
                    selectedCategory={selectedCategory}
                    onSelectedCategoryChange={setSelectedCategory}
                />

                <MenuItems
                    menuData={menuData}
                    selectedCategory={selectedCategory}
                    onItemOrder={(item) => setCartItems([...cartItems, item])}
                />

                <Cart items={cartItems} setItems={setCartItems} />
            </div>
        </div>
);
}