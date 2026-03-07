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
      <div className="bg-theme-light flex-1 flex flex-col items-center justify-center py-32 px-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-primary opacity-20 mb-6"
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
        <h2 className="text-4xl font-serif font-bold text-secondary mb-4">Your cart is empty</h2>
        <p className="text-neutral opacity-60 mb-8 max-w-sm text-center">
          Looks like you haven't added anything to your cart yet. Discover our delicious menu!
        </p>
        <Link to="/menu" className="btn btn-primary rounded-full px-10 h-14 min-h-0 text-white font-semibold text-lg border-0 shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-theme-light flex-1 py-12 px-6 md:px-12 xl:px-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10 text-center flex flex-col items-center">
           <Link to="/menu" className="text-primary text-sm font-bold uppercase tracking-widest hover:underline mb-4 inline-block">
             ← Back to Menu
           </Link>
           <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">
             Your Cart <span className="text-[#64C2EE]">({itemCount})</span>
           </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {cartItems.map((item) => (
              <div key={item._key} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center p-4 md:p-6 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                
                {/* Image placeholder for cart */}
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center shadow-inner mr-4 md:mr-6">
                  <img 
                    src={item.image || `https://images.unsplash.com/photo-${['1540189549336-e6e99c3679fe', '1565299624946-b28f40a0ae38', '1482049016688-2d3e1b311543', '1481070414801-51fd732d7184'][(item.id || 0) % 4]}?q=80&w=200&auto=format&fit=crop`}
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://images.unsplash.com/photo-${['1540189549336-e6e99c3679fe', '1565299624946-b28f40a0ae38', '1482049016688-2d3e1b311543', '1481070414801-51fd732d7184'][(item.id || 0) % 4]}?q=80&w=200&auto=format&fit=crop` }}
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-serif font-bold text-lg md:text-xl text-secondary truncate">{item.title}</h3>
                  {item.variant && (
                    <p className="text-xs md:text-sm text-neutral/60 mt-1">
                      Variant: <span className="font-medium text-secondary">{item.variant.title}</span>
                    </p>
                  )}
                  {item.addons?.length > 0 && (
                    <p className="text-xs md:text-sm text-neutral/60 mt-1 truncate">
                      Add-ons: <span className="font-medium text-secondary">{item.addons.map((a) => a.title).join(", ")}</span>
                    </p>
                  )}
                  <p className="text-primary font-bold text-lg mt-2">
                    {symbol}{((item.price + item.addonTotal) * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end justify-between h-full gap-4">
                  <button
                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors border border-red-100"
                    onClick={() => removeItem(item._key)}
                    title="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  
                  <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                    <button
                      className="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary transition-colors disabled:opacity-30"
                      onClick={() => updateQuantity(item._key, Math.max(1, item.quantity - 1))}
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-secondary text-sm">
                      {item.quantity}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary transition-colors"
                      onClick={() => updateQuantity(item._key, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 p-6 md:p-8 sticky top-32">
              <h3 className="font-serif font-bold text-2xl mb-6 text-secondary pb-4 border-b border-gray-100">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-neutral">
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span className="opacity-80">Subtotal</span>
                  <span className="font-semibold text-secondary">
                    {symbol}{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span className="opacity-80">Tax</span>
                  <span className="font-semibold text-secondary">
                    {symbol}{taxTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-dashed border-gray-300 my-6"></div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="font-serif font-bold text-xl text-secondary">Total</span>
                <span className="text-3xl font-bold text-primary">
                  {symbol}{total.toFixed(2)}
                </span>
              </div>
              
              <button
                className="btn btn-primary w-full rounded-full h-14 min-h-0 text-white font-bold text-lg border-0 shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
