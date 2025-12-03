"use client";

import { ReactNode, useState, JSX, useMemo, useEffect } from "react";
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
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

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

type DrinkSize = "small" | "medium" | "large";

const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "ar", label: "العربية" },
];

const LABEL_KEYS = [
    "kioskTitle",
    "categories",
    "drinks",
    "cart",
    "subtotal",
    "tax",
    "total",
    "checkout",
    "confirmOrder",
    "yesPlaceOrder",
    "language",
    "addToOrder",
] as const;

type LabelKey = (typeof LABEL_KEYS)[number];
type Labels = Record<LabelKey, string>;

const EN_LABELS: Labels = {
    kioskTitle: "Self-Service Kiosk",
    categories: "Categories",
    drinks: "Drinks",
    cart: "Cart",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    checkout: "Checkout",
    confirmOrder: "Confirm Order?",
    yesPlaceOrder: "Yes, Place Order",
    language: "Language:",
    addToOrder: "Add to Order",
};

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

const TAX_RATE = parseFloat(process.env.NEXT_PUBLIC_TAX_RATE ?? "0.0825");

const findInventoryCost = (name: string) => {
    const item = inventory.find(
        (it) => it.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );
    return item ? item.cost : 0;
};

function calculateSubtotal(cartItems: CartItem[]): number {
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
    label: string;
    isSelected: boolean;
    onClick: () => void;
}

function CategoryCard({
    category,
    label,
    isSelected,
    onClick,
}: CategoryCardProps) {
    return (
        <div
            className={`border p-4 rounded hover:border-black cursor-pointer transition duration-300 ${
                isSelected ? "bg-black text-white" : ""
            }`}
            onClick={onClick}
        >
            <p>{label}</p>
        </div>
    );
}

interface CategorySelectorProps {
    categories: string[];
    selectedCategory: string;
    onSelectedCategoryChange: (category: string) => void;
    title: string;
    categoryLabels: Record<string, string>;
}

function CategorySelector({
    categories,
    selectedCategory,
    onSelectedCategoryChange,
    title,
    categoryLabels,
}: CategorySelectorProps) {
    return (
        <div className="w-fit space-y-4">
            <p className="text-xl">{title}</p>
            {categories.map((c, i) => (
                <CategoryCard
                    key={i}
                    category={c}
                    label={categoryLabels[c] ?? c}
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
            className={`flex-col items-center justify-center border rounded p-4 cursor-pointer ${
                selected ? "bg-black text-white" : ""
            }`}
            onClick={() => {
                setSelected(!selected);
                if (!selected) onSelect();
                else onUnselect();
            }}
        >
            <p className="text-center select-none">{item.name}</p>
            {item.cost > 0 ? (
                <p className="text-center select-none">(${item.cost})</p>
            ) : null}
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
                .filter((i) => i.ingredient_type === ingredientType)
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
    addToOrderLabel: string;
    speak: (text: string) => void;
}
// Helper function to convert ice servings (0-4) to percentage label
const iceToPercentage = (servings: number): string => {
    const mapping: { [key: number]: string } = {
        0: "0%",
        1: "25%",
        2: "50%",
        3: "75%",
        4: "100%",
    };
    return mapping[servings] || "0%";
};

function MenuItemCard({ item, onConfirm, addToOrderLabel, speak }: MenuItemCardProps) {
    const [open, setOpen] = useState(false);
    const [ice, setIce] = useState(4); // Default to 100% (4 servings)
    const [size, setSize] = useState<DrinkSize>("medium");
    const [selectedBoba, setSelectedBoba] = useState<InventoryItem[]>([]);
    const [selectedTea, setSelectedTea] = useState<InventoryItem[]>([]);
    const [selectedJelly, setSelectedJelly] = useState<InventoryItem[]>([]);
    const [selectedOther, setSelectedOther] = useState<InventoryItem[]>([]);
    

    // Reset all customization state when dialog opens
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            // Reset to defaults when opening
            setIce(4); // 100%
            setSize("medium");
            setSelectedBoba([]);
            setSelectedTea([]);
            setSelectedJelly([]);
            setSelectedOther([]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <div className="relative flex flex-col gap-2 items-center bg-gray-100 p-2 rounded border">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            speak(`${item.name}. $${item.cost.toFixed(2)}`);
                        }}
                        className="absolute top-1 right-1 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full text-sm shadow z-10"
                    >
                        🔊
                    </button>

                    {item.image_url !== "" ? (
                        <img
                            src={item.image_url}
                            alt={"drink image"}
                            className="w-[120px] h-[120px] object-cover"
                        />
                    ) : (
                        <CupSoda width={120} height={120} />
                    )}
                    <span className="font-semibold text-center">
                        {item.name}
                    </span>
                    <span className="text-sm font-medium">
                        ${item.cost.toFixed(2)}
                    </span>
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
                                className={`cursor-pointer duration-300 border rounded-full p-4 text-xl ${
                                    size === "small"
                                        ? "bg-black text-white"
                                        : ""
                                }`}
                                onClick={() => setSize("small")}
                            >
                                S
                            </div>
                            <div
                                className={`cursor-pointer duration-300 border rounded-full p-4 text-xl ${
                                    size === "medium"
                                        ? "bg-black text-white"
                                        : ""
                                }`}
                                onClick={() => setSize("medium")}
                            >
                                M
                            </div>
                            <div
                                className={`cursor-pointer duration-300 border rounded-full p-4 text-xl ${
                                    size === "large"
                                        ? "bg-black text-white"
                                        : ""
                                }`}
                                onClick={() => setSize("large")}
                            >
                                L
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-2xl">Ice</p>
                        <div className="flex space-x-4">
                            {[0, 1, 2, 3, 4].map((servings) => (
                                <div
                                    key={servings}
                                    className={`cursor-pointer duration-300 border rounded-full p-4 text-xl ${ice === servings ? "bg-black text-white" : ""}`}
                                    onClick={() => setIce(servings)}
                                >
                                    {iceToPercentage(servings)}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <div>
                            <p className="text-2xl mb-3">Boba</p>
                            <ToppingSelector
                                onToppingSelect={setSelectedBoba}
                                ingredientType={20}
                            />
                        </div>
                        <div>
                            <p className="text-2xl mb-3">Tea</p>
                            <ToppingSelector
                                onToppingSelect={setSelectedTea}
                                ingredientType={30}
                            />
                        </div>
                        <div>
                            <p className="text-2xl mb-3">Jelly</p>
                            <ToppingSelector
                                onToppingSelect={setSelectedJelly}
                                ingredientType={40}
                            />
                        </div>
                        <div>
                            <p className="text-2xl mb-3">Other Toppings</p>
                            <ToppingSelector
                                onToppingSelect={setSelectedOther}
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
                            onClick={() => {
                                const allToppings = [
                                    ...selectedBoba,
                                    ...selectedTea,
                                    ...selectedJelly,
                                    ...selectedOther,
                                ];
                                onConfirm({
                                    id: item.id,
                                    size,
                                    ice,
                                    name: item.name,
                                    cost: item.cost,
                                    customizations: allToppings.map((t) => ({
                                        id: t.id,
                                        name: t.name,
                                        cost: t.cost,
                                    })),
                                });
                            }}
                        >
                            {addToOrderLabel}
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
    title: string;
    addToOrderLabel: string;
    speak: (text: string) => void;
}

function MenuItems({
    menuData,
    selectedCategory,
    onItemOrder,
    title,
    addToOrderLabel,
    speak,
}: MenuItemsInterface) {
    return (
        <div className="space-y-4">
            <p className="text-xl">{title}</p>
            <div className="grid grid-rows-3 grid-cols-3 gap-4">
                {Object.entries(menuData)
                    .filter(([category]) => category === selectedCategory)
                    .map(([_, items]) =>
                        items.map((item, i) => (
                            <MenuItemCard
                                key={i}
                                item={item}
                                onConfirm={onItemOrder}
                                addToOrderLabel={addToOrderLabel}
                                speak={speak}
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
            <p>Ice: {iceToPercentage(item.ice)}</p>
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
    labels,
}: {
    items: CartItem[];
    setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    labels: Labels;
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
            <p className="text-xl text-center">{labels.cart}</p>
            <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-3">
                    {items.map((i, idx) => (
                        <CartItemCard key={idx} item={i} />
                    ))}
                </div>
            </ScrollArea>
            <div className="border rounded p-3 space-y-2">
                <div className="flex justify-between text-sm">
                    <span>{labels.subtotal}</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>{labels.tax}</span>
                    <span>${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-semibold">
                    <span>{labels.total}</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full mt-1">
                            {labels.checkout}
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle className="text-center text-2xl">
                                {labels.confirmOrder}
                            </DialogTitle>
                        </DialogHeader>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    variant="default"
                                    className="w-full"
                                    onClick={handleCheckout}
                                >
                                    {labels.yesPlaceOrder}
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
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [labels, setLabels] = useState<Labels>(EN_LABELS);
    const [isTranslating, setIsTranslating] = useState(false);

    const LANGUAGE_TO_TTS_LANG: Record<string, string> = {
        en: "en-US",
        es: "es-ES",
        ar: "ar-SA",
    };

    const { speak, setLang } = useTextToSpeech(LANGUAGE_TO_TTS_LANG["en"]);

    const [translatedMenuData, setTranslatedMenuData] =
        useState<MenuData>(menuData);

    const [categoryLabels, setCategoryLabels] = useState<
        Record<string, string>
    >(() => Object.fromEntries(Object.keys(menuData).map((c) => [c, c])));

    useEffect(() => {
        if (selectedLanguage === "en") {
            setLabels(EN_LABELS);
            return;
        }

        const translateLabels = async () => {
            setIsTranslating(true);
            try {
                const texts = LABEL_KEYS.map((key) => EN_LABELS[key]);

                const res = await fetch("/api/translate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        texts,
                        targetLanguage: selectedLanguage,
                    }),
                });

                if (!res.ok) {
                    setLabels(EN_LABELS);
                    return;
                }

                const data = await res.json();
                const translatedTexts: string[] = data.translatedTexts ?? [];

                const updated: Labels = { ...EN_LABELS };
                LABEL_KEYS.forEach((key, idx) => {
                    if (translatedTexts[idx]) {
                        updated[key] = translatedTexts[idx];
                    }
                });

                setLabels(updated);
            } catch (err) {
                setLabels(EN_LABELS);
            } finally {
                setIsTranslating(false);
            }
        };

        translateLabels();
    }, [selectedLanguage]);

    useEffect(() => {
        if (selectedLanguage === "en") {
            setTranslatedMenuData(menuData);
            return;
        }

        const translateMenuItems = async () => {
            try {
                const flatItems: {
                    category: string;
                    index: number;
                    name: string;
                }[] = [];

                Object.entries(menuData).forEach(([category, items]) => {
                    items.forEach((item, index) => {
                        flatItems.push({ category, index, name: item.name });
                    });
                });

                const texts = flatItems.map((x) => x.name);

                const res = await fetch("/api/translate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        texts,
                        targetLanguage: selectedLanguage,
                    }),
                });

                if (!res.ok) {
                    setTranslatedMenuData(menuData);
                    return;
                }

                const data = await res.json();
                const translatedTexts: string[] = data.translatedTexts ?? [];

                const newMenu: MenuData = {};
                Object.entries(menuData).forEach(([category, items]) => {
                    newMenu[category] = items.map((item) => ({ ...item }));
                });

                translatedTexts.forEach((text, i) => {
                    const { category, index } = flatItems[i];
                    if (newMenu[category] && newMenu[category][index]) {
                        newMenu[category][index].name = text;
                    }
                });

                setTranslatedMenuData(newMenu);
            } catch (err) {
                setTranslatedMenuData(menuData);
            }
        };

        translateMenuItems();
    }, [selectedLanguage]);

    useEffect(() => {
        if (selectedLanguage === "en") {
            setLabels(EN_LABELS);
            setCategoryLabels(
                Object.fromEntries(Object.keys(menuData).map((c) => [c, c])),
            );
            setLang(LANGUAGE_TO_TTS_LANG["en"]);
            return;
        }

        const translateLabels = async () => {
            setIsTranslating(true);
            try {
                const labelTexts = LABEL_KEYS.map((key) => EN_LABELS[key]);
                const categoryNames = Object.keys(menuData);

                const texts = [...labelTexts, ...categoryNames];

                const res = await fetch("/api/translate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        texts,
                        targetLanguage: selectedLanguage,
                    }),
                });

                if (!res.ok) {
                    setLabels(EN_LABELS);
                    setCategoryLabels(
                        Object.fromEntries(
                            Object.keys(menuData).map((c) => [c, c]),
                        ),
                    );
                    setLang(LANGUAGE_TO_TTS_LANG["en"]);
                    return;
                }

                const data = await res.json();
                const translatedTexts: string[] = data.translatedTexts ?? [];

                const updated: Labels = { ...EN_LABELS };
                LABEL_KEYS.forEach((key, idx) => {
                    if (translatedTexts[idx]) {
                        updated[key] = translatedTexts[idx];
                    }
                });

                const newCategoryLabels: Record<string, string> = {};
                categoryNames.forEach((name, idx) => {
                    const tIdx = LABEL_KEYS.length + idx;
                    newCategoryLabels[name] = translatedTexts[tIdx] ?? name;
                });

                setLabels(updated);
                setCategoryLabels(newCategoryLabels);
                setLang(LANGUAGE_TO_TTS_LANG[selectedLanguage]);
            } catch (err) {
                setLabels(EN_LABELS);
                setCategoryLabels(
                    Object.fromEntries(
                        Object.keys(menuData).map((c) => [c, c]),
                    ),
                );
                setLang(LANGUAGE_TO_TTS_LANG["en"]);
            } finally {
                setIsTranslating(false);
            }
        };

        translateLabels();
    }, [selectedLanguage, setLang]);

    return (
        <div className="min-h-screen bg-[#ffddd233] font-sans dark:bg-black flex flex-col">
            <TopNav subtitle={labels.kioskTitle} />

            <div className="flex justify-end px-8 pt-4 gap-2 items-center">
                <span className="text-sm font-medium">{labels.language}</span>
                <select
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    disabled={isTranslating}
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.label}
                        </option>
                    ))}
                </select>
                {isTranslating && (
                    <span className="text-xs text-gray-500">
                        Translating...
                    </span>
                )}
            </div>

            <div className="flex-1 px-6 py-4">
                <div className="mx-auto max-w-6xl grid grid-cols-[1.1fr_2fr_1.2fr] gap-6">
                    <CategorySelector
                        categories={Object.keys(menuData)}
                        selectedCategory={selectedCategory}
                        onSelectedCategoryChange={setSelectedCategory}
                        title={labels.categories}
                        categoryLabels={categoryLabels}
                    />

                    <MenuItems
                        menuData={translatedMenuData}
                        selectedCategory={selectedCategory}
                        onItemOrder={(item) =>
                            setCartItems([...cartItems, item])
                        }
                        title={labels.drinks}
                        addToOrderLabel={labels.addToOrder}
                        speak={speak}
                    />

                    <Cart
                        items={cartItems}
                        setItems={setCartItems}
                        labels={labels}
                    />
                </div>
            </div>
        </div>
    );
}
