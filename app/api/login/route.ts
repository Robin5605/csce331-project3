import { NextResponse } from "next/server";
import {fetch_login_information} from "@/lib/db";

/** 
 * GET request for login verification
 * @returns NextResponse indicating success or failure
 *  */
export async function POST(request: Request) {
  const { pin } = await request.json();
  const loginInfo = await fetch_login_information(pin);

  if (loginInfo.length === 0) {
    return NextResponse.json({ message: "Invalid PIN" }, { status: 401 });
  }

  return NextResponse.json(loginInfo[0]);
}