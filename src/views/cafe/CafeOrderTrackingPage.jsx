import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CafeOrders } from "../../localdb/LocalDB";

const STEPS = ["pending", "confirmed", "preparing", "ready", "delivered"];

const STEP_LABELS = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  preparing: "Being Prepared",
  ready: "Ready",
  delivered: "Delivered",
};

const STEP_ICONS = {
  pending: "🕐",
  confirmed: "✅",
  preparing: "👨‍🍳",
  ready: "🛎",
  delivered: "🎉",
};

export default function CafeOrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loaded = CafeOrders.getById(id);
    setOrder(loaded);

    // Poll every 5 seconds to reflect any status updates
    const timer = setInterval(() => {
      setOrder(CafeOrders.getById(id));
    }, 5000);
    return () => clearInterval(timer);
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const currentStep = isCancelled
    ? -1
    : STEPS.indexOf(order.status === "completed" ? "delivered" : order.status);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <nav className="navbar bg-base-200 shadow-sm px-4 sticky top-0 z-30">
        <Link to="/orders" className="btn btn-ghost btn-sm">
          ← My Orders
        </Link>
        <span className="flex-1 text-center font-bold text-lg">
          Order #{order.id}
        </span>
        <div className="w-24" />
      </nav>

      <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Status */}
        <div className="card bg-base-200 shadow text-center">
          <div className="card-body py-6">
            {isCancelled ? (
              <>
                <p className="text-5xl mb-2">❌</p>
                <p className="text-xl font-bold text-error">Order Cancelled</p>
              </>
            ) : (
              <>
                <p className="text-5xl mb-2">
                  {STEP_ICONS[order.status] || STEP_ICONS.pending}
                </p>
                <p className="text-xl font-bold capitalize">
                  {STEP_LABELS[order.status] || order.status}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Progress timeline */}
        {!isCancelled && (
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h3 className="font-bold mb-4">Order Progress</h3>
              <ol className="relative border-l border-base-300 ml-4">
                {STEPS.map((step, idx) => {
                  const done = idx <= currentStep;
                  const active = idx === currentStep;
                  return (
                    <li key={step} className="mb-6 ml-6 last:mb-0">
                      <span
                        className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 text-sm ${
                          done
                            ? "bg-primary text-primary-content"
                            : "bg-base-300 text-base-content/40"
                        }`}
                      >
                        {done ? "✓" : idx + 1}
                      </span>
                      <p
                        className={`font-semibold ${
                          active
                            ? "text-primary"
                            : done
                              ? "text-base-content"
                              : "text-base-content/40"
                        }`}
                      >
                        {STEP_LABELS[step]}
                      </p>
                      {active && (
                        <p className="text-sm text-base-content/60 mt-0.5">
                          Processing…
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}

        {/* Order details */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h3 className="font-bold mb-3">Order Details</h3>
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm mb-1">
                <span>
                  {item.title}
                  {item.variant ? ` (${item.variant.title})` : ""}
                  {" ×"}
                  {item.quantity}
                </span>
                <span>
                  $
                  {(
                    (item.price + (item.addonTotal || 0)) *
                    item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="divider my-2" />
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${parseFloat(order.tax_total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base mt-1">
              <span>Total</span>
              <span className="text-primary">
                ${parseFloat(order.total).toFixed(2)}
              </span>
            </div>

            <div className="divider my-2" />
            <div className="grid grid-cols-2 gap-x-4 text-sm">
              <div>
                <span className="text-base-content/60">Payment</span>
                <p className="capitalize font-medium">{order.payment_method}</p>
              </div>
              <div>
                <span className="text-base-content/60">Payment Status</span>
                <p className="capitalize font-medium">{order.payment_status}</p>
              </div>
              <div className="mt-2">
                <span className="text-base-content/60">Delivery</span>
                <p className="capitalize font-medium">{order.delivery_type}</p>
              </div>
              {order.address && (
                <div className="mt-2">
                  <span className="text-base-content/60">Address</span>
                  <p className="font-medium">{order.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Link to="/menu" className="btn btn-outline">
          Order Again
        </Link>
      </div>
    </div>
  );
}
