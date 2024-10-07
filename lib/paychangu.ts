import axios from "axios"

// Define payload type for PayChangu
interface PayChanguPayload {
  amount: string
  currency: string
  tx_ref: string
  first_name: string
  last_name?: string
  email?: string
  callback_url: string
  return_url: string
  meta?: string
  uuid?: string
  customization?: {
    title?: string
    description?: string
    logo?: string
  }
}

// Define response type from PayChangu
interface PayChanguResponse {
  status: string
  message: string
  data: {
    payment_link: string
    tx_ref: string
  }
}

export async function initiatePayChanguPayment(payload: PayChanguPayload): Promise<PayChanguResponse> {
  const API_URL = "https://api.paychangu.com/payment"
  const API_KEY = process.env.PAYCHANGU_SECRET_KEY

  try {
    const response = await axios.post<PayChanguResponse>(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error: any) {
    // Detailed logging of error responses
    if (error.response) {
      console.error("PayChangu API error response:", error.response.data)
    } else if (error.request) {
      console.error("No response received from PayChangu API:", error.request)
    } else {
      console.error("Error setting up the PayChangu API request:", error.message)
    }
    throw new Error("Failed to initiate PayChangu payment")
  }
}
import axios from "axios"

// Define payload type for PayChangu
interface PayChanguPayload {
  amount: string
  currency: string
  tx_ref: string
  first_name: string
  last_name?: string
  email?: string
  callback_url: string
  return_url: string
  meta?: string
  uuid?: string
  customization?: {
    title?: string
    description?: string
    logo?: string
  }
}

// Define response type from PayChangu
interface PayChanguResponse {
  status: string
  message: string
  data: {
    payment_link: string
    tx_ref: string
  }
}

export async function initiatePayChanguPayment(payload: PayChanguPayload): Promise<PayChanguResponse> {
  const API_URL = "https://api.paychangu.com/payment"
  const API_KEY = process.env.PAYCHANGU_SECRET_KEY

  try {
    const response = await axios.post<PayChanguResponse>(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error: any) {
    // Detailed logging of error responses
    if (error.response) {
      console.error("PayChangu API error response:", error.response.data)
    } else if (error.request) {
      console.error("No response received from PayChangu API:", error.request)
    } else {
      console.error("Error setting up the PayChangu API request:", error.message)
    }
    throw new Error("Failed to initiate PayChangu payment")
  }
}
