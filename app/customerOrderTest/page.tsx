"use client";

import { ReactNode, useState, JSX, useMemo, useEffect, useCallback } from "react";
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
import { CupSoda, Minus, Plus, ReceiptTurkishLiraIcon } from "lucide-react";
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
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import GoogleTranslate from "@/components/GoogleTranslate";
import { MenuItem, Category, Ingredient } from "@/lib/models";

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

type CurrencyCode = "USD" | "EUR";

const CURRENCIES = [
    { code: "USD", label: "USD - $", symbol: "$"},
    { code: "EUR", label: "EUR - €", symbol: "€"}
]

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
    USD: "$",
    EUR: "€",
}

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


interface MenuData {
    [categoryName: string]: MenuItem[];
}

const emptyMenuData: MenuData = {};
const emptyInventory: Ingredient[] = [];

const inventory: Ingredient[] = [];

const TAX_RATE = parseFloat(process.env.NEXT_PUBLIC_TAX_RATE ?? "0.0825");

const findInventoryCost = (name: string) => {
    const item = inventory.find(
        (it) => it.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );
    return item ? item.cost : 0;
};

function calculateSubtotal(cartItems: CartItem[]): number {
    //console.log(JSON.stringify(cartItems));
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
    const { isHighContrast } = useAccessibility();

    const base = "border p-4 rounded cursor-pointer";

    const normal = `hover:border-black transition duration-300 ${isSelected ? "bg-black text-white" : ""}`;

    const highContrast = `bg-black ${isSelected ? "text-blue-400" : "text-white"} border-2 border-white`;

    return (
        <div
            className={`${base} ${isHighContrast ? highContrast : normal}`}
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
    const {
        isHighContrast,
        setIsHighContrast,
        textMultipler,
        setTextMultipler,
    } = useAccessibility();
    return (
        <div
            className={`w-fit space-y-4 flex-col items-center ${isHighContrast ? "text-white" : "text-black"} ${textMultipler >= 1.75 ? "max-w-50" : ""}`}
        >
            <Button
                variant="default"
                className="w-full"
                onClick={() => {
                    let t = isHighContrast;
                    setIsHighContrast(!t);
                }}
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
                        if (textMultipler <= 1) return;
                        let z = textMultipler - 0.25;
                        document.documentElement.style.fontSize = `${16 * z}px`; //This changes the magnification of the page
                        setTextMultipler(z);
                    }}
                >
                    <Minus color={`${isHighContrast ? "blue" : "black"}`} />
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
                        if (textMultipler >= 2) return;
                        let z = textMultipler + 0.25;
                        document.documentElement.style.fontSize = `${16 * z}px`; //This changes the magnification of the page
                        setTextMultipler(z);
                    }}
                >
                    <Plus color={`${isHighContrast ? "blue" : "black"}`} />
                </Button>
            </div>
            <p
                className={`text-xl ${isHighContrast ? "text-white" : "text-black"}`}
            >
                {title}
            </p>
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
    item: Ingredient;
    isSelected: boolean;
    onSelect: () => void;
    onUnselect: () => void;
}

function ToppingCard({
    item,
    isSelected,
    onSelect,
    onUnselect,
}: InventoryItemCardProps) {
    const { isHighContrast } = useAccessibility();
    // const [selected, setSelected] = useState(isSelected);
    let selected = isSelected;
    return (
        <div
            className={`flex-col items-center justify-center border rounded p-4 cursor-pointer ${
                isHighContrast
                    ? selected
                        ? "text-blue-400"
                        : ""
                    : selected
                      ? "bg-black text-white"
                      : ""
            }`}
            onClick={() => {
                if (selected) {
                    // setSelected(false)
                    onUnselect();
                } else {
                    // setSelected(true)
                    onSelect();
                }
                // setSelected(!selected);
                // if (!selected) onSelect();
                // else onUnselect();
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
    onToppingSelect: (list: Ingredient[], id: string) => void;
    ingredientType: string;
    multiSelect: boolean;
    globalToppings: Record<string, Ingredient[]>;
}

function ToppingSelector({
    onToppingSelect,
    ingredientType,
    multiSelect,
    globalToppings,
}: ToppingSelectorProps) {
    const [selected, setSelected] = useState<Ingredient[]>([]); //This is for local selections
    
    // Sync local state with globalToppings when it changes
    useEffect(() => {
        const globalSelection = globalToppings[ingredientType] || [];
        setSelected(globalSelection);
    }, [globalToppings, ingredientType]);
    
    return (
        <div className={`grid grid-cols-4 gap-2`}>
            {inventory
                .filter((i) => i.ingredient_group === ingredientType)
                .map((i) => (
                    <ToppingCard
                        key={i.id}
                        item={i}
                        isSelected={selected.includes(i)}
                        onSelect={() => {
                            let localArr = multiSelect ? [...selected, i] : [i];
                            setSelected(localArr);
                            onToppingSelect(localArr, ingredientType);
                        }}
                        onUnselect={() => {
                            const localArr = selected.filter(
                                (item) => item.id !== i.id,
                            );
                            setSelected(localArr);
                            onToppingSelect(localArr, ingredientType);
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

function GenerateToppingsGroups() {
    let groups: string[] = [];
    for(let i: number = 0; i < inventory.length; ++i){
        if(groups.includes(inventory[i].ingredient_group)){
            continue;
        }
        if(inventory[i].ingredient_group == "Scale" || inventory[i].ingredient_group == "Default"){
            continue;
        }
        groups.push(inventory[i].ingredient_group);
    }
    let rec: Record<string, Ingredient[]> = {};
    for(const group of groups){
        rec = {
            ...rec,
            group: [],
        };
    }
    return rec;
}

function MenuItemCard({
    item,
    onConfirm,
    addToOrderLabel,
    speak,
}: MenuItemCardProps) {
    const { isHighContrast, textMultipler } = useAccessibility();

    const [open, setOpen] = useState(false);

    const [ice, setIce] = useState(4); // Default to 100% (4 servings)
    const [size, setSize] = useState<DrinkSize>("medium");

    const [selectedToppings, setSelectedToppings] = useState<
        Record<string, Ingredient[]>
    >(GenerateToppingsGroups());

    function setToppingsForType(list: Ingredient[], id: string) {
        setSelectedToppings((prev) => ({
            ...prev,
            [id]: list,
        }));
    }

    console.log(`inv size ${inventory.length}`);
    // Reset all customization state when dialog opens
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            // Reset to defaults when opening
            setIce(4); // 100%
            setSize("medium");
            
            // Find Black Tea from inventory
            const blackTea = inventory.find(
                (item) => item.ingredient_group === "Tea"  && item.name === "Black Tea"
            );
            
            // Set Black Tea as default for new drinks
            setSelectedToppings({
                ...selectedToppings,
                "Tea": blackTea ? [blackTea] : [],
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <div
                    className={`relative flex flex-col gap-2 items-center 
                    ${isHighContrast ? "bg-black" : "bg-gray-100"} p-2 rounded border
                    ${isHighContrast ? "text-white" : "text-black"}
                `}
                >
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
                            className={`w-40 h-40 object-cover`}
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
            <DialogContent
                className={`max-h-9/10 overflow-y-scroll
                    ${isHighContrast ? "text-white" : "text-black"}
                    ${isHighContrast ? "bg-black" : "bg-gray-100"}
                `}
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
            >
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
                                        isHighContrast
                                            ? size === "small"
                                                ? "bg-black text-blue-500"
                                                : ""
                                            : size === "small"
                                              ? "bg-black text-white"
                                              : ""
                                    }`}
                                onClick={() => setSize("small")}
                            >
                                S
                            </div>
                            <div
                                className={`cursor-pointer duration-300 border rounded-full p-4 text-xl 
                                     ${
                                         isHighContrast
                                             ? size === "medium"
                                                 ? "bg-black text-blue-500"
                                                 : ""
                                             : size === "medium"
                                               ? "bg-black text-white"
                                               : ""
                                     }`}
                                onClick={() => setSize("medium")}
                            >
                                M
                            </div>
                            <div
                                className={`cursor-pointer duration-300 border rounded-full p-4 text-xl  ${
                                    isHighContrast
                                        ? size === "large"
                                            ? "bg-black text-blue-500"
                                            : ""
                                        : size === "large"
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
                        {Object.keys(selectedToppings).map( (key) => {
                            console.log(key);
                            return (
                                <div key={key}>
                                    <p className="text-2xl mb-3">{key}</p>
                                    <ToppingSelector
                                        globalToppings={selectedToppings}
                                        onToppingSelect={setToppingsForType}
                                        ingredientType={key}
                                        multiSelect={false}
                                    />
                                </div>
                            );})
                        }
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            variant="default"
                            className="w-full"
                            onClick={() => {
                                const allCustomizations = Object.values(
                                    selectedToppings,
                                ).flatMap((topArr) =>
                                    topArr.map((t) => ({
                                        id: t.id,
                                        name: t.name,
                                        cost: t.cost,
                                    })),
                                );

                                onConfirm({
                                    id: item.id,
                                    size,
                                    ice,
                                    name: item.name,
                                    cost: item.cost,
                                    customizations: allCustomizations,
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
    const { isHighContrast } = useAccessibility();
    return (
        <div className="space-y-4">
            <p className={`text-xl ${isHighContrast ? "text-white" : "text-black"}`}>{title}</p>
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
    const { isHighContrast } = useAccessibility();

    return (
        <div
            className={`rounded p-4 border ${
                isHighContrast
                    ? "bg-black text-white border-4  border-blue-500"
                    : "bg-white text-black border"
            }`}
        >
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
    currency,
    setCurrency,
    formatPrice,
}: {
    items: CartItem[];
    setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    labels: Labels;
    currency: CurrencyCode,
    setCurrency: React.Dispatch<React.SetStateAction<CurrencyCode>>;
    formatPrice: (amount: number) => string;
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
                    ice: i.ice, // Send ice servings (0-4)
                })),
                employeeId: 1,
                paymentMethod: "CARD",
            }),
        });
        setItems([]);
    }

    return (
        <div
            className={`grid grid-rows-[1fr_8fr_1fr] min-h-0 h-[900] gap-4 ${isHighContrast ? "bg-black text-white border-8 border-yellow-200" : ""}`}
        >
            <p className={`text-xl mb-4 text-center ${isHighContrast ? "text-white" : "text-black"}`}>{labels.cart}</p>
            <ScrollArea className="h-150">
                <div className="space-y-4">
                    {items.map((i, idx) => (
                        <CartItemCard key={idx} item={i} />
                    ))}
                </div>
            </ScrollArea>

            <div
                className={`grid grid-rows-4 grid-cols-2 p-4 border rounded h-50 ${
                    textMultipler >= 1.75 ? "text-sm" : "text-md"
                }
                ${
                    isHighContrast
                        ? "bg-black text-white border-4 border-blue-500"
                        : "bg-white text-black border"
                }`}
            >
                <div className="col-span-2 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>{labels.subtotal}</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>{labels.tax}</span>
                        <span>{formatPrice(tax)}</span>
                    </div>

                    <div className="flex justify-between font-semibold">
                        <span>{labels.total}</span>
                        <span>{formatPrice(total)}</span>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            {/* Removed col-span-2 from Button as it should be inside the column structure */}
                            <Button
                                className={`w-full ${isHighContrast ? "border-4 border-green-400" : ""}`}
                            >
                                {labels.checkout}
                            </Button>
                        </DialogTrigger>

                        <DialogContent
                            className={`max-h-[90vh] ${isHighContrast ? "text-white bg-black" : "text-black"}`}
                        >
                            <DialogHeader>
                                <DialogTitle className={`text-center text-2xl`}>
                                    {labels.confirmOrder}
                                </DialogTitle>
                            </DialogHeader>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        variant="default"
                                        className={`w-full  ${isHighContrast ? "border-4 border-green-400" : ""}`}
                                        onClick={handleCheckout}
                                    >
                                        {labels.yesPlaceOrder}
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <select className={`rounded border px-2 py-1 text-sm w-full ${
                        isHighContrast
                            ? "bg-black text-white border-white"
                            : "bg-white text-black border-gray-300"
                    }`} value={currency}
                        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
                        {CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default function CashierPage() {
    const [selectedCategory, setSelectedCategory] = useState("Fruit Tea");
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const labels = EN_LABELS;

    const [menuData, setMenuData] = useState<MenuData>(emptyMenuData);
    const [menuDataReady, setMenuDataReady] = useState<boolean>(false);
    const [inventory, setInventory] = useState<Ingredient[]>(emptyInventory);

    const translatedMenuData = menuData;

    const categoryLabels = Object.fromEntries(
        Object.keys(menuData).map((c) => [c, c]),
    );

    const { speak } = useTextToSpeech("en-US");
    const { isHighContrast, textMultipler } = useAccessibility();

    const [currency, setCurrency] = useState<CurrencyCode>("USD");
    const [rates, setRates] = useState<Partial<Record<CurrencyCode, number>>>({
        USD: 1, 
    });

    

    useEffect(() => {
        if(currency === "USD") return; // If just USD no need to convert any conversions. 1 is okay.

        async function fetchRate(){ 
            const res = await fetch(`/api/currency?currency=${currency}`);
            const data = await res.json();

            setRates(prev => ({
                ...prev,
                [currency]: data.data[currency],
            }));
        }

        fetchRate();

    }, [currency]);

    const loadMenuData = async () => {
        setMenuDataReady(false);
        setMenuData({});
        let menuTempData: MenuData = {};
        console.log("loading menu");
        const catRes = await fetch("api/cashier/categories", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!catRes.ok) {
            throw new Error(`GET /api/cashier/categories ${catRes.status}`);
        }
        //console.log("hey");
        const cats: Category[] = await catRes.json();
        //console.log(`cats length: ${cats.length}`);
        for (let cat_idx = 0; cat_idx < cats.length; cat_idx++) {
            //console.log(`c idx:${cat_idx}`);
            const cat = cats[cat_idx];
            //console.log(cat);
            const queryBody = {
                id: cat.id,
            };
            const queryRes = await fetch("/api/cashier/menu_by_category", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(queryBody),
            });
            const items: MenuItem[] = await queryRes.json();
            //console.log(cat.name);
            menuTempData = { ...menuTempData, [cat.name]: items };
        }
        setMenuData(menuTempData);
        console.log("loading ingredients");
        const ingrRes = await fetch("api/ingredient", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const ingr: Ingredient[] = await ingrRes.json();
        setInventory(ingr);
        console.log(`ingr size ${inventory.length}`);
        setMenuDataReady(true);
    };

    useEffect(() => {
        loadMenuData();
    }, []);

    //console.log(cartItems);
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

    const formatPrice = useCallback((amount: number) => {
        const rate = rates[currency] ?? 1;
        const converted = amount * rate;
        return `${CURRENCY_SYMBOLS[currency]}${converted.toFixed(2)}`;
    }, [currency, rates]);


    return (
        
        <div className="min-h-screen bg-[#ffddd233] font-sans dark:bg-black flex flex-col text-white">
            <TopNav subtitle={labels.kioskTitle} variant="kiosk" />

            <div
                className={`flex justify-end px-8 pt-4 gap-2 items-center ${
                    isHighContrast ? "bg-black" : ""
                }`}
            >
                <div className="inline-block">
                    <GoogleTranslate />
                </div>
            </div>
            
            <div
                className={`flex-1 px-6 py-4 ${isHighContrast ? "bg-black" : ""}`}
            >
                {menuDataReady ? (
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
                            inventory={inventory}
                        />

                        <Cart
                            items={cartItems}
                            setItems={setCartItems}
                            labels={labels}
                            currency={currency}
                            setCurrency={setCurrency}
                            formatPrice={formatPrice}
                        />
                    </div>
                ) : (
                    <div className="mx-auto max-w-6xl grid grid-cols-[1.1fr_2fr_1.2fr] gap-6">
                        
                        <CategorySelector
                            categories={["loading"]}
                            selectedCategory={selectedCategory}
                            onSelectedCategoryChange={ () => {console.log("bad touch")}}
                            title={labels.categories}
                            categoryLabels={categoryLabels}
                        />
                        
                        <div>
                        </div>

                        <Cart
                            items={cartItems}
                            setItems={setCartItems}
                            labels={labels}
                            currency={currency}
                            setCurrency={setCurrency}
                            formatPrice={formatPrice}
                        />
                    </div>
                )}
                
            </div>
        </div>
    );
}
