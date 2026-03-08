import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useCustomer } from "../../contexts/CustomerContext";
import { useCafeCart } from "../../contexts/CafeCartContext";
import { Settings } from "../../localdb/LocalDB";
import { IconShoppingBag } from "@tabler/icons-react";
import NotificationDropdown from "../../components/NotificationDropdown";

export default function CafeLayout() {
  const { customer, logout } = useCustomer();
  const { itemCount } = useCafeCart();
  const location = useLocation();

  const [store, setStore] = useState(null);

  useEffect(() => {
    setStore(Settings.getStoreSetting());
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Orders", path: "/orders" },
    // If we want more links like "About", "Blog", we could add them mapping to sections
  ];

  return (
    <div className="min-h-screen bg-theme-light text-theme-dark font-sans flex flex-col">
      {/* Exact Replica Navbar */}
      <nav className="navbar bg-transparent px-4 py-6 md:px-12 xl:px-24 flex items-center justify-between border-b border-base-200">
        <div className="flex-1 lg:flex-none">
          <Link
            to="/"
            className="text-3xl font-serif font-bold tracking-tight text-secondary"
          >
            {store?.store_name || "DINING"}
            <span className="text-primary text-xl relative -top-2">®</span>
          </Link>
        </div>

        {/* Center Links (hidden on small screens) */}
        <div className="hidden lg:flex flex-1 justify-center gap-8 text-sm font-semibold tracking-wide">
          <Link
            to="/"
            className={`hover:text-primary transition-colors ${location.pathname === "/" ? "text-primary" : "text-neutral"}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`hover:text-primary transition-colors ${location.pathname === "/about" ? "text-primary" : "text-neutral"}`}
          >
            About
          </Link>
          <Link
            to="/menu"
            className={`hover:text-primary transition-colors ${location.pathname === "/menu" ? "text-primary" : "text-neutral"}`}
          >
            Menu
          </Link>
          <Link
            to="/reserve"
            className={`hover:text-primary transition-colors ${location.pathname === "/reserve" ? "text-primary" : "text-neutral"}`}
          >
            Reservations
          </Link>
          <Link
            to="/gallery"
            className={`hover:text-primary transition-colors ${location.pathname === "/gallery" ? "text-primary" : "text-neutral"}`}
          >
            Gallery
          </Link>
          <Link
            to="/contact"
            className={`hover:text-primary transition-colors ${location.pathname === "/contact" ? "text-primary" : "text-neutral"}`}
          >
            Contact
          </Link>
          {customer && (
            <Link
              to="/orders"
              className={`hover:text-primary transition-colors ${location.pathname.includes("/orders") ? "text-primary" : "text-neutral"}`}
            >
              Orders
            </Link>
          )}
          {customer && (
            <Link
              to="/wallet"
              className={`hover:text-primary transition-colors ${location.pathname === "/wallet" ? "text-primary" : "text-neutral"}`}
            >
              Wallet
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex-none flex items-center gap-4">
          {customer && (
            <NotificationDropdown
              userId={customer.id}
              userRole="customer"
              isDarkTheme={false}
            />
          )}

          <Link
            to="/cart"
            className="relative text-neutral hover:text-primary transition-colors mr-2"
          >
            <IconShoppingBag stroke={1.5} size={28} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-primary-content text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>

          {customer ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost !px-2 hidden md:inline-flex"
              >
                Hi, {customer?.name?.split(" ")[0]} ▾
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[9999] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="px-4 py-2 border-b border-gray-100 mb-1">
                  <span className="text-xs text-gray-400 block mb-1 uppercase tracking-wider font-bold">
                    Wallet Balance
                  </span>
                  <span className="font-semibold text-primary">
                    {store?.currency || "$"}
                    {parseFloat(customer.credit_balance || 0).toFixed(2)}
                  </span>
                </li>
                <li>
                  <Link to="/orders">My Orders</Link>
                </li>
                <li>
                  <Link to="/wallet">My Wallet 💰</Link>
                </li>
                <li>
                  <a onClick={() => logout()}>Logout</a>
                </li>
              </ul>
              <Link
                to="/menu"
                className="btn btn-primary rounded-full px-6 font-semibold hidden md:inline-flex"
              >
                Order Now
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="font-semibold text-sm hover:text-primary transition-colors hidden md:block"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary rounded-full px-6 font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>

      {/* Exact Replica Footer */}
      <footer className="bg-[#111111] text-white pt-20 pb-8 px-6 md:px-12 xl:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1 */}
          <div>
            <Link
              to="/"
              className="text-3xl font-serif font-bold tracking-tight text-white mb-6 inline-block"
            >
              {store?.store_name || "DINING"}
              <span className="text-primary text-xl relative -top-2">®</span>
            </Link>
            <p className="text-sm opacity-70 leading-relaxed max-w-sm">
              For us, it's not just about making a great impression, it's about
              raising the bar and having everything handled perfectly.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold tracking-wider mb-6 text-gray-400">
              OPEN HOURS
            </h4>
            <ul className="text-sm space-y-4 opacity-80">
              <li>Monday - Sunday</li>
              <li>Lunch 12PM - 3PM</li>
              <li>Dinner 6PM - 10PM</li>
              <li>Weekends 4PM - 11PM</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold tracking-wider mb-6 text-gray-400">
              MORE INFO
            </h4>
            <ul className="text-sm space-y-4 opacity-80">
              <li>
                <Link to="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-primary">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-primary">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Contact Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold tracking-wider mb-6 text-gray-400">
              ADDRESS
            </h4>
            <div className="text-sm space-y-4 opacity-80 mb-6">
              <p>
                {store?.address ||
                  "329 Queensberry Street,\nNorth Melbourne VIC 3051, Australia."}
              </p>
            </div>
            <div className="text-sm space-y-2 opacity-80">
              <p>P: {store?.phone || "+1 800 555 123"}</p>
              <p>E: hello@dining.com</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
          <p>
            © {new Date().getFullYear()} {store?.store_name || "Campus Karahi"}.
            All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-primary">Facebook</span>
            <span className="cursor-pointer hover:text-primary">Instagram</span>
            <span className="cursor-pointer hover:text-primary">Twitter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
