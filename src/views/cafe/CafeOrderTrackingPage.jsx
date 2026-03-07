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
    <div className="bg-theme-light flex-1 py-12 px-6 md:px-12 xl:px-24">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-10 text-center flex flex-col items-center">
           <Link to="/orders" className="text-primary text-sm font-bold uppercase tracking-widest hover:underline mb-4 inline-block">
             ← My Orders
           </Link>
           <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">
             Order #{order.id}
           </h1>
        </div>

      <div className="flex flex-col gap-6">
        {/* Status */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-primary/20 text-center relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div className="p-8">
            {isCancelled ? (
              <>
                <p className="text-6xl mb-4">❌</p>
                <p className="text-2xl font-serif font-bold text-red-500">Order Cancelled</p>
              </>
            ) : (
              <>
                <p className="text-6xl mb-4 animate-[bounce_2s_infinite]">
                  {STEP_ICONS[order.status] || STEP_ICONS.pending}
                </p>
                <p className="text-2xl font-serif font-bold text-secondary capitalize">
                  {STEP_LABELS[order.status] || order.status}
                </p>
                <p className="text-neutral opacity-60 mt-2 font-medium">Thank you for ordering with us!</p>
              </>
            )}
          </div>
        </div>

        {/* Progress timeline */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 p-6 md:p-8 shrink-0">
            <h3 className="font-serif font-bold text-2xl mb-8 text-secondary pb-4 border-b border-gray-100">Order Progress</h3>
            <div className="ml-4 md:ml-8">
              <ol className="relative border-l-2 border-gray-100">
                {STEPS.map((step, idx) => {
                  const done = idx <= currentStep;
                  const active = idx === currentStep;
                  return (
                    <li key={step} className="mb-8 ml-8 last:mb-0">
                      <span
                        className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-[17px] ring-4 ring-white text-sm font-bold ${
                          active
                            ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
                            : done
                              ? "bg-[#64C2EE] text-white"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {done ? "✓" : idx + 1}
                      </span>
                      <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-50 ml-2">
                        <p
                          className={`font-serif text-lg ${
                            active
                              ? "text-primary font-bold"
                              : done
                                ? "text-secondary font-semibold"
                                : "text-neutral/50 font-medium"
                          }`}
                        >
                          {STEP_LABELS[step]}
                        </p>
                        {active && (
                          <p className="text-sm text-neutral mt-1 animate-pulse font-medium">
                            Currently processing...
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}

        {/* Order details */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 p-6 md:p-8 shrink-0">
          <h3 className="font-serif font-bold text-2xl mb-6 text-secondary pb-4 border-b border-gray-100">Order Details</h3>
          <div className="space-y-3 mb-6">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-neutral text-sm md:text-base border-b border-gray-50 pb-2 border-dashed">
                <span className="font-medium">
                  {item.title}
                  {item.variant ? ` (${item.variant.title})` : ""}
                  <span className="text-gray-400"> × {item.quantity}</span>
                </span>
                <span className="font-semibold text-secondary">
                  ${(
                    (item.price + (item.addonTotal || 0)) *
                    item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 mb-6 text-neutral text-sm md:text-base">
            <div className="flex justify-between items-center">
              <span className="opacity-80">Subtotal</span>
              <span className="font-semibold text-secondary">${parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-80">Tax</span>
              <span className="font-semibold text-secondary">${parseFloat(order.tax_total).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="border-t border-dashed border-gray-300 my-6"></div>
          
          <div className="flex justify-between items-center mb-8">
            <span className="font-serif font-bold text-2xl text-secondary">Total</span>
            <span className="text-3xl font-bold text-primary">
              ${parseFloat(order.total).toFixed(2)}
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <span className="text-neutral/60 text-xs font-bold uppercase tracking-wider block mb-1">Payment Method</span>
                <p className="capitalize font-semibold text-secondary">{order.payment_method}</p>
              </div>
              <div>
                <span className="text-neutral/60 text-xs font-bold uppercase tracking-wider block mb-1">Payment Status</span>
                <p className="capitalize font-semibold text-secondary">{order.payment_status}</p>
              </div>
              <div>
                <span className="text-neutral/60 text-xs font-bold uppercase tracking-wider block mb-1">Delivery Type</span>
                <p className="capitalize font-semibold text-secondary">{order.delivery_type}</p>
              </div>
              {order.address && (
                <div>
                  <span className="text-neutral/60 text-xs font-bold uppercase tracking-wider block mb-1">Address</span>
                  <p className="font-semibold text-secondary leading-tight">{order.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/menu" className="btn btn-outline border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full px-10 h-14 min-h-0 font-bold text-lg transition-colors inline-block w-full sm:w-auto">
            Order Again
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
