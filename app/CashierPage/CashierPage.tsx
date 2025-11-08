"use client"

import { ReactNode, useState, JSX } from "react";
import Image from "next/image"

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
} from "@/components/ui/alert-dialog"
import CustomizationCard from "@/components/CustomizationCard";

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
    { id: 4, name: "Berry Lychee Burst", stock: 74, cost: 6.25 }
  ],
  "Ice Blended": [
    { id: 7, name: "Oreo w/ Pearl", stock: 75, cost: 6.75 },
    { id: 8, name: "Taro w/ Pudding", stock: 75, cost: 6.95 },
    { id: 9, name: "Thai Tea w/ Pearl", stock: 75, cost: 6.95 },
    { id: 10, name: "Coffee w/ Ice Cream", stock: 75, cost: 6.95 },
    { id: 11, name: "Mango w/ Ice Cream", stock: 75, cost: 6.95 },
    { id: 12, name: "Strawberry w/ Ice Cream", stock: 75, cost: 6.95 }
  ],
  "Milky": [
    { id: 13, name: "Clasic Pearl Milk Tea", stock: 75, cost: 5.8 },
    { id: 14, name: "Honey Pearl Milk Tea", stock: 75, cost: 6.0 },
    { id: 15, name: "Coffe Creama", stock: 75, cost: 6.5 },
    { id: 16, name: "Hokaido Pearl Milk Tea", stock: 75, cost: 6.25 },
    { id: 17, name: "Mango Green Milk Tea", stock: 75, cost: 6.5 },
    { id: 18, name: "Golden Retriever", stock: 75, cost: 6.75 }
  ],
  "Non Caffenated": [
    { id: 19, name: "Tiger Boba", stock: 75, cost: 6.5 },
    { id: 20, name: "Strawberry Coconut", stock: 75, cost: 6.5 },
    { id: 21, name: "Strawberry Coconut Ice Blended", stock: 75, cost: 6.5 },
    { id: 22, name: "Halo Halo", stock: 75, cost: 6.95 },
    { id: 23, name: "Wintermellon Lemonade", stock: 75, cost: 5.8 },
    { id: 24, name: "Wintermellon w/ Fresh Milk", stock: 75, cost: 5.2 }
  ],
  "Fall Seasonals": [
    { id: 25, name: "Red Bean Matcha", stock: 75, cost: 6.95 },
    { id: 26, name: "Pumpkin Chai", stock: 75, cost: 6.95 },
    { id: 27, name: "Honey and Cinnamon Milk Tea", stock: 75, cost: 6.95 },
    { id: 31, name: "temp", stock: 99, cost: 5.0 },
    { id: 32, name: "temp2", stock: 99, cost: 1.0 }
  ],
  "Uncategorized": [
    { id: 33, name: "New Item", stock: 0, cost: 0 },
    { id: 34, name: "New Item", stock: 0, cost: 0 },
    { id: 35, name: "New Item", stock: 0, cost: 0 }
  ]
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


export default function CashierPage() {
    //Sets default selection for customization options
    const defaultCustomizations = {
        Size: "Medium Cups",
        Ice: "100%",
        Boba: "None",
        Jelly: "None",
        Tea: "Black Tea",
        Toppings: [],
    }

    //Serves as the state used for showing the Customization page
    const [isCustomizationOpen, setIsCustomizationOpen] = useState<boolean>(false);
    const [selectedCategory, setSelectedCateory] = useState<string>("Fruit Tea");
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [selectedCustomizationOptions, setSelectedCustomizationOptions] = useState<Record<string, string | string[]>>(defaultCustomizations);
    const [curOrders, setCurOrders] = useState<Record<string, string | string[] | MenuItem | null>[]>([])
    let totalCost = 0;

    //Handles whenever a MenuItem is clicked to bring up the customization menu
    const menuItemClicked = (item: MenuItem) => {
        setSelectedCustomizationOptions(defaultCustomizations); //Makes sure to reset the selected options
        setSelectedItem(item);
        setIsCustomizationOpen(true);
    }

    //Handles whenever a CustomizationCard is clicked in order to select it for categories with single select
    const customizationCardClicked = (name: string, category: string) => {
    setSelectedCustomizationOptions({
        ...selectedCustomizationOptions,
        [category]: name,
    });
    };

    //Handles whenever a CustomizationCard is clicked in order to select it for categories with multi-select
    const customizationCardClickedMultipleSelections = (
        name: string,
        category: string,
        isSelected: boolean
        ) => {
            setSelectedCustomizationOptions((prev) => {
                const currentValue = prev[category] as string[];

                return {
                    ...prev,
                    [category]: isSelected
                        ? currentValue.filter((item) => item !== name) // remove
                        : [...currentValue, name],                    // add
                };
            });
    };

    // Handles whenever an order is finalized on the customization side
    const submitOrder = () => {
        // Add the current selection into the total orders
        const order = {
            ...selectedCustomizationOptions,
            Drink: selectedItem
        }
        setCurOrders([...curOrders, order]);
        setIsCustomizationOpen(false);
    };


    //Used as a button for each category in the Cashier page
    const Category = ({ name }: {name: string}) => {
       return(
            <div 
                className="shadow-lg w-[90%] h-15 flex justify-center items-center bg-[#9d8189] rounded-md transform transition-transform duration-100 hover:scale-105"
                onClick={() => setSelectedCateory(name)}
            >
                {name}
            </div>
       )
    }

    //Used as a button for each category in the Customization page
    const CustomizationCategory = ({ name, children }: {name: string, children?: ReactNode;}) => {
        return(
            <div className="w-full">
                <h2 className="font-semibold text-xl mt-3 mb-2">{name}</h2>
                <div className="flex gap-8">
                    {children}
                </div>
            </div>
       )
    }

    //Used to contain items for each customization category and handle filtering
    const CustomizationData = (
    {
        isOneItem = true,
        allowsMultipleSelections = false,
        toFilterBy = "",
        category,
    }: {
        isOneItem: boolean;
        allowsMultipleSelections: boolean;
        toFilterBy: string;
        category: string;
    }
    ) => {
        const itemsToIgnore = ["napkins", "straws", "seal", "bag"];

        interface OptionItem {
            name: string;
            is_disabled: boolean;
        }

        
        const options: OptionItem[] = 
            //Checks if the category is for one item (ex: Ice) or multiple items (ex: Boba)
            //When the API is implemented, we can associate each item with a category and remove all this
            isOneItem 
            ? ["0%", "25%", "50%", "75%", "100%"].map((label) => ({ //If it is just one item, we just have the customization be the amount of said item
                name: label,
                is_disabled: false,
                }))
            : category === "Toppings" //The toppings category has every item that is not tea, boba, jelly, or ice/sugar
            ? inventory
                .filter((i) => {
                    const n = i.name.trim().toLowerCase();
                    return (
                    !["cups", "tea", "boba", "jelly", "ice", "sugar"].
                        some((s) => n.endsWith(s)) && !itemsToIgnore.includes(n) //Performs the exclusion of the specific item types
                    );
                })
                .map((i) => ({
                    name: i.name,
                    is_disabled: i.stock < 1,
                }))
            : inventory //Here we assume it's a normal category otherwise (tea, boba, jelly, ice/sugar)
                .filter((i) =>
                    i.name.trim().toLowerCase().endsWith(toFilterBy.trim().toLowerCase()) //Identifies the item type by the last word in its string (ex: Popping Boba -> Boba)
                )
                .map((i) => ({
                    name: i.name,
                    is_disabled: i.stock < 1,
                }));

        return (
            <div className="flex flex-wrap gap-8">
            {options.map((item) => {
                const isSelected: boolean = 
                            (allowsMultipleSelections)
                                ? selectedCustomizationOptions[category].includes(item.name)
                                : item.name === selectedCustomizationOptions[category]
                return(
                    <CustomizationCard
                        key={`customizationcard-${category}-${item.name}`}
                        itemName={item.name}
                        isDisabled={item.is_disabled}
                        isSelected={isSelected}
                        whenClicked={
                            (allowsMultipleSelections)
                            ? () => customizationCardClickedMultipleSelections(item.name, category, isSelected)
                            : () => customizationCardClicked(item.name, category)
                        }
                    />
                )
            })}
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#ffddd233] font-sans dark:bg-black gap-6 justify-between">
            <AlertDialog open={isCustomizationOpen} onOpenChange={setIsCustomizationOpen}>
                {/* The reason we override small is because that's the only way we can adjust the width of the AlertDialog */}
                <AlertDialogContent className="w-[90vw] max-w-none sm:max-w-4xl p-8 "> 
                    <AlertDialogTitle className="font-semibold text-3xl">Customize Order</AlertDialogTitle>
                        
                       <div className="max-h-[800px] overflow-y-auto pr-2">
                            <CustomizationCategory name="Size">
                                <CustomizationData isOneItem={false} toFilterBy="cups" category="Size" allowsMultipleSelections={false}/>
                            </CustomizationCategory>

                            <CustomizationCategory name="Ice">
                                <CustomizationData isOneItem={true} toFilterBy="ice" category="Ice" allowsMultipleSelections={false}/>
                            </CustomizationCategory>

                            <CustomizationCategory name="Tea">
                                <CustomizationData isOneItem={false} toFilterBy="tea" category="Tea" allowsMultipleSelections={false}/>
                            </CustomizationCategory>

                            <CustomizationCategory name="Boba">
                                <CustomizationData isOneItem={false} toFilterBy="boba" category="Boba" allowsMultipleSelections={false}/>
                            </CustomizationCategory>

                            <CustomizationCategory name="Jelly">
                                <CustomizationData isOneItem={false} toFilterBy="jelly" category="Jelly" allowsMultipleSelections={false}/>
                            </CustomizationCategory>

                            <CustomizationCategory name="Toppings">
                                <CustomizationData isOneItem={false} toFilterBy="topping" category="Toppings" allowsMultipleSelections={true}/>
                            </CustomizationCategory>
                        </div>


                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsCustomizationOpen(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => submitOrder()}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <aside className="w-[300px] h-screen bg-gradient-to-b from-[#9d8189] to-[#ffe5d9] flex-col justify-center">
            <h2 className="font-semibold text-3xl mt-3 mb-10 text-center">Categories</h2>
            <div className="flex flex-col items-center w-full gap-10">
                {Object.entries(menuData).map(([category]) => (
                <Category key={category} name={category} />
                ))}
            </div>
            </aside>  

            <main className="flex-1 flex items-start justify-center mt-10">
                <div className="flex flex-wrap gap-16 justify-around">
                    {
                        menuData[selectedCategory].map((itemData) => {
                            return(
                                <ItemCard
                                    itemName={itemData.name}
                                    whenClicked={() => menuItemClicked(itemData)}
                                />
                            )
                        })
                    }
                </div>
            </main>

            <aside className="w-[300px] h-screen bg-gradient-to-b from-[#9d8189] to-[#ffe5d9] flex flex-col justify-between p-4">
            <div>
                <h2 className="font-semibold text-3xl text-center mt-3 mb-4">Checkout</h2>
                <div className="bg-white/40 rounded-xl p-3 shadow-inner max-h-[60vh] overflow-y-auto">
                    {
                        curOrders.map((order, orderIndex) => {
                            let order_price = 0
                            const itemsJSX: JSX.Element[] = [];
                            Object.entries(order).forEach(([key, value]) => {
                                //Doesn't show if not added
                                if(value === 'None' || value === null || value.length === 0){
                                    return
                                } 

                                //Handles drinks
                                if(key.toLowerCase() === 'drink'){
                                    order_price += value.cost
                                    return
                                }
                                
                                //Handles these differently since their values aren't items in the ingreidents table
                                else if (key === "Ice" || key === "Sugar") {
                                    itemsJSX.push(
                                        <div key={`suborder-${key}-${value}-single`} className="bg-[#FFCAD4] px-2 py-1 rounded mb-2">
                                            {key}: {value}
                                        </div>
                                    )
                                } 
                                
                                //Makes sure to traverse the array and add each item
                                else if (Array.isArray(value)){
                                    value.forEach((o : string) => {
                                        const item = inventory.find(
                                            (item) => item.name.trim().toLowerCase() === o.trim().toLowerCase()
                                        );

                                        const price = item ? item.cost : 0; //Tenary is for handling null values
                                        order_price += price
                                        itemsJSX.push(
                                            <div key={`suborder-${key}-${o}-single`} className="bg-[#FFCAD4] px-2 py-1 rounded mb-2">
                                                {o} {price !== 0 ? `($${price.toFixed(2)})` : ""}
                                            </div>
                                        )
                                    })
                                } 
                                
                                //Default behavior
                                else {
                                    const item = inventory.find(
                                        (item) => item.name.trim().toLowerCase() === value.trim().toLowerCase()
                                    );

                                    const price = item ? item.cost : 0; //Tenary is for handling null values
                                    order_price += price

                                    itemsJSX.push(
                                        <div key={`suborder-${key}-${value}-single`} className="bg-[#FFCAD4] px-2 py-1 rounded mb-2">
                                            {value} {price !== 0 ? `($${price.toFixed(2)})` : ""}
                                        </div>
                                    )
                                }    
                            })
                            totalCost += order_price
                            return(
                                <div key={`order-${orderIndex}`} className="bg-[#fffaf8] rounded-xl p-3 mb-4 shadow flex-col">
                                    <h3 className="font-semibold text-lg mb-2">Order {orderIndex + 1}: {order.Drink.name}</h3>
                                    {itemsJSX}
                                    Total: {order_price}$
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="bg-white/60 rounded-xl p-3 mt-4 shadow-md">
                <div className="flex justify-between text-xl font-semibold mb-3">
                <span>Total:</span>
                <span>{totalCost.toFixed(2)}$</span>
                </div>
                <button className="w-full bg-[#6d6875] hover:bg-[#564f5a] text-white font-semibold py-2 rounded-xl transition">
                    Checkout
                </button>
            </div>
            </aside>
        </div>
    );
}
