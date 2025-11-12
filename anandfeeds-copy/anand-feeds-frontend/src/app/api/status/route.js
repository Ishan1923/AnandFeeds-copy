import { NextResponse } from "next/server";
import { StandardCheckoutClient, Env } from "pg-sdk-node";

const clientId = process.env.PHONEPE_MERCHANT_ID;
const clientSecret = process.env.PHONEPE_SALT_KEY;
const clientVersion = 1; // Change if your version is different
const env = Env.PRODUCTION; // Switch to SANDBOX if needed

const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

export async function GET(req) {
    console.log("Received request to check payment status");
    try {
        const url = new URL(req.url);
        const merchantTransactionId = url.searchParams.get("id");
        console.log("Merchant Transaction ID from URL:", merchantTransactionId);

        if (!merchantTransactionId) {
            return NextResponse.json({ error: "Transaction ID missing" }, { status: 400 });
        }

        console.log("Merchant Transaction ID:", merchantTransactionId);

        // Fetch payment status
        const paymentStatus = await client.getOrderStatus( merchantTransactionId);

        console.log("Payment status response:", paymentStatus);     

        const state = paymentStatus.state;

        if (state === "COMPLETED") {
            try {
                // Update the order in your DB
                const updateResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/orders/${merchantTransactionId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ responseCode: "SUCCESS" }),
                    }
                );
                const updateData = await updateResponse.json();
                console.log("Order update response:", updateData);
            } catch (error) {
                console.error("Error updating order:", error);
                return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
            }

            // Redirect to Success page
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            // Redirect to Failure page
            return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error in status check:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
