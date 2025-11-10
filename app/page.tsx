"use client";

import Link from "next/link";
import Image from "next/image";
import MenuBoard from "@/components/MenuBoard";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex w-full max-w-3xl flex-col items-center justify-center gap-10 px-8 py-16 sm:items-start">
                {/* Header */}
                <Image
                    className="dark:invert"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={100}
                    height={20}
                    priority
                />

                {/* Menu Board */}
                <MenuBoard />

                {/* Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <button 
                    onClick={() => router.push("/loginPage")}
                    className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700">
                        Login
                    </button>
                    <button className="rounded-full bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700">
                        Customer
                    </button>
                    <button className="rounded-full bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700">
                        Sign in with Google
                    </button>
                </div>
            </main>
        </div>
    );
}
