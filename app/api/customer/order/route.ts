import { NextResponse } from "next/server";
import {
    createOrder,
    CreateOrder,
    getManyIngredientsByIds,
    getMenuItemById,
    insert_into_orders_table,
} from "@/lib/db";
import * as sgMail from "@sendgrid/mail";
import dayjs from "dayjs";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const TAX_RATE = parseFloat(process.env.NEXT_PUBLIC_TAX_RATE ?? "0.0825");

async function buildOrderSummary(order: CreateOrder): Promise<string> {
    let text = `Order placed on ${dayjs().format("MMM D, YYYY h:mm a")}\n`;

    let subtotal = 0;
    for (const drink of order.drinks) {
        const menuItem = await getMenuItemById(drink.id);
        const ingredients = await getManyIngredientsByIds(drink.customizations);
        text += `${menuItem.name} ($${menuItem.cost.toFixed(2)})\n`;
        subtotal += menuItem.cost;

        for (const ingredient of ingredients) {
            text += `${ingredient.name} ($${ingredient.cost.toFixed(2)})\n`;
            subtotal += ingredient.cost;
        }
        text += "-".repeat(20) + "\n";
    }

    const tax = subtotal * TAX_RATE;
    text += `Subtotal: $${subtotal.toFixed(2)}\n`;
    text += `Tax: $${tax.toFixed(2)}\n`;
    text += `Total: $${(subtotal + tax).toFixed(2)}\n`;

    return text;
}

async function sendOrderConfirmationEmail(orderData: CreateOrder, to: string) {
    const res = await sgMail.send({
        to,
        from: "csce331-project3@em8237.robinjs.dev",
        subject: "Order Confirmation",
        text: await buildOrderSummary(orderData),
    });

    console.log(
        `Sent order confirmation email. Response code: ${res[0].statusCode}`,
    );
}

export async function POST(req: Request) {
    const json = await req.json();
    console.log(json);

    // we do this to strip out the extra receiptType field from `json`
    const orderData: CreateOrder = {
        drinks: json.drinks,
        employeeId: json.employeeId,
        paymentMethod: json.paymentMethod,
    };
    await createOrder(orderData);

    console.log("Successfully created order");

    switch (json.receiptType.kind) {
        case "none":
            console.log(`No receipt generated`);
            break;
        case "email":
            await sendOrderConfirmationEmail(orderData, json.receiptType.email);
            break;
        case "text":
            console.warn(
                "WARNING: Text message order confirmation is not implemented.",
            );
            break;
    }

    return NextResponse.json({ status: 204 });
}
