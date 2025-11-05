"use client"

import { useState } from "react"; 
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

export default function CashierPage() {
    //Serves as the state used for showing the Customization page
    const [isCustomizationOpen, setIsCustomizationOpen] = useState(false)

    //Used as a button for each cateogry in the Cashier page
    const Category = ({ name }: {name: string}) => {
       return(
        <div className="shadow-lg w-[90%] h-15 flex justify-center items-center bg-gray-500 rounded-md transform transition-transform duration-100 hover:scale-105">
            {name}
        </div>
       )
    }

    //Used as a button for each cateogry in the Customization page
    const CustomizationCategory = ({ name }: {name: string}) => {
        const [selection, setSelection] = useState("")

        return(
            <div className="w-full">
                <h2 className="font-semibold text-xl mt-3 mb-2">{name}</h2>
                <div className="flex gap-8">
                    <CustomizationCard itemName="100%" whenClicked={setSelection} categorySelection={selection}/>
                    <CustomizationCard itemName="50%" whenClicked={setSelection} categorySelection={selection}/>
                    <CustomizationCard itemName="0%" whenClicked={setSelection} categorySelection={selection}/>
                </div>
            </div>
       )
    }

    return (
        <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black gap-6 justify-between">
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
        <aside className="w-[300px] h-screen bg-zinc-400 flex-col justify-center">
            <h2 className="font-semibold text-3xl mt-3 mb-10 text-center">Categories</h2>
            <div className="flex flex-col items-center w-full gap-10">
                <Category name={"Drinks"}/>
                <Category name={"Bubble"}/>
            </div>
        </aside>    

        <main className="flex-1 flex items-start justify-center mt-10">
            <div className="flex flex-wrap gap-16">
                <ItemCard itemName="Strawberries" whenClicked={() => setIsCustomizationOpen(true)}/>
                <ItemCard itemName="Strawberries Muffins" whenClicked={() => setIsCustomizationOpen(true)}/>
            </div>
        </main>

        <aside className="w-[300px] h-screen bg-zinc-400 flex justify-center">
            <h2 className="font-semibold text-xl mt-3">Checkout</h2>
        </aside>
        </div>
    );
}
