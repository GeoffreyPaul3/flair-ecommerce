import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

// Define the structure of the order document
interface Order {
  _id: string;
  customer_name: string;
  tx_ref: string;
  amount: number;
}

// Function to fetch order details from Sanity
async function getOrderDetails(tx_ref: string): Promise<Order | null> {
  const query = `*[_type == "order" && tx_ref == $tx_ref][0] {
    _id,
    customer_name,
    tx_ref,
    amount
  }`;

  const params = { tx_ref };

  const order: Order | null = await client.fetch(query, params);
  return order;
}

// Define the GET method
export async function GET(req: NextRequest, { params }: { params: { tx_ref: string } }) {
  const { tx_ref } = params;

  try {
    const orderDetails = await getOrderDetails(tx_ref);

    if (!orderDetails) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(orderDetails);
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json({ message: "Server error. Please try again later." }, { status: 500 });
  }
}
