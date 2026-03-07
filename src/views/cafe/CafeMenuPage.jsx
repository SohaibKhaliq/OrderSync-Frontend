import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MenuItems, Settings } from "../../localdb/LocalDB";
import { useCafeCart } from "../../contexts/CafeCartContext";
import { useCustomer } from "../../contexts/CustomerContext";

export default function CafeMenuPage() {
  const navigate = useNavigate();
  const { customer, logout } = useCustomer();
  const { addItem, itemCount } = useCafeCart();

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [store, setStore] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  // Variant/addon selection modal state
  const [modal, setModal] = useState(null); // { item }
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);

  useEffect(() => {
    const items = MenuItems.getAll().filter((i) => i.is_active);
    setMenuItems(items);
    const cats = Settings.getCategories();
    setCategories(cats);
    setStore(Settings.getStoreSetting());
  }, []);

  const filtered = menuItems.filter((item) => {
    const matchCat =
      activeCategory === "all" ||
      String(item.category_id) === String(activeCategory);
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.category_title || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function openModal(item) {
    setModal({ item });
    setSelectedVariant(item.variants?.length > 0 ? item.variants[0] : null);
    setSelectedAddons([]);
  }

  function closeModal() {
    setModal(null);
    setSelectedVariant(null);
    setSelectedAddons([]);
  }

  function toggleAddon(addon) {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon],
    );
  }

  function handleAddToCart() {
    if (!modal) return;
    const { item } = modal;
    addItem(item, 1, selectedVariant, selectedAddons);
    toast.success(`${item.title} added to cart!`);
    closeModal();
  }

  function quickAdd(item) {
    if ((item.variants?.length || 0) > 0 || (item.addons?.length || 0) > 0) {
      openModal(item);
    } else {
      addItem(item, 1, null, []);
      toast.success(`${item.title} added to cart!`);
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <nav className="navbar bg-base-200 shadow-sm px-4 sticky top-0 z-30">
        <div className="flex-1">
          <Link to="/cafe" className="text-xl font-bold text-primary">
            {store?.store_name || "Cafe"}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/cafe/orders" className="btn btn-ghost btn-sm">
            Orders
          </Link>
          <Link to="/cafe/cart" className="btn btn-primary btn-sm indicator">
            {itemCount > 0 && (
              <span className="indicator-item badge badge-secondary badge-sm">
                {itemCount}
              </span>
            )}
            Cart
          </Link>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              logout();
              navigate("/cafe");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">
            Hi, {customer?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-base-content/60 text-sm">
            What would you like today?
          </p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            className={`btn btn-sm flex-shrink-0 ${activeCategory === "all" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveCategory("all")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`btn btn-sm flex-shrink-0 ${String(activeCategory) === String(cat.id) ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setActiveCategory(String(cat.id))}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Items grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-base-content/50">
            No items found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="card bg-base-200 shadow hover:shadow-md transition-shadow"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      <span className="badge badge-ghost text-xs">
                        {item.category_title}
                      </span>
                      {item.variants?.length > 0 && (
                        <p className="text-xs text-base-content/50 mt-1">
                          {item.variants.length} variants
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-primary">
                        ${parseFloat(item.price).toFixed(2)}
                      </div>
                      {item.tax_rate > 0 && (
                        <div className="text-xs text-base-content/40">
                          +{item.tax_rate}% {item.tax_title}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-3">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => quickAdd(item)}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Variant/Addon modal */}
      {modal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-1">{modal.item.title}</h3>
            <p className="text-sm text-base-content/60 mb-4">
              Customise your order
            </p>

            {/* Variants */}
            {modal.item.variants?.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-sm mb-2">Size / Variant</p>
                <div className="flex flex-wrap gap-2">
                  {modal.item.variants.map((v) => (
                    <button
                      key={v.id}
                      className={`btn btn-sm ${selectedVariant?.id === v.id ? "btn-primary" : "btn-outline"}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.title} — ${parseFloat(v.price).toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Addons */}
            {modal.item.addons?.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-sm mb-2">Add-ons</p>
                <div className="flex flex-col gap-2">
                  {modal.item.addons.map((a) => (
                    <label
                      key={a.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm checkbox-primary"
                        checked={!!selectedAddons.find((sa) => sa.id === a.id)}
                        onChange={() => toggleAddon(a)}
                      />
                      <span className="flex-1">{a.title}</span>
                      <span className="text-sm font-medium">
                        +${parseFloat(a.price).toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeModal} />
        </dialog>
      )}
    </div>
  );
}
