import { NextRequest, NextResponse } from 'next/server';

// Define the structure of the cart item
interface CartItem {
  price: number;
  quantity: number;
}

// Utility function to generate a random transaction reference
const generateTxRef = () => `TX-${Math.floor(Math.random() * 10000000000)}`;

// Named export for the POST method
export async function POST(req: NextRequest) {
  try {
    const cartDetails: Record<string, CartItem> = await req.json(); // Use req.json() for parsing the body
    const tx_ref = generateTxRef();

    // Calculate total amount from cart details with proper typing
    const amount = Object.values(cartDetails).reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0 as number); // Ensure the initial total is a number

    // Ensure amount is positive
    if (amount <= 0) {
      return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
    }

    // Prepare request body for PayChangu API
    const paymentData = {
      amount,
      currency: "MWK", // or your desired currency
      email: "customer@example.com", // replace with actual customer email
      first_name: "John", // replace with actual first name
      last_name: "Doe", // replace with actual last name
      callback_url: `${process.env.NEXT_PUBLIC_CALLBACK_URL}/success?tx_ref=${tx_ref}`,
      return_url: `${process.env.NEXT_PUBLIC_RETURN_URL}/payment-failed`,
      tx_ref,
      customization: {
        title: "Order Payment",
        description: "Payment for items in cart",
      },
    };

    // Send the payment request to PayChangu
    const response = await fetch("https://api.paychangu.com/payment", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`, // Use secure PayChangu secret key
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    // Handle success and error responses from PayChangu
    if (response.ok && data.status === "success") {
      return NextResponse.json({ url: data.data.checkout_url });
    } else {
      console.error("PayChangu error response:", data);
      return NextResponse.json({ message: data.message || 'Payment failed' }, { status: 400 });
    }
  } catch (error) {
    console.error("Error creating PayChangu transaction:", error);
    return NextResponse.json({ message: "Server error. Please try again later." }, { status: 500 });
  }
}
