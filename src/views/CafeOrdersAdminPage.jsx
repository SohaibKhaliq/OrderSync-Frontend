import React, { useState, useEffect, useCallback } from "react";
import Page from "../components/Page";
import { CafeOrders, col, getDB, saveDB } from "../localdb/LocalDB";
import {
  IconChefHat,
  IconCircleCheck,
  IconClock,
  IconRefresh,
  IconTableAlias,
  IconTruck,
  IconX,
} from "@tabler/icons-react";
import { iconStroke } from "../config/config";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "badge-warning",
    icon: <IconClock size={14} stroke={iconStroke} />,
  },
  preparing: {
    label: "Preparing",
    color: "badge-info",
    icon: <IconChefHat size={14} stroke={iconStroke} />,
  },
  ready: {
    label: "Ready",
    color: "badge-primary",
    icon: <IconCircleCheck size={14} stroke={iconStroke} />,
  },
  delivered: {
    label: "Delivered",
    color: "badge-success",
    icon: <IconTruck size={14} stroke={iconStroke} />,
  },
  cancelled: {
    label: "Cancelled",
    color: "badge-error",
    icon: <IconX size={14} stroke={iconStroke} />,
  },
};

const NEXT_STATUS = {
  pending: "preparing",
  preparing: "ready",
  ready: "delivered",
};

function updateOrderStatus(orderId, newStatus) {
  const db = getDB();
  db.cafe_orders = (db.cafe_orders || []).map((o) =>
    String(o.id) === String(orderId) ? { ...o, status: newStatus } : o,
  );
  saveDB(db);
}

export default function CafeOrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  const load = useCallback(() => {
    setOrders(CafeOrders.getAll());
  }, []);

  useEffect(() => {
    load();
    // Poll every 10 seconds for new orders
    const interval = setInterval(load, 10_000);
    return () => clearInterval(interval);
  }, [load]);

  const handleAdvance = (orderId, currentStatus) => {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    updateOrderStatus(orderId, next);
    toast.success(`Order #${orderId} → ${STATUS_CONFIG[next].label}`);
    load();
  };

  const handleCancel = (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    updateOrderStatus(orderId, "cancelled");
    toast.error(`Order #${orderId} cancelled`);
    load();
  };

  const visible =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <Page className="px-6 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-restro-green-dark">
            Cafe Live Orders
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Student portal orders — auto-refreshes every 10 s
          </p>
        </div>
        <button onClick={load} className="btn btn-sm btn-outline gap-2">
          <IconRefresh size={16} stroke={iconStroke} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ["all", "All", orders.length],
          ...Object.entries(STATUS_CONFIG).map(([k, v]) => [
            k,
            v.label,
            counts[k],
          ]),
        ].map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`btn btn-sm rounded-full ${filter === key ? "btn-primary" : "btn-outline"}`}
          >
            {label}
            <span
              className={`ml-1 badge badge-sm ${filter === key ? "badge-primary-content bg-white/20" : "badge-ghost"}`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders grid */}
      {visible.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <IconChefHat
            size={48}
            stroke={1}
            className="mx-auto mb-3 opacity-30"
          />
          <p className="text-lg font-medium">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((order) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const next = NEXT_STATUS[order.status];
            const nextCfg = next ? STATUS_CONFIG[next] : null;

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div>
                    <span className="font-bold text-restro-green-dark">
                      Order #{order.id}
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`badge gap-1 ${cfg.color}`}>
                    {cfg.icon}
                    {cfg.label}
                  </span>
                </div>

                {/* Customer + type info */}
                <div className="px-5 py-3 bg-gray-50 text-sm flex flex-wrap gap-x-6 gap-y-1">
                  <span className="text-gray-500">
                    <strong className="text-gray-700">Customer:</strong>{" "}
                    {order.customer_name || "—"}
                  </span>
                  <span className="text-gray-500">
                    <strong className="text-gray-700">Type:</strong>{" "}
                    {order.delivery_type === "dine_in"
                      ? `🍽 Dine In${order.table_title ? ` — ${order.table_title}` : ""}`
                      : order.delivery_type === "pickup"
                        ? "🏪 Pickup"
                        : "🚚 Delivery"}
                  </span>
                  <span className="text-gray-500">
                    <strong className="text-gray-700">Payment:</strong>{" "}
                    {order.payment_method?.toUpperCase() || "—"}
                  </span>
                </div>

                {/* Items */}
                <div className="px-5 py-3 flex-1">
                  <ul className="space-y-1.5">
                    {(order.items || []).map((item, i) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          <span className="font-medium">{item.quantity}×</span>{" "}
                          {item.name}
                        </span>
                        <span className="text-gray-500">
                          {order.currency_symbol}
                          {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between text-sm font-bold text-restro-green-dark">
                    <span>Total</span>
                    <span>
                      {order.currency_symbol}
                      {parseFloat(order.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {order.status !== "delivered" &&
                  order.status !== "cancelled" && (
                    <div className="px-5 py-3 border-t border-gray-50 flex gap-2">
                      {nextCfg && (
                        <button
                          onClick={() => handleAdvance(order.id, order.status)}
                          className="btn btn-sm btn-primary flex-1 gap-1"
                        >
                          {nextCfg.icon} Mark {nextCfg.label}
                        </button>
                      )}
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="btn btn-sm btn-outline btn-error"
                        title="Cancel order"
                      >
                        <IconX size={16} stroke={iconStroke} />
                      </button>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </Page>
  );
}
