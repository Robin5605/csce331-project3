"use client"

import { useState } from "react";
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


export default function CashierPage() {
    //Serves as the state used for showing the Customization page
    const [isCustomizationOpen, setIsCustomizationOpen] = useState<boolean>(false);
    const [selectedCategory, setSelectedCateory] = useState<string>("Fruit Tea");
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

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
    const CustomizationCategory = ({ name }: {name: string}) => {
        const [selection, setSelection] = useState("");
        

        return(
            <div className="w-full">
                <h2 className="font-semibold text-xl mt-3 mb-2">{name}</h2>
                <div className="flex gap-8">
                    {
                        <p>BOLLYWOOD</p>
                    }
                </div>
            </div>
       )
    }

    //Handles whenever a MenuItem is clicked to bring up the customization menu
    const menuItemClicked = (item: MenuItem) => {
        setSelectedItem(item)
        setIsCustomizationOpen(true)
    }

    return (
        <div className="flex min-h-screen bg-[#ffddd233] font-sans dark:bg-black gap-6 justify-between">
            <AlertDialog open={isCustomizationOpen} onOpenChange={setIsCustomizationOpen}>
                {/* The reason we override small is because that's the only way we can adjust the width of the AlertDialog */}
                <AlertDialogContent className="w-[90vw] max-w-none sm:max-w-2xl p-8 "> 
                    <AlertDialogTitle className="font-semibold text-3xl">Customize Order</AlertDialogTitle>
                        <CustomizationCategory name={"Ice"}/>
                        <CustomizationCategory name={"Toppings"}/>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsCustomizationOpen(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => setIsCustomizationOpen(false)}>
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

            <aside className="w-[300px] h-screen bg-gradient-to-b from-[#9d8189] to-[#ffe5d9] flex justify-center">
                <h2 className="font-semibold text-3xl mt-3">Checkout</h2>
            </aside>
        </div>
    );
}
