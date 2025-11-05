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

export default function CashierPage() {
    //Serves as the state used for showing the Customization page
    const [isCustomizationOpen, setIsCustomizationOpen] = useState(false)

    const Category = ({ name }: {name: string}) => {
       return(
        <div className="shadow-lg w-[90%] h-15 flex justify-center items-center bg-gray-500 rounded-md transform transition-transform duration-100 hover:scale-105">
            {name}
        </div>
       )
    }
    return (
        <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black gap-6 justify-between">
            <AlertDialog open={isCustomizationOpen} onOpenChange={setIsCustomizationOpen}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
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
