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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useAccessibility } from "@/contexts/AccessibilityContext";

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
  const { isHighContrast } = useAccessibility();

  const base = "border p-4 rounded cursor-pointer";

  const normal =
    `hover:border-black transition duration-300 ${isSelected ? "bg-black text-white" : ""}`;

  const highContrast =
    `bg-black ${isSelected ? "text-blue-400" : "text-white"} border-2 border-white`;

  return (
    <div
      className={`${base} ${isHighContrast ? highContrast : normal}`}
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
    const { isHighContrast, setIsHighContrast, textMultipler, setTextMultipler } = useAccessibility();
    return (
        <div className={`w-fit space-y-4 flex-col items-center ${isHighContrast ? "text-white" : "text-black"} ${textMultipler >= 1.75 ? "max-w-50" : ""}`}>
            <Button
                variant="default"
                className="w-full"
                onClick={() => {
                        let t = isHighContrast
                        setIsHighContrast(!t)
                    }
                }
            >
                Toggle High Contrast
            </Button>
            <p className="text-center">Zoom</p>
            <div className="flex space-x-4">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => {
                        if(textMultipler <= 1) return;
                        let z = textMultipler - .25
                        document.documentElement.style.fontSize = `${16 * z}px`; //This changes the magnification of the page
                        setTextMultipler(z);
                    }}
                >
                    <Minus color={`${isHighContrast ? "blue" : "black"}`}/>
                </Button>
                <Input
                    type="number"
                    className="rounded-full w-fit"
                    value={textMultipler}
                    readOnly
                />
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => {
                        if(textMultipler >= 2) return;
                        let z = textMultipler + .25
                        document.documentElement.style.fontSize = `${16 * z}px`; //This changes the magnification of the page
                        setTextMultipler(z);
                    }}
                >
                    <Plus color={`${isHighContrast ? "blue" : "black"}`} />
                </Button>
            </div>
            <p className={`text-xl ${isHighContrast ? "text-white" : "text-black"}`}>Categories</p>
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
    const { isHighContrast } = useAccessibility();
    const [selected, setSelected] = useState(false);
    return (
        <div
            className={`flex-col items-center justify-center border rounded p-4 cursor-pointer ${
                isHighContrast ? 
                    selected ? "text-blue-400" : ""          
                : 
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
        <div className={`grid grid-cols-4 gap-2`}>
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
    const { isHighContrast, textMultipler } = useAccessibility();
    const [ice, setIce] = useState(0);
    const [size, setSize] = useState<DrinkSize>("medium");
    const [selectedToppings, setSelectedToppings] = useState<InventoryItem[]>(
        [],
    );
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={`flex flex-col gap-2 items-center 
                    ${isHighContrast ? "bg-black" : "bg-gray-100"} p-2 rounded border
                    ${isHighContrast ? "text-white" : "text-black"}
                `}
                >
                    {item.image_url !== "" ? (
                        <img
                            src={item.image_url}
                            alt={"drink image"}
                            className={`w-40 h-40 object-cover`}
                        />
                    ) : (
                        <CupSoda width={120} height={120} />
                    )}
                    {item.name}
                </div>
            </DialogTrigger>
            <DialogContent className={`max-h-9/10 overflow-y-scroll
                    ${isHighContrast ? "text-white" : "text-black"}
                    ${isHighContrast ? "bg-black" : "bg-gray-100"}
                `}>
                <DialogHeader>
                    <DialogTitle>Customize {item.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                    <div>
                        <p className="text-2xl">Size</p>
                        <div className="flex space-x-4">
                            <div
                                className={`cursor-pointer duration-300 border rounded-full p-4 text-xl 
                                    ${
                                        isHighContrast ?
                                            size === "small" ? "bg-black text-blue-500" : ""
                                        :
                                            size === "small" ? "bg-black text-white" : ""
                                    }`
                                }
                                onClick={() => setSize("small")}
                            >
                                S
                            </div>
                            <div
                                className={`cursor-pointer duration-300 border rounded-full p-4 text-xl 
                                     ${
                                        isHighContrast ?
                                            size === "medium" ? "bg-black text-blue-500" : ""
                                        :
                                            size === "medium" ? "bg-black text-white" : ""
                                    }`}
                                onClick={() => setSize("medium")}
                            >
                                M
                            </div>
                            <div
                                className={`cursor-pointer duration-300 border rounded-full p-4 text-xl  ${
                                        isHighContrast ?
                                            size === "large" ? "bg-black text-blue-500" : ""
                                        :
                                            size === "large" ? "bg-black text-white" : ""
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
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={() => setIce(ice > 0 ? ice - 1 : 0)}
                            >
                                <Minus color={`${isHighContrast ? "blue" : "black"}`}/>
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
                                <Plus color={`${isHighContrast ? "blue" : "black"}`} />
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
    const { isHighContrast } = useAccessibility();

    return (
        <div
            className={`rounded p-4 border ${
            isHighContrast ? "bg-black text-white border-4  border-blue-500" : "bg-white text-black border"
            }`}
        >
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
    const { isHighContrast, textMultipler } = useAccessibility();

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
        <div className={`grid grid-rows-[1fr_8fr_1fr] min-h-0 max-h-full gap-4 ${isHighContrast ? "bg-black text-white border-8 border-yellow-200" : ""}`}>
            <p className="text-xl mb-4 text-center">Cart</p>
            <ScrollArea className="h-90">
                <div className="space-y-4">
                    {items.map((i, idx) => (
                        <CartItemCard key={idx} item={i} />
                    ))}
                </div>
            </ScrollArea>
            <div className={`grid grid-rows-4 grid-cols-2 p-4 border rounded  max-h-40 ${
                textMultipler >= 1.75 ? "text-sm" : "text-md"
            }
                ${
                isHighContrast ? "bg-black text-white border-4  border-blue-500" : "bg-white text-black border"
                }`}>
                <p>Subtotal</p>
                <p className="text-right">${subtotal.toFixed(2)}</p>

                <p>Tax</p>
                <p className="text-right">${tax.toFixed(2)}</p>

                <p>Total</p>
                <p className="text-right">${total.toFixed(2)}</p>
                <Dialog>
                    {/* Button that opens the dialog */}
                    <DialogTrigger asChild>
                        <Button className={`col-span-2 ${isHighContrast ? "border-4 border-green-400" : ""}`}>Checkout</Button>
                    </DialogTrigger>

                    <DialogContent className={`max-h-[90vh] ${isHighContrast ? "text-white bg-black" : "text-black"}`}>
                        <DialogHeader>
                            <DialogTitle className={`text-center text-2xl`}>
                                Confirm Order?
                            </DialogTitle>
                        </DialogHeader>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    variant="default"
                                    className={`w-full  ${isHighContrast ? "border-4 border-green-400" : ""}`}
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
    const { isHighContrast, textMultipler } = useAccessibility();

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
        <div
            className={`grid w-full ${textMultipler >= 1.75 ? "grid-cols-[1fr_8fr_4fr]" : "grid-cols-[1fr_7fr_2fr]"} gap-8 p-8 h-dvh overflow-y-auto ${
                isHighContrast ? "bg-black" : ""
            }`}
        >
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
    );
}
