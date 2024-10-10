import { NextRequest, NextResponse } from "next/server"
import { clerkClient, getAuth } from "@clerk/nextjs/server"

// Import Clerk's client

interface CartItem {
  price: number
  quantity: number
}

const generateTxRef = () => `TX-${Math.floor(Math.random() * 10000000000)}`

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionId } = getAuth(req) // Get Clerk session data

    // Ensure user is authenticated
    if (!userId || !sessionId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      )
    }

    // Fetch the full user object using the userId
    const user = await clerkClient.users.getUser(userId)

    const cartDetails: Record<string, CartItem> = await req.json()
    const tx_ref = generateTxRef()

    // Calculate total amount from cart details
    const amount = Object.values(cartDetails).reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    // Ensure the amount is positive
    if (amount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 })
    }

    // Prepare request body for PayChangu API
    const paymentData = {
      amount,
      currency: "MWK",
      email: user.emailAddresses[0]?.emailAddress || "noemail@example.com", // Use real customer email
      first_name: user.firstName || "N/A", // Use real customer first name
      last_name: user.lastName || "N/A", // Use real customer last name
      callback_url: `${process.env.NEXT_PUBLIC_CALLBACK_URL}/success?tx_ref=${tx_ref}`,
      return_url: `${process.env.NEXT_PUBLIC_RETURN_URL}/payment-failed`,
      tx_ref,
      customization: {
        title: "Order Payment",
        description: "Payment for items in cart",
      },
    }

    // Send the payment request to PayChangu
    const response = await fetch("https://api.paychangu.com/payment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    })

    const data = await response.json()

    // Handle success and error responses from PayChangu
    if (response.ok && data.status === "success") {
      return NextResponse.json({ url: data.data.checkout_url })
    } else {
      console.error("PayChangu error response:", data)
      return NextResponse.json(
        { message: data.message || "Payment failed" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error creating PayChangu transaction:", error)
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    )
  }
}
