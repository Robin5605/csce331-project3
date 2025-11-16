"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { setMaxIdleHTTPParsers } from "http";



type RestockRow = {
    ingredientName: string;
    stock: number;
}

export default function ReportsPage() {
    const [restockData, setRestockData] = useState<RestockRow[]>([]);
    const [isRestockLoading, setIsRestockLoading] = useState(false);

    async function handleGenerateRestock() {
        try {
            setIsRestockLoading(true);
            
        }
    }

}