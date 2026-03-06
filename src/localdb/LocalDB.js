// ============================================================
// LocalDB.js – Full offline LocalStorage database for OrderSync
// ============================================================

const DB_KEY = "ordersync_db";

// ── Raw access ────────────────────────────────────────────
export function getDB() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ── Auto-increment IDs ────────────────────────────────────
function nextId(collection) {
  const db = getDB();
  const items = db[collection] || [];
  if (items.length === 0) return 1;
  return Math.max(...items.map((i) => i.id || 0)) + 1;
}

// ── Generic CRUD helpers ──────────────────────────────────
export function col(name) {
  return getDB()[name] || [];
}

function setCol(name, data) {
  const db = getDB();
  db[name] = data;
  saveDB(db);
}

// ── Seed data ─────────────────────────────────────────────
const SEED = {
  users: [
    {
      id: 1,
      username: "admin@ordersync.com",
      password: "admin123",
      name: "Admin User",
      designation: "Manager",
      phone: "+1234567890",
      email: "admin@ordersync.com",
      role: "admin",
      scope:
        "dashboard,pos,orders,kitchen,customers,invoices,reports,reservations,users,settings",
      tenant_id: "local_tenant_001",
      created_at: new Date().toISOString(),
    },
  ],

  categories: [
    { id: 1, title: "Beverages", created_at: new Date().toISOString() },
    { id: 2, title: "Food", created_at: new Date().toISOString() },
    { id: 3, title: "Desserts", created_at: new Date().toISOString() },
  ],

  taxes: [
    {
      id: 1,
      title: "VAT",
      rate: 10,
      type: "percentage",
      created_at: new Date().toISOString(),
    },
  ],

  payment_types: [
    {
      id: 1,
      title: "Cash",
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Card",
      is_active: 1,
      created_at: new Date().toISOString(),
    },
  ],

  store_tables: [
    {
      id: 1,
      title: "T-1",
      floor: "Ground Floor",
      seating_capacity: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "T-2",
      floor: "Ground Floor",
      seating_capacity: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: "T-3",
      floor: "Ground Floor",
      seating_capacity: 6,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      title: "T-4",
      floor: "First Floor",
      seating_capacity: 2,
      created_at: new Date().toISOString(),
    },
  ],

  menu_items: [
    {
      id: 1,
      title: "Espresso",
      price: 3.5,
      net_price: 3.0,
      category_id: 1,
      category_title: "Beverages",
      tax_id: 1,
      tax_rate: 10,
      tax_type: "percentage",
      tax_title: "VAT",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Cappuccino",
      price: 4.5,
      net_price: 4.0,
      category_id: 1,
      category_title: "Beverages",
      tax_id: 1,
      tax_rate: 10,
      tax_type: "percentage",
      tax_title: "VAT",
      image: null,
      variants: [
        { id: 1, title: "Small", price: 3.5 },
        { id: 2, title: "Large", price: 5.5 },
      ],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Grilled Chicken Burger",
      price: 9.99,
      net_price: 8.5,
      category_id: 2,
      category_title: "Food",
      tax_id: 1,
      tax_rate: 10,
      tax_type: "percentage",
      tax_title: "VAT",
      image: null,
      variants: [],
      addons: [
        { id: 1, title: "Extra Cheese", price: 1.0 },
        { id: 2, title: "Bacon", price: 1.5 },
      ],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      title: "Margherita Pizza",
      price: 12.99,
      net_price: 11.0,
      category_id: 2,
      category_title: "Food",
      tax_id: 1,
      tax_rate: 10,
      tax_type: "percentage",
      tax_title: "VAT",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      title: "Chocolate Brownie",
      price: 5.5,
      net_price: 5.0,
      category_id: 3,
      category_title: "Desserts",
      tax_id: 1,
      tax_rate: 10,
      tax_type: "percentage",
      tax_title: "VAT",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
  ],

  store_setting: {
    id: 1,
    store_name: "OrderSync Restaurant",
    address: "123 Main Street, City",
    phone: "+1 (555) 000-0000",
    email: "info@ordersync.com",
    currency: "USD",
    image: null,
    is_qr_menu_enabled: 0,
    is_qr_order_enabled: 0,
    created_at: new Date().toISOString(),
  },

  print_setting: {
    id: 1,
    page_format: "80",
    header: "Thank you for dining with us!",
    footer: "Please come again!",
    show_notes: 1,
    is_enable_print: 1,
    show_store_details: 1,
    show_customer_details: 1,
    print_token: 1,
    created_at: new Date().toISOString(),
  },

  customers: [],
  orders: [],
  order_items: [],
  invoices: [],
  payments: [],
  reservations: [],
  devices: [],

  token_counter: { value: 0 },
};

export function initDB() {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    saveDB(SEED);
  } else {
    // Back-fill missing collections
    const db = getDB();
    let changed = false;
    const defaults = [
      "users",
      "categories",
      "taxes",
      "payment_types",
      "store_tables",
      "menu_items",
      "customers",
      "orders",
      "order_items",
      "invoices",
      "payments",
      "reservations",
      "devices",
    ];
    defaults.forEach((k) => {
      if (db[k] === undefined) {
        db[k] = SEED[k];
        changed = true;
      }
    });
    if (!db.store_setting) {
      db.store_setting = SEED.store_setting;
      changed = true;
    }
    if (!db.print_setting) {
      db.print_setting = SEED.print_setting;
      changed = true;
    }
    if (!db.token_counter) {
      db.token_counter = SEED.token_counter;
      changed = true;
    }
    if (changed) saveDB(db);
  }
}

// ── Helpers ───────────────────────────────────────────────
function nextToken() {
  const db = getDB();
  db.token_counter = db.token_counter || { value: 0 };
  db.token_counter.value += 1;
  const val = db.token_counter.value;
  saveDB(db);
  return val;
}

function ok(data) {
  return Promise.resolve({ status: 200, data });
}

function filterByDateRange(items, dateField, type, from, to) {
  const now = new Date();
  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const endOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  let start, end;

  switch (type) {
    case "today":
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    case "yesterday": {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      start = startOfDay(y);
      end = endOfDay(y);
      break;
    }
    case "tomorrow": {
      const t = new Date(now);
      t.setDate(t.getDate() + 1);
      start = startOfDay(t);
      end = endOfDay(t);
      break;
    }
    case "last_7days": {
      const s = new Date(now);
      s.setDate(s.getDate() - 7);
      start = startOfDay(s);
      end = endOfDay(now);
      break;
    }
    case "this_month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = endOfDay(now);
      break;
    case "last_month": {
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      start = lm;
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;
    }
    case "custom":
      start = from ? new Date(from) : new Date(0);
      end = to ? endOfDay(new Date(to)) : endOfDay(now);
      break;
    default:
      return items;
  }

  return items.filter((item) => {
    const d = new Date(item[dateField]);
    return d >= start && d <= end;
  });
}

// ── USERS ─────────────────────────────────────────────────
export const Users = {
  getAll() {
    return col("users").map(({ password, ...u }) => u);
  },
  findByUsername(username) {
    return col("users").find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() ||
        u.email.toLowerCase() === username.toLowerCase(),
    );
  },
  add(username, password, name, designation, phone, email, userScopes) {
    const db = getDB();
    db.users = db.users || [];
    if (db.users.find((u) => u.username === username)) {
      throw new Error("Username already exists");
    }
    const user = {
      id: nextId("users"),
      username,
      password,
      name,
      designation,
      phone,
      email,
      role: "staff",
      scope: userScopes || "",
      tenant_id: "local_tenant_001",
      created_at: new Date().toISOString(),
    };
    db.users.push(user);
    saveDB(db);
    const { password: _p, ...safe } = user;
    return safe;
  },
  delete(username) {
    const db = getDB();
    db.users = (db.users || []).filter(
      (u) => u.username !== username && String(u.id) !== String(username),
    );
    saveDB(db);
  },
  updatePassword(username, password) {
    const db = getDB();
    const idx = (db.users || []).findIndex((u) => u.username === username);
    if (idx !== -1) {
      db.users[idx].password = password;
      saveDB(db);
    }
  },
  update(username, name, designation, phone, email, userScopes) {
    const db = getDB();
    const idx = (db.users || []).findIndex((u) => u.username === username);
    if (idx !== -1) {
      db.users[idx] = {
        ...db.users[idx],
        name,
        designation,
        phone,
        email,
        scope: userScopes || "",
      };
      saveDB(db);
      const { password: _p, ...safe } = db.users[idx];
      return safe;
    }
    return null;
  },
};

// ── CUSTOMERS ─────────────────────────────────────────────
export const Customers = {
  getAll({ page = 1, perPage = 10, filter = "" } = {}) {
    let items = col("customers");
    if (filter) {
      const q = filter.toLowerCase();
      items = items.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.phone || "").toLowerCase().includes(q),
      );
    }
    const total = items.length;
    const start = (page - 1) * perPage;
    return {
      customers: items.slice(start, start + perPage),
      total,
      page,
      perPage,
    };
  },
  search(query) {
    if (!query) return [];
    const q = query.toLowerCase();
    return col("customers").filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.phone || "").toLowerCase().includes(q),
    );
  },
  add(phone, name, email, birthDate, gender) {
    const db = getDB();
    db.customers = db.customers || [];
    const customer = {
      id: nextId("customers"),
      phone,
      name,
      email,
      birth_date: birthDate || null,
      gender: gender || null,
      visit_count: 0,
      created_at: new Date().toISOString(),
    };
    db.customers.push(customer);
    saveDB(db);
    return customer;
  },
  update(phone, name, email, birthDate, gender) {
    const db = getDB();
    const idx = (db.customers || []).findIndex((c) => c.phone === phone);
    if (idx !== -1) {
      db.customers[idx] = {
        ...db.customers[idx],
        name,
        email,
        birth_date: birthDate,
        gender,
      };
      saveDB(db);
      return db.customers[idx];
    }
    return null;
  },
  delete(id) {
    const db = getDB();
    db.customers = (db.customers || []).filter(
      (c) => String(c.id) !== String(id),
    );
    saveDB(db);
  },
};

// ── MENU ITEMS ────────────────────────────────────────────
export const MenuItems = {
  getAll() {
    const categories = col("categories");
    const taxes = col("taxes");
    return col("menu_items").map((item) => {
      const cat = categories.find((c) => c.id === item.category_id);
      const tax = taxes.find((t) => t.id === item.tax_id);
      return {
        ...item,
        category_title: cat?.title || "",
        tax_title: tax?.title || "",
        tax_rate: tax?.rate || 0,
        tax_type: tax?.type || "percentage",
      };
    });
  },
  getById(id) {
    const items = col("menu_items");
    const item = items.find((i) => String(i.id) === String(id));
    if (!item) return null;
    const categories = col("categories");
    const taxes = col("taxes");
    const cat = categories.find((c) => c.id === item.category_id);
    const tax = taxes.find((t) => t.id === item.tax_id);
    return {
      ...item,
      category_title: cat?.title || "",
      tax_title: tax?.title || "",
      tax_rate: tax?.rate || 0,
      tax_type: tax?.type || "percentage",
    };
  },
  add(title, price, netPrice, categoryId, taxId, imageFile) {
    const db = getDB();
    db.menu_items = db.menu_items || [];
    const categories = db.categories || [];
    const taxes = db.taxes || [];
    const cat = categories.find((c) => String(c.id) === String(categoryId));
    const tax = taxes.find((t) => String(t.id) === String(taxId));
    const item = {
      id: nextId("menu_items"),
      title,
      price: parseFloat(price) || 0,
      net_price: parseFloat(netPrice) || null,
      category_id: categoryId ? parseInt(categoryId) : null,
      category_title: cat?.title || "",
      tax_id: taxId ? parseInt(taxId) : null,
      tax_title: tax?.title || "",
      tax_rate: tax?.rate || 0,
      tax_type: tax?.type || "percentage",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    };
    db.menu_items.push(item);
    saveDB(db);
    return item;
  },
  update(id, title, price, netPrice, categoryId, taxId) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(id),
    );
    if (idx !== -1) {
      const categories = db.categories || [];
      const taxes = db.taxes || [];
      const cat = categories.find((c) => String(c.id) === String(categoryId));
      const tax = taxes.find((t) => String(t.id) === String(taxId));
      db.menu_items[idx] = {
        ...db.menu_items[idx],
        title,
        price: parseFloat(price) || 0,
        net_price: parseFloat(netPrice) || null,
        category_id: categoryId ? parseInt(categoryId) : null,
        category_title: cat?.title || "",
        tax_id: taxId ? parseInt(taxId) : null,
        tax_title: tax?.title || "",
        tax_rate: tax?.rate || 0,
        tax_type: tax?.type || "percentage",
      };
      saveDB(db);
      return db.menu_items[idx];
    }
    return null;
  },
  delete(id) {
    const db = getDB();
    db.menu_items = (db.menu_items || []).filter(
      (i) => String(i.id) !== String(id),
    );
    saveDB(db);
  },
  // --- Variants ---
  addVariant(itemId, title, price) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(itemId),
    );
    if (idx === -1) throw new Error("Item not found");
    db.menu_items[idx].variants = db.menu_items[idx].variants || [];
    const maxId = db.menu_items[idx].variants.reduce(
      (m, v) => Math.max(m, v.id || 0),
      0,
    );
    const variant = { id: maxId + 1, title, price: parseFloat(price) || 0 };
    db.menu_items[idx].variants.push(variant);
    saveDB(db);
    return db.menu_items[idx];
  },
  updateVariant(itemId, variantId, title, price) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(itemId),
    );
    if (idx === -1) throw new Error("Item not found");
    const vIdx = (db.menu_items[idx].variants || []).findIndex(
      (v) => String(v.id) === String(variantId),
    );
    if (vIdx !== -1) {
      db.menu_items[idx].variants[vIdx] = {
        ...db.menu_items[idx].variants[vIdx],
        title,
        price: parseFloat(price) || 0,
      };
    }
    saveDB(db);
    return db.menu_items[idx];
  },
  deleteVariant(itemId, variantId) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(itemId),
    );
    if (idx !== -1) {
      db.menu_items[idx].variants = (db.menu_items[idx].variants || []).filter(
        (v) => String(v.id) !== String(variantId),
      );
      saveDB(db);
    }
  },
  // --- Addons ---
  addAddon(itemId, title, price) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(itemId),
    );
    if (idx === -1) throw new Error("Item not found");
    db.menu_items[idx].addons = db.menu_items[idx].addons || [];
    const maxId = db.menu_items[idx].addons.reduce(
      (m, a) => Math.max(m, a.id || 0),
      0,
    );
    const addon = { id: maxId + 1, title, price: parseFloat(price) || 0 };
    db.menu_items[idx].addons.push(addon);
    saveDB(db);
    return db.menu_items[idx];
  },
  updateAddon(itemId, addonId, title, price) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(itemId),
    );
    if (idx === -1) throw new Error("Item not found");
    const aIdx = (db.menu_items[idx].addons || []).findIndex(
      (a) => String(a.id) === String(addonId),
    );
    if (aIdx !== -1) {
      db.menu_items[idx].addons[aIdx] = {
        ...db.menu_items[idx].addons[aIdx],
        title,
        price: parseFloat(price) || 0,
      };
    }
    saveDB(db);
    return db.menu_items[idx];
  },
  deleteAddon(itemId, addonId) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(itemId),
    );
    if (idx !== -1) {
      db.menu_items[idx].addons = (db.menu_items[idx].addons || []).filter(
        (a) => String(a.id) !== String(addonId),
      );
      saveDB(db);
    }
  },
};

// ── SETTINGS ──────────────────────────────────────────────
export const Settings = {
  getStoreSetting() {
    return getDB().store_setting || SEED.store_setting;
  },
  saveStoreSetting(data) {
    const db = getDB();
    db.store_setting = { ...db.store_setting, ...data };
    saveDB(db);
    return db.store_setting;
  },

  getPrintSetting() {
    return getDB().print_setting || SEED.print_setting;
  },
  savePrintSetting(data) {
    const db = getDB();
    db.print_setting = { ...db.print_setting, ...data };
    saveDB(db);
    return db.print_setting;
  },

  getPaymentTypes() {
    return col("payment_types");
  },
  addPaymentType(title, isActive) {
    const db = getDB();
    db.payment_types = db.payment_types || [];
    const pt = {
      id: nextId("payment_types"),
      title,
      is_active: isActive ? 1 : 0,
      created_at: new Date().toISOString(),
    };
    db.payment_types.push(pt);
    saveDB(db);
    return pt;
  },
  deletePaymentType(id) {
    const db = getDB();
    db.payment_types = (db.payment_types || []).filter(
      (p) => String(p.id) !== String(id),
    );
    saveDB(db);
  },
  togglePaymentType(id, isActive) {
    const db = getDB();
    const idx = (db.payment_types || []).findIndex(
      (p) => String(p.id) === String(id),
    );
    if (idx !== -1) {
      db.payment_types[idx].is_active = isActive ? 1 : 0;
      saveDB(db);
      return db.payment_types[idx];
    }
    return null;
  },
  updatePaymentType(id, title, isActive) {
    const db = getDB();
    const idx = (db.payment_types || []).findIndex(
      (p) => String(p.id) === String(id),
    );
    if (idx !== -1) {
      db.payment_types[idx] = {
        ...db.payment_types[idx],
        title,
        is_active: isActive ? 1 : 0,
      };
      saveDB(db);
      return db.payment_types[idx];
    }
    return null;
  },

  getTaxes() {
    return col("taxes");
  },
  addTax(title, rate, type) {
    const db = getDB();
    db.taxes = db.taxes || [];
    const tax = {
      id: nextId("taxes"),
      title,
      rate: parseFloat(rate) || 0,
      type,
      created_at: new Date().toISOString(),
    };
    db.taxes.push(tax);
    saveDB(db);
    return tax;
  },
  deleteTax(id) {
    const db = getDB();
    db.taxes = (db.taxes || []).filter((t) => String(t.id) !== String(id));
    saveDB(db);
  },
  updateTax(id, title, rate, type) {
    const db = getDB();
    const idx = (db.taxes || []).findIndex((t) => String(t.id) === String(id));
    if (idx !== -1) {
      db.taxes[idx] = {
        ...db.taxes[idx],
        title,
        rate: parseFloat(rate) || 0,
        type,
      };
      saveDB(db);
      return db.taxes[idx];
    }
    return null;
  },

  getStoreTables() {
    return col("store_tables");
  },
  addStoreTable(title, floor, seatingCapacity) {
    const db = getDB();
    db.store_tables = db.store_tables || [];
    const t = {
      id: nextId("store_tables"),
      title,
      floor,
      seating_capacity: seatingCapacity,
      created_at: new Date().toISOString(),
    };
    db.store_tables.push(t);
    saveDB(db);
    return t;
  },
  deleteStoreTable(id) {
    const db = getDB();
    db.store_tables = (db.store_tables || []).filter(
      (t) => String(t.id) !== String(id),
    );
    saveDB(db);
  },
  updateStoreTable(id, title, floor, seatingCapacity) {
    const db = getDB();
    const idx = (db.store_tables || []).findIndex(
      (t) => String(t.id) === String(id),
    );
    if (idx !== -1) {
      db.store_tables[idx] = {
        ...db.store_tables[idx],
        title,
        floor,
        seating_capacity: seatingCapacity,
      };
      saveDB(db);
      return db.store_tables[idx];
    }
    return null;
  },

  getCategories() {
    return col("categories");
  },
  addCategory(title) {
    const db = getDB();
    db.categories = db.categories || [];
    const cat = {
      id: nextId("categories"),
      title,
      created_at: new Date().toISOString(),
    };
    db.categories.push(cat);
    saveDB(db);
    return cat;
  },
  deleteCategory(id) {
    const db = getDB();
    db.categories = (db.categories || []).filter(
      (c) => String(c.id) !== String(id),
    );
    saveDB(db);
  },
  updateCategory(id, title) {
    const db = getDB();
    const idx = (db.categories || []).findIndex(
      (c) => String(c.id) === String(id),
    );
    if (idx !== -1) {
      db.categories[idx] = { ...db.categories[idx], title };
      saveDB(db);
      return db.categories[idx];
    }
    return null;
  },

  getDevices() {
    return col("devices");
  },
  removeDevice(deviceId) {
    const db = getDB();
    db.devices = (db.devices || []).filter(
      (d) => String(d.id) !== String(deviceId),
    );
    saveDB(db);
  },
};

// ── POS / ORDERS ──────────────────────────────────────────
export const Orders = {
  getPOSInit() {
    const db = getDB();
    return {
      categories: db.categories || [],
      menuItems: MenuItems.getAll(),
      paymentTypes: Settings.getPaymentTypes().filter((p) => p.is_active),
      printSettings: Settings.getPrintSetting(),
      storeSettings: Settings.getStoreSetting(),
      storeTables: Settings.getStoreTables(),
    };
  },

  createOrder(
    cart,
    deliveryType,
    customerType,
    customerId,
    tableId,
    selectedQrOrderItem,
  ) {
    const db = getDB();
    db.orders = db.orders || [];
    db.order_items = db.order_items || [];

    const tokenNo = nextToken();
    const tables = db.store_tables || [];
    const table = tables.find((t) => String(t.id) === String(tableId));
    const customers = db.customers || [];
    const customer = customers.find((c) => String(c.id) === String(customerId));

    const orderId = nextId("orders");
    let netTotal = 0;
    let taxTotal = 0;

    const orderItems = (cart || []).map((item) => {
      const itemPrice = item.variant ? item.variant.price : item.price;
      const lineNet = itemPrice * item.quantity;
      const taxAmount =
        item.tax_type === "percentage"
          ? lineNet * (item.tax_rate / 100)
          : (item.tax_rate || 0) * item.quantity;
      netTotal += lineNet;
      taxTotal += taxAmount;

      const oiId =
        (db.order_items.length === 0
          ? 1
          : Math.max(...db.order_items.map((oi) => oi.id || 0)) + 1) +
        db.order_items.reduce((acc) => acc, 0);

      return {
        id: Date.now() + Math.random(),
        order_id: orderId,
        menu_item_id: item.id,
        title: item.title,
        price: itemPrice,
        quantity: item.quantity,
        notes: item.notes || "",
        tax_rate: item.tax_rate || 0,
        tax_type: item.tax_type || "percentage",
        tax_title: item.tax_title || "",
        variant: item.variant || null,
        addons: item.addons || [],
        addons_ids: item.addons_ids || [],
        status: "pending",
      };
    });

    const order = {
      id: orderId,
      token_no: tokenNo,
      delivery_type: deliveryType,
      customer_type: customerType,
      customer_id: customerId || null,
      customer_name: customer?.name || null,
      table_id: tableId || null,
      table_title: table?.title || null,
      status: "pending",
      payment_status: "unpaid",
      net_total: parseFloat(netTotal.toFixed(2)),
      tax_total: parseFloat(taxTotal.toFixed(2)),
      total: parseFloat((netTotal + taxTotal).toFixed(2)),
      order_items: orderItems,
      is_qr_order: selectedQrOrderItem ? 1 : 0,
      created_at: new Date().toISOString(),
    };

    db.orders.push(order);
    // also increment customer visit count
    if (customerId) {
      const cIdx = (db.customers || []).findIndex(
        (c) => String(c.id) === String(customerId),
      );
      if (cIdx !== -1) {
        db.customers[cIdx].visit_count =
          (db.customers[cIdx].visit_count || 0) + 1;
      }
    }
    saveDB(db);

    window.dispatchEvent(new Event("orders_updated"));
    return { orderId, tokenNo };
  },

  createOrderAndInvoice(
    cart,
    deliveryType,
    customerType,
    customerId,
    tableId,
    netTotal,
    taxTotal,
    total,
    selectedQrOrderItem,
  ) {
    const { orderId, tokenNo } = Orders.createOrder(
      cart,
      deliveryType,
      customerType,
      customerId,
      tableId,
      selectedQrOrderItem,
    );

    // Update order as paid
    const db = getDB();
    const oIdx = (db.orders || []).findIndex((o) => o.id === orderId);
    if (oIdx !== -1) {
      db.orders[oIdx].status = "completed";
      db.orders[oIdx].payment_status = "paid";
      db.orders[oIdx].net_total =
        parseFloat(netTotal) || db.orders[oIdx].net_total;
      db.orders[oIdx].tax_total =
        parseFloat(taxTotal) || db.orders[oIdx].tax_total;
      db.orders[oIdx].total = parseFloat(total) || db.orders[oIdx].total;
    }

    // Create invoice
    const customers = db.customers || [];
    const customer = customers.find((c) => String(c.id) === String(customerId));
    const invoiceId = nextId("invoices");
    const invoice = {
      id: invoiceId,
      order_ids: [orderId],
      token_ids: String(tokenNo),
      token_no: tokenNo,
      customer_id: customerId || null,
      customer_name: customer?.name || null,
      net_total: parseFloat(netTotal) || 0,
      tax_total: parseFloat(taxTotal) || 0,
      total: parseFloat(total) || 0,
      payment_status: "paid",
      created_at: new Date().toISOString(),
    };
    db.invoices = db.invoices || [];
    db.invoices.push(invoice);
    saveDB(db);

    window.dispatchEvent(new Event("orders_updated"));
    return { orderId, tokenNo, invoiceId };
  },

  getKitchenOrders() {
    const orders = col("orders");
    return orders
      .filter((o) => o.status === "pending" || o.status === "preparing")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },

  getOrdersInit() {
    return {
      printSettings: Settings.getPrintSetting(),
      storeSettings: Settings.getStoreSetting(),
      paymentTypes: Settings.getPaymentTypes(),
    };
  },

  updateOrderItemStatus(orderItemId, status) {
    const db = getDB();
    for (const order of db.orders || []) {
      const oi = (order.order_items || []).find(
        (i) => String(i.id) === String(orderItemId),
      );
      if (oi) {
        oi.status = status;
        // if all items are completed/cancelled, complete the order
        const allDone = order.order_items.every(
          (i) => i.status === "completed" || i.status === "cancelled",
        );
        if (allDone) order.status = "completed";
        break;
      }
    }
    saveDB(db);
    window.dispatchEvent(new Event("orders_updated"));
    return { success: true };
  },

  cancelOrders(orderIds) {
    const db = getDB();
    (db.orders || []).forEach((o) => {
      if (
        orderIds.includes(o.id) ||
        orderIds.map(String).includes(String(o.id))
      ) {
        o.status = "cancelled";
        (o.order_items || []).forEach((i) => {
          i.status = "cancelled";
        });
      }
    });
    saveDB(db);
    window.dispatchEvent(new Event("orders_updated"));
    return { success: true };
  },

  completeOrders(orderIds) {
    const db = getDB();
    (db.orders || []).forEach((o) => {
      if (
        orderIds.includes(o.id) ||
        orderIds.map(String).includes(String(o.id))
      ) {
        o.status = "completed";
        (o.order_items || []).forEach((i) => {
          i.status = "completed";
        });
      }
    });
    saveDB(db);
    window.dispatchEvent(new Event("orders_updated"));
    return { success: true };
  },

  getCompleteOrderPaymentSummary(orderIds) {
    const orders = col("orders").filter(
      (o) =>
        orderIds.includes(o.id) || orderIds.map(String).includes(String(o.id)),
    );
    const netTotal = orders.reduce((s, o) => s + (o.net_total || 0), 0);
    const taxTotal = orders.reduce((s, o) => s + (o.tax_total || 0), 0);
    const total = orders.reduce((s, o) => s + (o.total || 0), 0);
    return { netTotal, taxTotal, total, orders };
  },

  payAndCompleteOrders(orderIds, subTotal, taxTotal, total) {
    const db = getDB();
    (db.orders || []).forEach((o) => {
      if (
        orderIds.includes(o.id) ||
        orderIds.map(String).includes(String(o.id))
      ) {
        o.status = "completed";
        o.payment_status = "paid";
        (o.order_items || []).forEach((i) => {
          i.status = "completed";
        });
      }
    });

    // Create invoice
    const invoiceId = nextId("invoices");
    const tokenIds = (db.orders || [])
      .filter(
        (o) =>
          orderIds.includes(o.id) ||
          orderIds.map(String).includes(String(o.id)),
      )
      .map((o) => o.token_no)
      .join(",");
    const invoice = {
      id: invoiceId,
      order_ids: orderIds,
      token_ids: tokenIds,
      net_total: parseFloat(subTotal) || 0,
      tax_total: parseFloat(taxTotal) || 0,
      total: parseFloat(total) || 0,
      payment_status: "paid",
      created_at: new Date().toISOString(),
    };
    db.invoices = db.invoices || [];
    db.invoices.push(invoice);
    saveDB(db);
    window.dispatchEvent(new Event("orders_updated"));
    return { success: true, invoiceId };
  },

  // QR orders (simplified - treated as regular orders with is_qr_order=1)
  getQROrdersCount() {
    const pendingQR = col("orders").filter(
      (o) => o.is_qr_order === 1 && o.status === "pending",
    );
    return { totalQROrders: pendingQR.length };
  },
  getQROrders() {
    return col("orders").filter(
      (o) => o.is_qr_order === 1 && o.status === "pending",
    );
  },
  cancelAllQROrders() {
    const db = getDB();
    (db.orders || []).forEach((o) => {
      if (o.is_qr_order === 1 && o.status === "pending") {
        o.status = "cancelled";
      }
    });
    saveDB(db);
    window.dispatchEvent(new Event("orders_updated"));
    return { success: true };
  },
  cancelQROrder(orderId, status) {
    const db = getDB();
    const idx = (db.orders || []).findIndex(
      (o) => String(o.id) === String(orderId),
    );
    if (idx !== -1) {
      db.orders[idx].status = status || "cancelled";
    }
    saveDB(db);
    window.dispatchEvent(new Event("orders_updated"));
    return { success: true };
  },
};

// ── RESERVATIONS ──────────────────────────────────────────
export const Reservations = {
  getInit() {
    return { storeTables: Settings.getStoreTables() };
  },
  getAll({ type, from = null, to = null } = {}) {
    let items = col("reservations");
    const tables = col("store_tables");
    items = items.map((r) => {
      const table = tables.find((t) => String(t.id) === String(r.table_id));
      return { ...r, table_title: table?.title || "" };
    });
    if (type) {
      items = filterByDateRange(items, "date", type, from, to);
    }
    return items.sort((a, b) => new Date(a.date) - new Date(b.date));
  },
  search(query) {
    const q = (query || "").toLowerCase();
    const tables = col("store_tables");
    return col("reservations")
      .filter(
        (r) =>
          (r.customer_name || "").toLowerCase().includes(q) ||
          (r.notes || "").toLowerCase().includes(q) ||
          (r.unique_code || "").toLowerCase().includes(q),
      )
      .map((r) => {
        const table = tables.find((t) => String(t.id) === String(r.table_id));
        return { ...r, table_title: table?.title || "" };
      });
  },
  add(customerId, date, tableId, status, notes, peopleCount) {
    const db = getDB();
    db.reservations = db.reservations || [];
    const customers = db.customers || [];
    const customer = customers.find((c) => String(c.id) === String(customerId));
    const tables = db.store_tables || [];
    const table = tables.find((t) => String(t.id) === String(tableId));
    const uniqueCode = "RES" + String(nextId("reservations")).padStart(4, "0");
    const reservation = {
      id: nextId("reservations"),
      customer_id: customerId || null,
      customer_name: customer?.name || null,
      date: date,
      table_id: tableId || null,
      table_title: table?.title || null,
      status: status || "pending",
      notes: notes || "",
      people_count: peopleCount || 1,
      unique_code: uniqueCode,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.reservations.push(reservation);
    saveDB(db);
    return reservation;
  },
  delete(id) {
    const db = getDB();
    db.reservations = (db.reservations || []).filter(
      (r) => String(r.id) !== String(id),
    );
    saveDB(db);
  },
  update(id, date, tableId, status, notes, peopleCount) {
    const db = getDB();
    const idx = (db.reservations || []).findIndex(
      (r) => String(r.id) === String(id),
    );
    if (idx !== -1) {
      const tables = db.store_tables || [];
      const table = tables.find((t) => String(t.id) === String(tableId));
      db.reservations[idx] = {
        ...db.reservations[idx],
        date,
        tableId,
        table_id: tableId || null,
        table_title: table?.title || null,
        status: status || "pending",
        notes: notes || "",
        people_count: peopleCount || 1,
        updated_at: new Date().toISOString(),
      };
      saveDB(db);
      return db.reservations[idx];
    }
    return null;
  },
};

// ── INVOICES ──────────────────────────────────────────────
export const Invoices = {
  getAll({ type, from = null, to = null } = {}) {
    let items = col("invoices");
    if (type) {
      items = filterByDateRange(items, "created_at", type, from, to);
    }
    return items.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
  },
  getInit() {
    return {
      printSettings: Settings.getPrintSetting(),
      storeSettings: Settings.getStoreSetting(),
    };
  },
  getOrdersByInvoice(orderIds) {
    const orders = col("orders").filter(
      (o) =>
        orderIds.includes(o.id) || orderIds.map(String).includes(String(o.id)),
    );
    const printSettings = Settings.getPrintSetting();
    const storeSettings = Settings.getStoreSetting();
    return { orders, printSettings, storeSettings };
  },
  search(query) {
    const q = (query || "").toLowerCase();
    return col("invoices").filter(
      (i) =>
        String(i.token_ids || "").includes(q) ||
        (i.customer_name || "").toLowerCase().includes(q) ||
        String(i.id).includes(q),
    );
  },
};

// ── REPORTS ───────────────────────────────────────────────
export const Reports = {
  get({ type, from = null, to = null } = {}) {
    const storeSetting = Settings.getStoreSetting();
    let orders = col("orders").filter(
      (o) => o.status === "completed" || o.payment_status === "paid",
    );
    if (type) {
      orders = filterByDateRange(orders, "created_at", type, from, to);
    }

    const ordersCount = orders.length;
    const netRevenue = orders.reduce((s, o) => s + (o.net_total || 0), 0);
    const taxTotal = orders.reduce((s, o) => s + (o.tax_total || 0), 0);
    const revenueTotal = orders.reduce((s, o) => s + (o.total || 0), 0);
    const averageOrderValue = ordersCount > 0 ? revenueTotal / ordersCount : 0;

    // Top selling items
    const itemCounts = {};
    orders.forEach((o) => {
      (o.order_items || []).forEach((oi) => {
        const key = oi.menu_item_id || oi.title;
        if (!itemCounts[key]) {
          itemCounts[key] = { title: oi.title, count: 0, revenue: 0 };
        }
        itemCounts[key].count += oi.quantity || 1;
        itemCounts[key].revenue += (oi.price || 0) * (oi.quantity || 1);
      });
    });
    const topSellingItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((i) => ({ ...i, total_quantity: i.count }));

    // Customers
    const customerIds = [
      ...new Set(orders.filter((o) => o.customer_id).map((o) => o.customer_id)),
    ];
    const allCustomers = col("customers");
    const totalCustomers = allCustomers.length;

    // New vs repeated customers (simplified)
    const allOrders = col("orders");
    let newCustomers = 0;
    let repeatedCustomers = 0;
    customerIds.forEach((cid) => {
      const prevOrders = allOrders.filter(
        (o) =>
          String(o.customer_id) === String(cid) &&
          !orders.find((or) => or.id === o.id),
      );
      if (prevOrders.length === 0) {
        newCustomers++;
      } else {
        repeatedCustomers++;
      }
    });

    return {
      ordersCount,
      newCustomers,
      repeatedCustomers,
      currency: storeSetting.currency,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      totalCustomers,
      netRevenue: parseFloat(netRevenue.toFixed(2)),
      taxTotal: parseFloat(taxTotal.toFixed(2)),
      topSellingItems,
      revenueTotal: parseFloat(revenueTotal.toFixed(2)),
    };
  },
};

// ── DASHBOARD ─────────────────────────────────────────────
export const Dashboard = {
  get() {
    const storeSetting = Settings.getStoreSetting();

    // Today's reservations
    const todayReservations = filterByDateRange(
      col("reservations").map((r) => {
        const tables = col("store_tables");
        const table = tables.find((t) => String(t.id) === String(r.table_id));
        const customers = col("customers");
        const customer = customers.find(
          (c) => String(c.id) === String(r.customer_id),
        );
        return {
          ...r,
          table_title: table?.title || "",
          customer_name: r.customer_name || customer?.name || "Walk-in",
        };
      }),
      "date",
      "today",
      null,
      null,
    );

    const reports = Reports.get({ type: "today" });

    return {
      reservations: todayReservations,
      topSellingItems: reports.topSellingItems,
      ordersCount: reports.ordersCount,
      newCustomerCount: reports.newCustomers,
      repeatedCustomerCount: reports.repeatedCustomers,
      currency: storeSetting.currency,
    };
  },
};
