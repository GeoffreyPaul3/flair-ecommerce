import { NextResponse } from "next/server";
import { validateCartItems } from "use-shopping-cart/utilities";
import { inventory } from "@/config/inventory";
import { initiatePayChanguPayment } from "@/lib/paychangu";

export async function POST(request: Request) {
  try {
    const cartDetails = await request.json();
    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Validate the cart and calculate total amount
    const lineItems = validateCartItems(inventory, cartDetails);
    const totalAmount = lineItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // Ensure total amount is positive
    if (totalAmount <= 0) {
      return NextResponse.json({ error: "Total amount must be greater than zero." }, { status: 400 });
    }

    // Ensure all necessary customer details are present
    if (!cartDetails.firstName || !cartDetails.email) {
      return NextResponse.json({ error: "Missing customer information" }, { status: 400 });
    }

    // Create a unique transaction reference
    const txRef = `tx_${Math.random().toString(36).substring(2, 15)}`;

    // Prepare payment payload for PayChangu
    const paymentPayload = {
      amount: totalAmount.toString(),  // PayChangu expects the amount as a string
      currency: "USD",  // Or "MWK" based on your preference
      tx_ref: txRef,  // Unique transaction reference
      first_name: cartDetails.firstName,  // Customer first name
      last_name: cartDetails.lastName || "",  // Optional customer last name
      callback_url: `${origin}/api/paychangu-callback?tx_ref=${txRef}`,  // URL to handle IPN callbacks from PayChangu
      return_url: `${origin}/cart`,  // URL to redirect users in case of cancellation
      email: cartDetails.email,  // Customer email for transaction confirmation
    };

    // Initiate payment via PayChangu
    const payChanguResponse = await initiatePayChanguPayment(paymentPayload);

    if (payChanguResponse.status === 200) {
      // Redirect to success page with the transaction reference
      return NextResponse.json({
        success: true,
        redirectUrl: `${origin}/success?tx_ref=${txRef}`,
      });
    } else {
      // Handle error returned by PayChangu
      return NextResponse.json({ error: "Payment initiation failed: " + payChanguResponse.error }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Payment initiation error:", error);
    return NextResponse.json({ error: "Something went wrong with the payment." }, { status: 500 });
  }
}
