import { NextResponse } from "next/server";
import {
    fetch_categories,
} from "@/lib/db";

export async function GET() {
    const rows = await fetch_categories();
    return NextResponse.json(rows);
}