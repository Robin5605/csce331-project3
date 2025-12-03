"use client";

import MenuBoard from "@/components/MenuBoard";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Home() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-zinc-50 pb-10 font-sans dark:bg-zinc-950">
            {/* NAVBAR */}
            <nav className="flex w-full items-center justify-start border-b border-zinc-200 bg-white/80 px-6 py-3 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/70">
                <div className="flex items-center gap-3">
                    <Image src="/sharetea.png" alt="ShareTea" width={120} height={30} /> 
                </div>
            </nav>

            {/* PAGE CONTENT */}
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 md:flex-row md:items-center md:justify-between">
                {/* Left: Branding + intro + menu preview */}
                <section className="flex flex-1 flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            ShareTea Ordering System
                        </h1>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                            A unified interface for staff and customers. Cashiers and managers can
                            log in to manage orders and inventory, while customers can browse the
                            digital menu and place orders easily.
                        </p>
                    </div>

                    {/* Menu preview card */}
                    <div className="mt-2 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
                        <button
                                onClick={() => router.push("/menuBoard")}
                                className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md active:translate-y-0 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                        >Menu Board</button>
                    </div>
                </section>

                {/* Right: Action card */}
                <section className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white/95 p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900/95">
                        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Continue
                        </h2>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            Select how you want to use the system.
                        </p>

                        <div className="mt-6 flex flex-col gap-3">
                            {/* Staff login */}
                            <button
                                onClick={() => router.push("/loginPage")}
                                className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md active:translate-y-0 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                            >
                                Login for Cashier or Manager
                                <p className="mt-1 text-[11px] font-normal text-zinc-300 dark:text-zinc-300/90">
                                    Enter staff PIN to access POS or dashboard.
                                </p>
                            </button>

                            {/* Customer guest order */}
                            <button
                                onClick={() => router.push("/customerOrderTest")}
                                className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md active:translate-y-0"
                            >
                                Customer (Guest)
                                <p className="mt-1 text-[11px] font-normal text-emerald-100/90">
                                    Browse the menu and order.
                                </p>
                            </button>

                            {/* Google sign-in */}
                            <button
                                onClick={() =>
                                    signIn("google", {
                                        callbackUrl: "/customerOrderTest",
                                    })
                                }
                                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md active:translate-y-0 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
                            >
                                Sign in with Google
                                <p className="mt-1 text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
                                    Save your preferences and history.
                                </p>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
