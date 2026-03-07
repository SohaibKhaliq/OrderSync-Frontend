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
    <div className="bg-theme-light py-12 px-6 md:px-12 xl:px-24 flex-1">
      <div className="max-w-[1400px] mx-auto">
        {/* Welcome */}
        <div className="mb-10 text-center">
          <p className="text-[#64C2EE] font-bold tracking-widest text-xs mb-4 uppercase">Let's Order</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
            Hi{customer?.name ? `, ${customer.name.split(" ")[0]} 👋` : ' 👋'}
          </h1>
          <p className="text-neutral mb-10 text-lg opacity-75 max-w-lg mx-auto">
            What would you like today? Browse our delicious food menu.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <input
            type="text"
            className="w-full h-12 rounded-full pl-6 pr-6 bg-white border border-gray-200 text-secondary focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
            placeholder="Search our delicious foods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          <button
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors border ${
              activeCategory === "all"
                ? "bg-primary border-primary text-white"
                : "bg-white border-gray-200 text-neutral hover:border-gray-300"
            }`}
            onClick={() => setActiveCategory("all")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors border ${
                String(activeCategory) === String(cat.id)
                  ? "bg-primary border-primary text-white"
                  : "bg-white border-gray-200 text-neutral hover:border-gray-300"
              }`}
              onClick={() => setActiveCategory(String(cat.id))}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Items grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-neutral opacity-50 font-serif text-xl">
            No items found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all p-4 border border-gray-50 flex flex-col group cursor-pointer"
              >
                <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4">
                  <img 
                    src={`https://images.unsplash.com/photo-${['1544025162-8311ab3cd9f8', '1568901346375-23c9450c58cd', '1559847844-5315695dadae', '1432139555190-58524dae6a55'][(item.id || 0) % 4]}?q=80&w=600&auto=format&fit=crop`}
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.tax_rate > 0 && (
                    <div className="absolute top-3 right-3 bg-secondary text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full z-10">+{item.tax_rate}% {item.tax_title}</div>
                  )}
                </div>
                
                <h3 className="font-serif font-bold text-xl mb-1 text-secondary">{item.title}</h3>
                <span className="badge badge-ghost text-xs mb-3 text-neutral/70 border-0 bg-gray-100">{item.category_title}</span>
                
                {item.variants?.length > 0 && (
                  <p className="text-xs text-primary mb-2 font-medium">
                    {item.variants.length} custom options available
                  </p>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="font-bold text-2xl text-secondary">
                    ${parseFloat(item.price).toFixed(2)}
                  </span>
                  <button
                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md shadow-primary/30 shrink-0"
                    onClick={() => quickAdd(item)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </button>
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
