import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCustomer } from "../../contexts/CustomerContext";
import { CafeOrders } from "../../localdb/LocalDB";

const STATUS_BADGE = {
  pending: "badge-warning",
  confirmed: "badge-info",
  preparing: "badge-info",
  ready: "badge-success",
  delivered: "badge-success",
  cancelled: "badge-error",
  completed: "badge-success",
};

export default function CafeOrdersPage() {
  const { customer } = useCustomer();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (customer?.id) {
      setOrders(CafeOrders.getByCustomer(customer.id));
    }
  }, [customer]);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <nav className="navbar bg-base-200 shadow-sm px-4 sticky top-0 z-30">
        <Link to="/cafe/menu" className="btn btn-ghost btn-sm">
          ← Menu
        </Link>
        <span className="flex-1 text-center font-bold text-lg">My Orders</span>
        <div className="w-20" />
      </nav>

      <div className="max-w-2xl mx-auto w-full px-4 py-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-base-content/50 gap-4">
            <p className="text-lg font-semibold">No orders yet</p>
            <Link to="/cafe/menu" className="btn btn-primary">
              Start Ordering
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/cafe/orders/${order.id}`}
                className="card bg-base-200 shadow hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="card-body py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-xs text-base-content/60 mt-0.5">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm text-base-content/70 mt-1">
                        {order.items?.length || 0} item(s) ·{" "}
                        {order.delivery_type === "delivery"
                          ? "🚚 Delivery"
                          : order.delivery_type === "pickup"
                            ? "🏪 Pickup"
                            : "🍽 Dine In"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`badge ${STATUS_BADGE[order.status] || "badge-ghost"} capitalize`}
                      >
                        {order.status}
                      </span>
                      <p className="font-bold text-primary mt-2">
                        ${parseFloat(order.total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
