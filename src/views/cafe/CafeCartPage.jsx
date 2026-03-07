import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCafeCart } from "../../contexts/CafeCartContext";
import { useCustomer } from "../../contexts/CustomerContext";
import { Settings } from "../../localdb/LocalDB";

export default function CafeCartPage() {
  const navigate = useNavigate();
  const { customer } = useCustomer();
  const {
    cartItems,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    taxTotal,
    total,
  } = useCafeCart();

  const store = Settings.getStoreSetting();
  const currency = store?.currency || "USD";
  const symbol = currency === "PKR" ? "Rs." : "$";

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col">
        <nav className="navbar bg-base-200 shadow-sm px-4">
          <Link to="/menu" className="btn btn-ghost btn-sm">
            ← Back to Menu
          </Link>
          <span className="flex-1 text-center font-bold text-lg">
            Your Cart
          </span>
          <div className="w-24" />
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-base-content/50 py-24">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-lg font-semibold">Your cart is empty</p>
          <Link to="/menu" className="btn btn-primary">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <nav className="navbar bg-base-200 shadow-sm px-4 sticky top-0 z-30">
        <Link to="/menu" className="btn btn-ghost btn-sm">
          ← Back to Menu
        </Link>
        <span className="flex-1 text-center font-bold text-lg">
          Your Cart ({itemCount})
        </span>
        <div className="w-24" />
      </nav>

      <div className="max-w-2xl mx-auto w-full px-4 py-6 flex-1">
        <div className="flex flex-col gap-3 mb-6">
          {cartItems.map((item) => (
            <div key={item._key} className="card bg-base-200 shadow-sm">
              <div className="card-body py-3 px-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="font-semibold truncate">{item.title}</p>
                    {item.variant && (
                      <p className="text-xs text-base-content/60">
                        {item.variant.title}
                      </p>
                    )}
                    {item.addons?.length > 0 && (
                      <p className="text-xs text-base-content/60">
                        + {item.addons.map((a) => a.title).join(", ")}
                      </p>
                    )}
                    <p className="text-sm text-primary font-medium mt-1">
                      {symbol}
                      {((item.price + item.addonTotal) * item.quantity).toFixed(
                        2,
                      )}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-square btn-xs btn-ghost"
                      onClick={() =>
                        updateQuantity(item._key, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-square btn-xs btn-ghost"
                      onClick={() =>
                        updateQuantity(item._key, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className="btn btn-square btn-xs btn-error btn-outline ml-1"
                      onClick={() => removeItem(item._key)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h3 className="font-bold text-lg mb-3">Order Summary</h3>
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal</span>
              <span>
                {symbol}
                {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Tax</span>
              <span>
                {symbol}
                {taxTotal.toFixed(2)}
              </span>
            </div>
            <div className="divider my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">
                {symbol}
                {total.toFixed(2)}
              </span>
            </div>
            <button
              className="btn btn-primary w-full mt-4"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
