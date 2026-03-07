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
    <div className="bg-theme-light flex-1 py-12 px-6 md:px-12 xl:px-24">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-10 text-center flex flex-col items-center">
           <Link to="/menu" className="text-primary text-sm font-bold uppercase tracking-widest hover:underline mb-4 inline-block">
             ← Back to Menu
           </Link>
           <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">
             My Orders
           </h1>
        </div>

        <div className="flex flex-col gap-6">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col items-center justify-center py-24 px-6 text-center">
              <svg className="w-20 h-20 text-primary opacity-20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <h2 className="text-2xl font-serif font-bold text-secondary mb-3">No orders yet</h2>
              <p className="text-neutral opacity-60 mb-6 max-w-sm">
                You haven't placed any orders. Discover our delicious menu and treat yourself!
              </p>
              <Link to="/menu" className="btn btn-primary rounded-full px-10 h-14 min-h-0 text-white font-semibold text-lg border-0 shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                Start Ordering
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 border border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-serif font-bold text-2xl text-secondary">Order #{order.id}</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          order.status === "completed" || order.status === "ready" || order.status === "delivered" ? "bg-green-100 text-green-700" :
                          order.status === "cancelled" ? "bg-red-100 text-red-700" :
                          "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-neutral opacity-70 mb-2">
                      {new Date(order.created_at).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-neutral font-medium">
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        {order.items?.length || 0} items
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        {order.delivery_type === "delivery"
                          ? "🚚 Delivery"
                          : order.delivery_type === "pickup"
                            ? "🏪 Pickup"
                            : "🍽 Dine In"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-100 sm:border-0">
                    <p className="font-bold text-3xl text-primary">
                      ${parseFloat(order.total).toFixed(2)}
                    </p>
                    <div className="hidden sm:flex items-center text-primary font-bold text-sm mt-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      View Details &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
