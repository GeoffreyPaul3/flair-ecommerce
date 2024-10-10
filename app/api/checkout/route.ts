import { NextRequest, NextResponse } from "next/server"
import { clerkClient, getAuth } from "@clerk/nextjs/server"

interface CartItem {
  price: number // Ensure this is already in MWK (integer)
  quantity: number
}

const generateTxRef = () => `TX-${Math.floor(Math.random() * 1000000000) + 1}`

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
    const amountInMWK = Object.values(cartDetails).reduce((total, item) => {
      // Ensure item.price is already in MWK without decimal conversions
      return total + Math.round(item.price) * item.quantity // Round to ensure it's an integer
    }, 0)

    // Convert amount to the smallest unit (MWK cents)
    const amount = amountInMWK * 100 // Multiply by 100 to convert to cents

    // Log the calculated amount for debugging
    console.log("Calculated amount for PayChangu:", amount)

    // Ensure the amount is positive and does not exceed PayChangu's limit
    if (amount <= 0 || amount > 178400000) {
      // Update the limit to account for cents
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 })
    }

    // Prepare request body for PayChangu API
    const paymentData = {
      amount,
      currency: "MWK",
      email: user.emailAddresses[0]?.emailAddress || "email@example.com", // Use real customer email
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
