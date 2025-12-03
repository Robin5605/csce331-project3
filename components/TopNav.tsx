"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // if you don't have cn, remove and inline classes

type TopNavVariant = "manager" | "cashier" | "kiosk";

interface TopNavProps {
    subtitle?: string;
    /** Which surface is this? (controls accent + label) */
    variant?: TopNavVariant;
    /** Hide the "Back to Home" button (e.g., on kiosk) */
    hideBackButton?: boolean;
}

const variantLabel: Record<TopNavVariant, string> = {
    manager: "Manager Dashboard",
    cashier: "Cashier POS",
    kiosk: "Self-Service Kiosk",
};

export default function TopNav({
    subtitle,
    variant = "manager",
    hideBackButton = false,
}: TopNavProps) {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-6 py-3 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
            {/* Left: Logo + brand */}
            <div className="flex items-center gap-3">
                <Image
                    src="/sharetea.png"
                    alt="ShareTea"
                    width={120}
                    height={30}
                    className="h-auto w-[120px]"
                />
                <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                        {variantLabel[variant]}
                    </span>
                    {subtitle && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {subtitle}
                        </span>
                    )}
                </div>
            </div>

            {/* Right: Back / session controls */}
            <div className="flex items-center gap-3">
                {/* You can add a user indicator, store name, etc. here later */}

                {!hideBackButton && (
                    <button
                        onClick={() => router.push("/")}
                        className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                        Back to Home
                    </button>
                )}
            </div>
        </header>
    );
}
