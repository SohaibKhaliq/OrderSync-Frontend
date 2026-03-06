// qrmenu.controller.js – offline mode
// QR menu public-facing pages read from LocalDB directly
import { Settings, MenuItems, Orders, Customers } from "../localdb/LocalDB";

const CART_KEY = "ordersync__CART";

export async function getQRMenuInit(qrcode, tableId) {
  try {
    const storeSettings = Settings.getStoreSetting();
    const menuItems = MenuItems.getAll();
    const categories = Settings.getCategories();
    return {
      status: 200,
      data: {
        storeSettings,
        menuItems,
        categories,
        tableId,
        qrcode,
      },
    };
  } catch (error) {
    throw error;
  }
}

export function getCart() {
  const cartString = localStorage.getItem(CART_KEY);
  const cart = cartString ? JSON.parse(cartString) : [];
  return cart;
}

export function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export async function createOrderFromQrMenu(
  deliveryType,
  cartItems,
  customerType,
  customer,
  tableId,
  qrcode,
) {
  try {
    // Add customer if new
    let customerId = customer?.id || null;
    if (customer && !customerId && customer.phone) {
      const existing = Customers.search(customer.phone);
      if (existing.length > 0) {
        customerId = existing[0].id;
      } else {
        const newCustomer = Customers.add(
          customer.phone,
          customer.name,
          customer.email,
          null,
          null,
        );
        customerId = newCustomer.id;
      }
    }

    const result = Orders.createOrder(
      cartItems,
      deliveryType,
      customerType,
      customerId,
      tableId,
      null,
    );
    return {
      status: 200,
      data: { ...result, message: "Order placed successfully" },
    };
  } catch (error) {
    throw error;
  }
}
