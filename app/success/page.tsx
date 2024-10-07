import Link from "next/link"
import { useEffect, useState } from "react"

// Fetch order data from the server (assuming you store orders in your DB)
async function fetchOrderDetails(tx_ref: string) {
  const response = await fetch(`/api/orders/${tx_ref}`)
  const data = await response.json()
  return data
}

interface Props {
  searchParams: {
    tx_ref?: string // PayChangu transaction reference
  }
}

export default function Page({ searchParams }: Props) {
  const tx_ref = searchParams?.tx_ref ?? ""
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    if (tx_ref) {
      fetchOrderDetails(tx_ref).then((data) => {
        setOrderDetails(data)
      })
    }
  }, [tx_ref])

  if (!orderDetails) {
    return (
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p>Loading order details...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Display order details */}
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p>Thank you for your purchase, {orderDetails?.customer_name}!</p>
        <p>Transaction Reference: {orderDetails?.tx_ref}</p>
        <p>Total Amount: {orderDetails?.amount} MWK</p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </Link>
          <a href="#" className="text-sm font-semibold">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  )
}
