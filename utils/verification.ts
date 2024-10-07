import { NextResponse } from 'next/server';

export async function verifyTransaction(tx_ref: string) {
  const secret_key = process.env.PAYCHANGU_SECRET_KEY;

  const response = await fetch(`https://api.paychangu.com/verify-payment/${tx_ref}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${secret_key}`,
    },
  });

  const result = await response.json();
  console.log("PayChangu verification response:", result); // Log the verification response

  if (!response.ok || result.status !== 'success') {
    throw new Error('Payment transaction not created');
  }

  return result.data; 
}
