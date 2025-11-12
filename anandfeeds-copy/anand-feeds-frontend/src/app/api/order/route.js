import { StandardCheckoutClient, StandardCheckoutPayRequest, Env } from 'pg-sdk-node';
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import axios from "axios";

// Initialize the PhonePe SDK Client
const clientId = process.env.PHONEPE_MERCHANT_ID;
const clientSecret = process.env.PHONEPE_SALT_KEY;
const clientVersion = 1; // Change if your version is different
const env = Env.PRODUCTION; // Switch to SANDBOX if needed

const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

export async function POST(req) {
    try {
        const reqData = await req.json();

        const merchantOrderId = reqData.transactionId || randomUUID();

        // Fetch cart items to calculate total amount
        const cart = await axios.post(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/cart/user`,
            { email: reqData.email }
        );

        const cartItems = cart.data.cartItems;
        console.log(cartItems);

        let total = 0;
        cartItems.map((item) => {
            total += item.productPrice * item.quantity;
        });

        const amount = total * 100; // amount in paise

        // Prepare the payment request
        const redirectUrl = `https://anandfeeds.com/status?id=${merchantOrderId}`;
        
        const request = StandardCheckoutPayRequest.builder()
            .merchantOrderId(merchantOrderId)
            .amount(amount)
            .redirectUrl(redirectUrl)
            .build();

        // Call the pay API using SDK
        const response = await client.pay(request);

        console.log("PhonePe SDK response:", response);

        // Save the order in your database
        await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/orders`, {
            ...reqData,
            merchantTransactionId: merchantOrderId,
            amount: total,
        });

        // Return the checkoutPageUrl to frontend
        return NextResponse.json({
            success: true,
            checkoutPageUrl: response.redirectUrl,
        });

    } catch (error) {
        console.error("PhonePe Payment Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
