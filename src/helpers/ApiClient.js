// ============================================================
// ApiClient.js – Offline fake HTTP client backed by LocalDB
// All GET/POST/DELETE calls are routed to LocalDB helpers.
// Responses mimic Axios shape: { status, data }
// ============================================================
import {
  Dashboard,
  Orders,
  Customers,
  MenuItems,
  Settings,
  Reservations,
  Invoices,
  Reports,
  Users,
  initDB,
} from "../localdb/LocalDB";

// Initialise seed data on first load
initDB();

function ok(data) {
  return Promise.resolve({ status: 200, data });
}

function err(message = "Not found", status = 404) {
  return Promise.reject({ response: { status, data: { message } } });
}

// ── URL pattern helpers ───────────────────────────────────
function match(url, pattern) {
  const re = new RegExp(
    "^" + pattern.replace(/:[^/]+/g, "([^/?]+)") + "(?:\\?.*)?$",
  );
  return re.exec(url);
}

// ── Route table ───────────────────────────────────────────

async function handleGet(url) {
  let m;

  // Dashboard
  if (url === "/dashboard") return ok(Dashboard.get());

  // Orders / Kitchen
  if (url === "/orders") return ok(Orders.getKitchenOrders());
  if (url === "/orders/init") return ok(Orders.getOrdersInit());
  if (url === "/kitchen") return ok(Orders.getKitchenOrders());

  // QR Orders
  if (url === "/pos/qrorders/count") return ok(Orders.getQROrdersCount());
  if (url === "/pos/qrorders") return ok(Orders.getQROrders());

  // POS init
  if (url === "/pos/init") return ok(Orders.getPOSInit());

  // Customers
  if ((m = match(url, "/customers"))) {
    const params = new URLSearchParams(url.split("?")[1] || "");
    return ok(
      Customers.getAll({
        page: parseInt(params.get("page") || "1"),
        perPage: parseInt(params.get("perPage") || "10"),
        filter: params.get("filter") || "",
      }),
    );
  }
  if ((m = match(url, "/customers/search-by-phone-name/search"))) {
    const params = new URLSearchParams(url.split("?")[1] || "");
    return ok(Customers.search(params.get("q") || ""));
  }

  // Menu items
  if (url === "/menu-items") return ok(MenuItems.getAll());
  if ((m = match(url, "/menu-items/:id"))) return ok(MenuItems.getById(m[1]));

  // Settings
  if (url === "/settings/store-setting") return ok(Settings.getStoreSetting());
  if (url === "/settings/print-setting") return ok(Settings.getPrintSetting());
  if (url === "/settings/payment-types") return ok(Settings.getPaymentTypes());
  if (url === "/settings/taxes") return ok(Settings.getTaxes());
  if (url === "/settings/store-tables") return ok(Settings.getStoreTables());
  if (url === "/settings/categories") return ok(Settings.getCategories());
  if (url === "/auth/devices") return ok(Settings.getDevices());

  // Reservations
  if (url === "/reservations/init") return ok(Reservations.getInit());
  if ((m = match(url, "/reservations/search"))) {
    const params = new URLSearchParams(url.split("?")[1] || "");
    return ok(Reservations.search(params.get("q") || ""));
  }
  if (url.startsWith("/reservations")) {
    const params = new URLSearchParams(url.split("?")[1] || "");
    return ok(
      Reservations.getAll({
        type: params.get("type"),
        from: params.get("from"),
        to: params.get("to"),
      }),
    );
  }

  // Reports
  if (url.startsWith("/reports")) {
    const params = new URLSearchParams(url.split("?")[1] || "");
    return ok(
      Reports.get({
        type: params.get("type"),
        from: params.get("from"),
        to: params.get("to"),
      }),
    );
  }

  // Invoices
  if (url === "/invoices/init") return ok(Invoices.getInit());
  if ((m = match(url, "/invoices/search"))) {
    const params = new URLSearchParams(url.split("?")[1] || "");
    return ok(Invoices.search(params.get("q") || ""));
  }
  if (url.startsWith("/invoices")) {
    const params = new URLSearchParams(url.split("?")[1] || "");
    return ok(
      Invoices.getAll({
        type: params.get("type"),
        from: params.get("from"),
        to: params.get("to"),
      }),
    );
  }

  // Users
  if (url === "/users") return ok(Users.getAll());

  // Superadmin stubs
  if (url.startsWith("/superadmin"))
    return ok({ tenants: [], total: 0, revenue: 0 });

  console.warn("[FakeClient] Unhandled GET:", url);
  return ok(null);
}

async function handlePost(url, data) {
  let m;

  // Auth
  if (url === "/auth/signin" || url === "/auth/login") {
    const { username, password } = data || {};
    const { Users: U } = await import("../localdb/LocalDB");
    const user = U.findByUsername(username);
    if (!user || user.password !== password) {
      return err("Invalid username or password", 401);
    }
    const { password: _p, ...safeUser } = user;
    // Store session
    localStorage.setItem("session_user", JSON.stringify(safeUser));
    return ok({ message: "Login successful", user: safeUser });
  }

  // Orders / Kitchen status
  if ((m = match(url, "/orders/update-status/:id"))) {
    return ok(Orders.updateOrderItemStatus(m[1], data?.status));
  }
  if (url === "/orders/cancel") {
    return ok(Orders.cancelOrders(data?.orderIds || []));
  }
  if (url === "/orders/complete") {
    return ok(Orders.completeOrders(data?.orderIds || []));
  }
  if (url === "/orders/complete-order-payment-summary") {
    return ok(Orders.getCompleteOrderPaymentSummary(data?.orderIds || []));
  }
  if (url === "/orders/complete-and-pay-order") {
    return ok(
      Orders.payAndCompleteOrders(
        data?.orderIds,
        data?.subTotal,
        data?.taxTotal,
        data?.total,
      ),
    );
  }

  // Kitchen item status
  if ((m = match(url, "/kitchen/:id"))) {
    return ok(Orders.updateOrderItemStatus(m[1], data?.status));
  }

  // POS
  if (url === "/pos/create-order") {
    const result = Orders.createOrder(
      data?.cart,
      data?.deliveryType,
      data?.customerType,
      data?.customerId,
      data?.tableId,
      data?.selectedQrOrderItem,
    );
    return ok({ ...result, message: "Order created successfully" });
  }
  if (url === "/pos/create-order-and-invoice") {
    const result = Orders.createOrderAndInvoice(
      data?.cart,
      data?.deliveryType,
      data?.customerType,
      data?.customerId,
      data?.tableId,
      data?.netTotal,
      data?.taxTotal,
      data?.total,
      data?.selectedQrOrderItem,
    );
    return ok({ ...result, message: "Order and invoice created" });
  }
  if (url === "/pos/qrorders/cancel-all") {
    return ok(Orders.cancelAllQROrders());
  }
  if ((m = match(url, "/pos/qrorders/update-status/:id"))) {
    return ok(Orders.cancelQROrder(m[1], data?.status));
  }

  // Customers
  if (url === "/customers/add") {
    const c = Customers.add(
      data?.phone,
      data?.name,
      data?.email,
      data?.birthDate,
      data?.gender,
    );
    return ok({ customer: c, message: "Customer added successfully" });
  }
  if ((m = match(url, "/customers/:phone/update"))) {
    const c = Customers.update(
      m[1],
      data?.name,
      data?.email,
      data?.birthDate,
      data?.gender,
    );
    return ok({ customer: c, message: "Customer updated" });
  }

  // Menu Items
  if (url === "/menu-items/add") {
    const item = MenuItems.add(
      data?.title,
      data?.price,
      data?.netPrice,
      data?.categoryId,
      data?.taxId,
      null,
    );
    return ok({ menuItem: item, message: "Menu item added" });
  }
  if ((m = match(url, "/menu-items/update/:id"))) {
    const item = MenuItems.update(
      m[1],
      data?.title,
      data?.price,
      data?.netPrice,
      data?.categoryId,
      data?.taxId,
    );
    return ok({ menuItem: item, message: "Menu item updated" });
  }
  if ((m = match(url, "/menu-items/update/:id/upload-photo"))) {
    return ok({ message: "Photo updated (offline: no image storage)" });
  }
  if ((m = match(url, "/menu-items/update/:id/remove-photo"))) {
    MenuItems.update(
      m[1],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
    return ok({ message: "Photo removed" });
  }
  if ((m = match(url, "/menu-items/variants/:itemId/add"))) {
    const item = MenuItems.addVariant(m[1], data?.title, data?.price);
    return ok({ menuItem: item, message: "Variant added" });
  }
  if ((m = match(url, "/menu-items/variants/:itemId/update/:variantId"))) {
    const item = MenuItems.updateVariant(m[1], m[2], data?.title, data?.price);
    return ok({ menuItem: item, message: "Variant updated" });
  }
  if ((m = match(url, "/menu-items/addons/:itemId/add"))) {
    const item = MenuItems.addAddon(m[1], data?.title, data?.price);
    return ok({ menuItem: item, message: "Addon added" });
  }
  if ((m = match(url, "/menu-items/addons/:itemId/update/:addonId"))) {
    const item = MenuItems.updateAddon(m[1], m[2], data?.title, data?.price);
    return ok({ menuItem: item, message: "Addon updated" });
  }

  // Settings – Store
  if (url === "/settings/store-setting") {
    const s = Settings.saveStoreSetting(data);
    return ok({ setting: s, message: "Store settings saved" });
  }
  if (url === "/settings/print-setting") {
    const s = Settings.savePrintSetting(data);
    return ok({ setting: s, message: "Print settings saved" });
  }
  // Settings – Payment Types
  if (url === "/settings/payment-types/add") {
    const pt = Settings.addPaymentType(data?.title, data?.isActive);
    return ok({ paymentType: pt, message: "Payment type added" });
  }
  if ((m = match(url, "/settings/payment-types/:id/toggle"))) {
    const pt = Settings.togglePaymentType(m[1], data?.isActive);
    return ok({ paymentType: pt, message: "Toggled" });
  }
  if ((m = match(url, "/settings/payment-types/:id/update"))) {
    const pt = Settings.updatePaymentType(m[1], data?.title, data?.isActive);
    return ok({ paymentType: pt, message: "Payment type updated" });
  }
  // Settings – Taxes
  if (url === "/settings/taxes/add") {
    const t = Settings.addTax(data?.title, data?.rate, data?.type);
    return ok({ tax: t, message: "Tax added" });
  }
  if ((m = match(url, "/settings/taxes/:id/update"))) {
    const t = Settings.updateTax(m[1], data?.title, data?.rate, data?.type);
    return ok({ tax: t, message: "Tax updated" });
  }
  // Settings – Tables
  if (url === "/settings/store-tables/add") {
    const t = Settings.addStoreTable(
      data?.title,
      data?.floor,
      data?.seatingCapacity,
    );
    return ok({ table: t, message: "Table added" });
  }
  if ((m = match(url, "/settings/store-tables/:id/update"))) {
    const t = Settings.updateStoreTable(
      m[1],
      data?.title,
      data?.floor,
      data?.seatingCapacity,
    );
    return ok({ table: t, message: "Table updated" });
  }
  // Settings – Categories
  if (url === "/settings/categories/add") {
    const c = Settings.addCategory(data?.title);
    return ok({ category: c, message: "Category added" });
  }
  if ((m = match(url, "/settings/categories/:id/update"))) {
    const c = Settings.updateCategory(m[1], data?.title);
    return ok({ category: c, message: "Category updated" });
  }
  // Devices
  if (url === "/auth/remove-device") {
    Settings.removeDevice(data?.device_id);
    return ok({ message: "Device removed" });
  }

  // Reservations
  if (url === "/reservations/add") {
    const r = Reservations.add(
      data?.customerId,
      data?.date,
      data?.tableId,
      data?.status,
      data?.notes,
      data?.peopleCount,
    );
    return ok({ reservation: r, message: "Reservation added" });
  }
  if ((m = match(url, "/reservations/update/:id"))) {
    const r = Reservations.update(
      m[1],
      data?.date,
      data?.tableId,
      data?.status,
      data?.notes,
      data?.peopleCount,
    );
    return ok({ reservation: r, message: "Reservation updated" });
  }

  // Invoices
  if (url === "/invoices/orders") {
    const result = Invoices.getOrdersByInvoice(data?.orderIds || []);
    return ok(result);
  }

  // Users
  if (url === "/users/add") {
    const u = Users.add(
      data?.username,
      data?.password,
      data?.name,
      data?.designation,
      data?.phone,
      data?.email,
      data?.userScopes,
    );
    return ok({ user: u, message: "User added" });
  }
  if ((m = match(url, "/users/update-password/:username"))) {
    Users.updatePassword(m[1], data?.password);
    return ok({ message: "Password updated" });
  }
  if ((m = match(url, "/users/update/:username"))) {
    const u = Users.update(
      m[1],
      data?.name,
      data?.designation,
      data?.phone,
      data?.email,
      data?.userScopes,
    );
    return ok({ user: u, message: "User updated" });
  }

  // Superadmin stubs
  if (url.startsWith("/superadmin")) return ok({ message: "OK" });
  if (url === "/auth/refresh-token") return ok({ message: "OK" });

  console.warn("[FakeClient] Unhandled POST:", url);
  return ok({ message: "OK" });
}

async function handleDelete(url) {
  let m;

  if ((m = match(url, "/customers/:id/delete"))) {
    Customers.delete(m[1]);
    return ok({ message: "Customer deleted" });
  }
  if ((m = match(url, "/menu-items/delete/:id"))) {
    MenuItems.delete(m[1]);
    return ok({ message: "Menu item deleted" });
  }
  if ((m = match(url, "/menu-items/variants/:itemId/delete/:variantId"))) {
    MenuItems.deleteVariant(m[1], m[2]);
    return ok({ message: "Variant deleted" });
  }
  if ((m = match(url, "/menu-items/addons/:itemId/delete/:addonId"))) {
    MenuItems.deleteAddon(m[1], m[2]);
    return ok({ message: "Addon deleted" });
  }
  if ((m = match(url, "/settings/payment-types/:id"))) {
    Settings.deletePaymentType(m[1]);
    return ok({ message: "Payment type deleted" });
  }
  if ((m = match(url, "/settings/taxes/:id"))) {
    Settings.deleteTax(m[1]);
    return ok({ message: "Tax deleted" });
  }
  if ((m = match(url, "/settings/store-tables/:id"))) {
    Settings.deleteStoreTable(m[1]);
    return ok({ message: "Table deleted" });
  }
  if ((m = match(url, "/settings/categories/:id"))) {
    Settings.deleteCategory(m[1]);
    return ok({ message: "Category deleted" });
  }
  if ((m = match(url, "/users/delete/:username"))) {
    Users.delete(m[1]);
    return ok({ message: "User deleted" });
  }
  if ((m = match(url, "/reservations/delete/:id"))) {
    Reservations.delete(m[1]);
    return ok({ message: "Reservation deleted" });
  }

  console.warn("[FakeClient] Unhandled DELETE:", url);
  return ok({ message: "Deleted" });
}

// ── Public FakeClient API (axios-compatible) ──────────────
const FakeClient = {
  get: (url) => handleGet(url),
  post: (url, data) => {
    // Handle FormData from menu item uploads
    if (data instanceof FormData) {
      const obj = {};
      for (const [k, v] of data.entries()) {
        if (!(v instanceof File)) obj[k] = v;
      }
      return handlePost(url, obj);
    }
    return handlePost(url, data);
  },
  put: (url, data) => handlePost(url, data),
  patch: (url, data) => handlePost(url, data),
  delete: (url) => handleDelete(url),
};

export default FakeClient;
