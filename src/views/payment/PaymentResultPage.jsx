import React from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "success";
  const gateway = searchParams.get("gateway") || "";
  const ref = searchParams.get("ref") || null;
  const reason = searchParams.get("reason") || null;

  const isSuccess = status === "success";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 ${isSuccess ? "bg-green-50" : "bg-red-50"}`}
    >
      <div className="card bg-white shadow-xl w-full max-w-sm text-center">
        <div
          className={`rounded-t-2xl px-6 py-6 ${isSuccess ? "bg-green-500" : "bg-red-500"}`}
        >
          <p className="text-7xl mb-2">{isSuccess ? "✅" : "❌"}</p>
          <h2 className="text-white text-2xl font-bold">
            {isSuccess ? "Payment Successful" : "Payment Failed"}
          </h2>
        </div>
        <div className="card-body">
          {gateway && (
            <p className="text-gray-600 font-medium capitalize">
              Gateway: {gateway}
            </p>
          )}
          {isSuccess && ref && (
            <div className="bg-base-100 rounded-lg px-4 py-3 my-2 text-sm">
              <p className="text-gray-500 text-xs mb-1">
                Transaction Reference
              </p>
              <p className="font-mono font-semibold text-base">{ref}</p>
            </div>
          )}
          {!isSuccess && reason && (
            <p className="text-red-500 text-sm my-2">
              {reason === "card_declined"
                ? "Your card was declined. Please try a different card."
                : "Payment could not be processed. Please try again."}
            </p>
          )}
          <div className="flex flex-col gap-2 mt-4">
            <Link to="/orders" className="btn btn-primary">
              View My Orders
            </Link>
            <Link to="/menu" className="btn btn-ghost">
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
