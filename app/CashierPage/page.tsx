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
import { Button } from "@/components/ui/button";
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
    const quantity = (order.quantity as number) || 1;
    for (const [key, value] of Object.entries(order)) {
        if (
            value === "None" ||
            value === null ||
            (Array.isArray(value) && value.length === 0) ||
            key === "quantity"
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
    return price * quantity;
}

interface CategoryCardProps {
    category: string;
    isSelected: boolean;
    onClick: () => void;
}

    //Serves as the state used for showing the Customization page
    const [isCustomizationOpen, setIsCustomizationOpen] =
        useState<boolean>(false);
    const [selectedCategory, setSelectedCateory] =
        useState<string>("Fruit Tea");
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [selectedCustomizationOptions, setSelectedCustomizationOptions] =
        useState<Record<string, string | string[]>>(defaultCustomizations);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [curOrders, setCurOrders] = useState<
        (Record<string, string | string[] | MenuItem | null | number> & {
            quantity?: number;
        })[]
    >([]);
    const { subtotal, tax, total } = useMemo(() => {
        const sub = curOrders.reduce((sum, o) => sum + getOrderPrice(o), 0);
        const t = sub * TAX_RATE;
        const tot = sub + t;
        return {
            subtotal: Math.round(sub * 100) / 100,
            tax: Math.round(t * 100) / 100,
            total: Math.round(tot * 100) / 100,
        };
    }, [curOrders]);

    //Handles whenever a MenuItem is clicked to bring up the customization menu
    const menuItemClicked = (item: MenuItem) => {
        setSelectedCustomizationOptions(defaultCustomizations); //Makes sure to reset the selected options
        setSelectedItem(item);
        setIsCustomizationOpen(true);
    };
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

    // Handles whenever an order is finalized on the customization side
    const submitOrder = () => {
        // Add the current selection into the total orders
        const existingQuantity =
            editingIndex !== null
                ? (curOrders[editingIndex]?.quantity as number) || 1
                : 1;

        const order = {
            Drink: selectedItem,
            ...selectedCustomizationOptions,
            quantity: existingQuantity,
        };

        if (editingIndex !== null) {
            // Replace the item being edited
            setCurOrders(
                curOrders.map((o, i) => (i === editingIndex ? order : o)),
            );
            setEditingIndex(null);
        } else {
            // Add a new item
            setCurOrders([...curOrders, order]);
        }
        setIsCustomizationOpen(false);
    };

    // Handle removing an item from the cart
    const handleRemoveItem = (index: number) => {
        setCurOrders(curOrders.filter((_, i) => i !== index));
    };

    // Handle increasing quantity
    const handleIncreaseQty = (index: number) => {
        setCurOrders(
            curOrders.map((order, i) =>
                i === index
                    ? {
                          ...order,
                          quantity: ((order.quantity as number) || 1) + 1,
                      }
                    : order,
            ),
        );
    };

    const handleDecreaseQty = (index: number) => {
        setCurOrders(
            curOrders.map((order, i) => {
                if (i === index) {
                    const currentQty = (order.quantity as number) || 1;
                    return { ...order, quantity: Math.max(1, currentQty - 1) };
                }
                return order;
            }),
        );
    };

    const handleEditItem = (index: number) => {
        const orderToEdit = curOrders[index];
        if (orderToEdit) {
            setSelectedItem(orderToEdit.Drink as MenuItem);

            const { Drink, quantity, ...customizations } = orderToEdit;
            setSelectedCustomizationOptions(
                customizations as Record<string, string | string[]>,
            );
            setEditingIndex(index);
            setIsCustomizationOpen(true);
        }
    };

    //handles current order and sends completed order to database
    const checkoutOrder = async () => {
        //console.log("checking out");
        try {
            let tempCost = 0;
            curOrders.forEach((cOrder) => {
                tempCost += getOrderPrice(cOrder);
            });
            tempCost = tempCost + tempCost * TAX_RATE;
            const orderBody = {
                cost: Math.round(tempCost * 100) / 100,
                employeeId: "1",
                paymentMethod: "CARD",
            };
            console.log(orderBody.cost);
            const orderRes = await fetch("api/cashier/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderBody),
            });
            if (!orderRes.ok)
                throw new Error(`POST /api/menu ${orderRes.status}`);
            let { id } = await orderRes.json();
            const orderId = id;
            //console.log(`= order id: ${orderId}`);
            curOrders.map(async (order, orderIndex) => {
                const quantity = (order.quantity as number) || 1;
                // Create multiple drink orders based on quantity
                for (let qtyIndex = 0; qtyIndex < quantity; qtyIndex++) {
                    let drinkOrderId = -1;
                    for (
                        let index = 0;
                        index < Object.entries(order).length;
                        ++index
                    ) {
                        let [key, value] = Object.entries(order)[index];
                        //console.log(`\t= k: ${key}\tv: ${value}\tdo id: ${drinkOrderId}`);
                        if (
                            value === "None" ||
                            value === null ||
                            (Array.isArray(value) && value.length === 0)
                        ) {
                            continue;
                        }
                        if (key.toLowerCase() === "drink") {
                            const drinkOrderBody = {
                                menuId: (value as MenuItem).id,
                                orderId: orderId,
                            };
                            const drinkOrderRes = await fetch(
                                "api/cashier/drinks_order",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(drinkOrderBody),
                                },
                            );
                            let { id } = await drinkOrderRes.json();
                            drinkOrderId = id;
                        } else {
                            let ingredientAmmount = 0;
                            let ingredientTemp: InventoryItem | any =
                                inventory[0];
                            if (key === "Ice" || key === "Sugar") {
                                if (value === "100%") {
                                    ingredientAmmount = 4;
                                } else if (value === "75%") {
                                    ingredientAmmount = 3;
                                } else if (value === "50%") {
                                    ingredientAmmount = 2;
                                } else if (value === "25%") {
                                    ingredientAmmount = 1;
                                } else {
                                    continue;
                                }
                                ingredientTemp = { id: 28, name: "Ice" };
                            } else if (key === "Size") {
                                continue;
                            } else if (Array.isArray(value)) {
                                ingredientAmmount = 1;
                                value.forEach(async (ingredientName) => {
                                    ingredientTemp = inventory.find((cItem) => {
                                        if (cItem.name == ingredientName) {
                                            return cItem;
                                        }
                                    });

                                    if (ingredientTemp == null) {
                                        console.log("==bad ingredient name==");
                                        return;
                                    }

                                    const drinkIngredientBody = {
                                        drink_id: drinkOrderId,
                                        ingredient_id: ingredientTemp.id,
                                        servings: ingredientAmmount,
                                    };
                                    await fetch(
                                        "api/cashier/drink_ingredients",
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify(
                                                drinkIngredientBody,
                                            ),
                                        },
                                    );
                                });
                                continue;
                            } else {
                                ingredientAmmount = 1;
                                ingredientTemp = inventory.find((cItem) => {
                                    if (cItem.name == value) {
                                        return cItem;
                                    }
                                });
                            }

                            if (ingredientTemp == null) {
                                console.log("\t\t==bad ingredient name==");
                                continue;
                            }

                            const drinkIngredientBody = {
                                drink_id: drinkOrderId,
                                ingredient_id: ingredientTemp.id,
                                servings: ingredientAmmount,
                            };
                            await fetch("api/cashier/drink_ingredients", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(drinkIngredientBody),
                            });
                        }
                    }
                }
            });
        } catch (e: any) {}
        setCurOrders([]);
    };
interface InventoryItemCardProps {
    item: InventoryItem;
    onSelect: () => void;
    onUnselect: () => void;
}
function ToppingCard({ item, onSelect, onUnselect }: InventoryItemCardProps) {
    const [selected, setSelected] = useState(false);
    return (
        <div
            className={`flex items-center justify-center border rounded p-4 cursor-pointer ${selected ? "bg-black text-white" : ""}`}
            onClick={() => {
                setSelected(!selected);
                if (!selected) onSelect();
                else onUnselect();
            }}
        >
            <p className="text-center select-none">{item.name}</p>
        </div>
    );
}

interface ToppingSelectorProps {
    onToppingSelect: (toppings: InventoryItem[]) => void;
}
function ToppingSelector({ onToppingSelect }: ToppingSelectorProps) {
    const [selected, setSelected] = useState<InventoryItem[]>([]);
    return (
        <div className="grid grid-cols-4 gap-2">
            {inventory.map((i) => (
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

                    <div>
                        <p className="text-2xl">Other Toppings</p>
                        <ToppingSelector
                            onToppingSelect={setSelectedToppings}
                        />
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
        <div className="flex min-h-screen bg-[#ffddd233] font-sans dark:bg-black gap-6 justify-between">
            <AlertDialog
                open={isCustomizationOpen}
                onOpenChange={(open) => {
                    setIsCustomizationOpen(open);
                    if (!open) {
                        // Reset editing state when dialog closes (cancel, ESC, etc.)
                        setEditingIndex(null);
                    }
                }}
            >
                {/* The reason we override small is because that's the only way we can adjust the width of the AlertDialog */}
                <AlertDialogContent className="w-[90vw] max-w-none sm:max-w-4xl p-8 ">
                    <AlertDialogTitle className="font-semibold text-3xl">
                        Customize Order
                    </AlertDialogTitle>

                    <div className="max-h-[800px] overflow-y-auto pr-2">
                        <CustomizationCategory name="Size">
                            <CustomizationData
                                isOneItem={false}
                                toFilterBy="cups"
                                category="Size"
                                allowsMultipleSelections={false}
                            />
                        </CustomizationCategory>

                        <CustomizationCategory name="Ice">
                            <CustomizationData
                                isOneItem={true}
                                toFilterBy="ice"
                                category="Ice"
                                allowsMultipleSelections={false}
                            />
                        </CustomizationCategory>

                        <CustomizationCategory name="Tea">
                            <CustomizationData
                                isOneItem={false}
                                toFilterBy="tea"
                                category="Tea"
                                allowsMultipleSelections={false}
                            />
                        </CustomizationCategory>

                        <CustomizationCategory name="Boba">
                            <CustomizationData
                                isOneItem={false}
                                toFilterBy="boba"
                                category="Boba"
                                allowsMultipleSelections={false}
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

function Cart({ items }: { items: CartItem[] }) {
    const subtotal = calculateSubtotal(items);
    const tax = TAX_RATE * subtotal;
    const total = subtotal + tax;

    function handleCheckout() {
        fetch("/api/cashier/order", {
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
    }

    return (
        <div className="grid grid-rows-[1fr_8fr_1fr] min-h-0 gap-4">
            <p className="text-xl mb-4 text-center">Cart</p>
            <ScrollArea className="h-120">
                <div className="space-y-4">
                    {items.map((i, idx) => (
                        <CartItemCard key={idx} item={i} />
                    ))}
                </div>
            </aside>

            <main className="flex-1 flex items-start justify-center mt-10">
                <div className="flex flex-wrap gap-16 justify-around">
                    {menuData[selectedCategory].map((itemData) => {
                        return (
                            <ItemCard
                                itemName={itemData.name}
                                whenClicked={() => menuItemClicked(itemData)}
                            />
                        );
                    })}
                </div>
            </main>

            <aside className="w-[300px] h-screen bg-gradient-to-b from-[#9d8189] to-[#ffe5d9] flex flex-col justify-between p-4">
                <div>
                    <h2 className="font-semibold text-3xl text-center mt-3 mb-4">
                        Checkout
                    </h2>
                    <div className="bg-white/40 rounded-xl p-3 shadow-inner max-h-[60vh] overflow-y-auto">
                        {curOrders.length === 0 ? (
                            <div className="flex items-center justify-center h-full min-h-[200px]">
                                <p className="text-gray-600 font-medium text-lg">
                                    Cart is empty
                                </p>
                            </div>
                        ) : (
                            curOrders.map((order, orderIndex) => {
                                const itemsJSX: JSX.Element[] = [];

                                Object.entries(order).forEach(
                                    ([key, value]) => {
                                        if (
                                            value === "None" ||
                                            value === null ||
                                            (Array.isArray(value) &&
                                                value.length === 0)
                                        ) {
                                            return;
                                        }

                                        if (
                                            key.toLowerCase() === "drink" ||
                                            key === "quantity"
                                        ) {
                                            // we'll show the drink name in the header; price is added in getOrderPrice
                                            // quantity is shown in the quantity controls, not as a customization item
                                            return;
                                        } else if (
                                            key === "Ice" ||
                                            key === "Sugar"
                                        ) {
                                            itemsJSX.push(
                                                <div
                                                    key={`suborder-${key}-${value}-single`}
                                                    className="bg-[#ffe5ea] px-2 py-1 rounded mb-2"
                                                >
                                                    {key}: {value as string}
                                                </div>,
                                            );
                                        } else if (Array.isArray(value)) {
                                            value.forEach((o: string) => {
                                                const p = findInventoryCost(o);
                                                itemsJSX.push(
                                                    <div
                                                        key={`suborder-${key}-${o}-single`}
                                                        className="bg-[#ffe5ea] px-2 py-1 rounded mb-2"
                                                    >
                                                        {o}{" "}
                                                        {p !== 0
                                                            ? `($${p.toFixed(2)})`
                                                            : ""}
                                                    </div>,
                                                );
                                            });
                                        } else {
                                            const p = findInventoryCost(
                                                String(value),
                                            );
                                            itemsJSX.push(
                                                <div
                                                    key={`suborder-${key}-${value}-single`}
                                                    className="bg-[#ffe5ea] px-2 py-1 rounded mb-2"
                                                >
                                                    {String(value)}{" "}
                                                    {p !== 0
                                                        ? `($${p.toFixed(2)})`
                                                        : ""}
                                                </div>,
                                            );
                                        }
                                    },
                                );

                                const order_price = getOrderPrice(order);
                                const quantity =
                                    (order.quantity as number) || 1;

                                return (
                                    <div
                                        key={`order-${orderIndex}`}
                                        className="bg-[#fffaf8] rounded-xl p-3 mb-4 shadow flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg">
                                                Order {orderIndex + 1}:{" "}
                                                {
                                                    (order.Drink as MenuItem)
                                                        ?.name
                                                }
                                            </h3>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEditItem(
                                                            orderIndex,
                                                        )
                                                    }
                                                    className="h-7 px-2 text-xs bg-[#ffe5ea] hover:bg-[#ffd6dd] border-[#9d8189] text-[#6d6875]"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleRemoveItem(
                                                            orderIndex,
                                                        )
                                                    }
                                                    className="h-7 px-2 text-xs"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                        {itemsJSX}
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">
                                                    Quantity:
                                                </span>
                                                <div className="flex items-center gap-1 border border-[#9d8189] rounded-md">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() =>
                                                            handleDecreaseQty(
                                                                orderIndex,
                                                            )
                                                        }
                                                        className="h-6 w-6 p-0 hover:bg-[#ffe5ea] text-[#6d6875]"
                                                        disabled={quantity <= 1}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="px-2 text-sm font-medium min-w-[2rem] text-center">
                                                        {quantity}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() =>
                                                            handleIncreaseQty(
                                                                orderIndex,
                                                            )
                                                        }
                                                        className="h-6 w-6 p-0 hover:bg-[#ffe5ea] text-[#6d6875]"
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="font-semibold">
                                                Total: ${order_price.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                <div className="bg-white/60 rounded-xl p-3 mt-4 shadow-md space-y-1">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax ({(TAX_RATE * 100).toFixed(2)}%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-xl font-semibold mb-3">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button
                        className="w-full bg-[#6d6875] hover:bg-[#564f5a] text-white font-semibold py-2 rounded-xl transition"
                        onClick={checkoutOrder}
                    >
                        Checkout
                    </button>
                </div>
            </aside>
        </div>
    );
}
