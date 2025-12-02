"use client";

import MenuBoard from "@/components/MenuBoard";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Home() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-zinc-950">
            <main className="flex w-full max-w-6xl flex-col gap-10 py-10 md:flex-row md:items-center md:justify-between">
                {/* Left: Branding + intro + menu preview */}
                <section className="flex flex-1 flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            ShareTea Ordering System
                        </h1>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                            A unified interface for staff and customers. Cashiers and managers can
                            log in to manage orders and inventory, while customers can browse the
                            digital menu and place their orders with ease.
                        </p>
                    </div>

                    <div className="mt-2 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
                        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            Menu Preview
                        </h2>
                        <MenuBoard />
                    </div>
                </section>

                {/* Right: Action card */}
                <section className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white/95 p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900/95">
                        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Continue
                        </h2>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            Choose the option that best matches how you&apos;re using the system.
                        </p>

                        <div className="mt-6 flex flex-col gap-3">
                            {/* Staff login */}
                            <button
                                onClick={() => router.push("/loginPage")}
                                className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md active:translate-y-0 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                            >
                                Login for Cashier or Manager
                                <p className="mt-1 text-[11px] font-normal text-zinc-300 dark:text-zinc-300/90">
                                    Staff PIN login to access POS features and manager dashboard.
                                </p>
                            </button>

                            {/* Customer guest order */}
                            <button
                                onClick={() => router.push("/customerOrderTest")}
                                className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md active:translate-y-0"
                            >
                                Customer (Guest)
                                <p className="mt-1 text-[11px] font-normal text-emerald-100/95">
                                    Browse the digital menu and place an order without signing in.
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
                                    Use your Google account to save preferences and order history.
                                </p>
                            </button>
                        </div>

                        <p className="mt-4 text-[11px] text-zinc-400 dark:text-zinc-500">
                            Designed for both front-counter terminals and self-service kiosks.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
