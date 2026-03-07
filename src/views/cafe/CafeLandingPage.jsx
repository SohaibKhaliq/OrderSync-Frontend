import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCustomer } from "../../contexts/CustomerContext";
import { Settings, MenuItems } from "../../localdb/LocalDB";

export default function CafeLandingPage() {
  const { customer, logout } = useCustomer();
  const [store, setStore] = useState(null);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    setStore(Settings.getStoreSetting());
    setFeatured(
      MenuItems.getAll()
        .filter((m) => m.is_active)
        .slice(0, 6),
    );
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <nav className="navbar bg-base-200 shadow-sm px-6">
        <div className="flex-1">
          <span className="text-xl font-bold text-primary">
            {store?.store_name || "OrderSync Cafe"}
          </span>
        </div>
        <div className="flex gap-3">
          {customer ? (
            <>
              <Link to="/menu" className="btn btn-sm btn-primary">
                Order Now
              </Link>
              <Link to="/orders" className="btn btn-sm btn-ghost">
                My Orders
              </Link>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero min-h-[50vh] bg-gradient-to-br from-primary/10 to-base-100">
        <div className="hero-content text-center flex-col py-16">
          <h1 className="text-5xl font-bold text-primary mb-4">
            {store?.store_name || "OrderSync Cafe"}
          </h1>
          <p className="text-xl text-base-content/70 max-w-lg mb-8">
            Fresh food, hot beverages, and quick delivery — all in one place.
            Browse our menu and order online with ease.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link to="/menu" className="btn btn-primary btn-lg">
              Browse Menu
            </Link>
            {!customer && (
              <Link to="/register" className="btn btn-outline btn-lg">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      {featured.length > 0 && (
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Our Popular Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((item) => (
              <div
                key={item.id}
                className="card bg-base-200 shadow hover:shadow-md transition-shadow"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <span className="badge badge-ghost text-xs mt-1">
                        {item.category_title}
                      </span>
                    </div>
                    <span className="text-primary font-bold text-lg">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="card-actions justify-end mt-3">
                    <Link to="/menu" className="btn btn-sm btn-primary">
                      Order
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer footer-center p-8 bg-base-200 text-base-content">
        <div>
          <p className="font-semibold">
            {store?.store_name || "OrderSync Cafe"}
          </p>
          {store?.address && (
            <p className="text-sm opacity-70">{store.address}</p>
          )}
          {store?.phone && <p className="text-sm opacity-70">{store.phone}</p>}
          <p className="text-xs opacity-50 mt-2">
            &copy; {new Date().getFullYear()} OrderSync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
