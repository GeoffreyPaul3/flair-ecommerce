// File: app/failure/page.tsx

export default function Failure() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold">Payment Failed!</h1>
        <p>Unfortunately, your payment could not be processed.</p>
        <a href="/" className="mt-4 text-blue-600">Return to Home</a>
      </div>
    )
  }
  