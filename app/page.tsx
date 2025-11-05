import Link from "next/link";
import Image from "next/image";
import ItemCard from "./ItemCard";

export default function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-6">
            <ItemCard itemName="Strawberries"/>
            <ItemCard itemName="Strawberries Muffins"/>
        </div>
    );
}
