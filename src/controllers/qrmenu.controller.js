import ApiClient from "../helpers/ApiClient";

const CART_KEY = "ordersync__CART";

export async function getQRMenuInit(qrcode, tableId) {
  try {
    const response = await ApiClient.get(`/qrmenu/${qrcode || 'default'}?tableId=${tableId || ''}`);
    return response;
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

export async function getStoreTables(qrcode = "default") {
  try {
    const response = await ApiClient.get(`/qrmenu/${qrcode}/tables`);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function createOrderFromQrMenu(
  deliveryType,
  cartItems,
  customerType,
  customer,
  tableId,
  paymentMethod = "cash",
  paymentRef = null,
  qrcode = "default"
) {
  try {
    const response = await ApiClient.post(`/qrmenu/${qrcode || 'default'}/place-order`, {
      deliveryType,
      cartItems,
      customerType,
      customer,
      tableId,
      paymentMethod,
      paymentRef
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cafeCustomerLogin(phone, password, qrcode = "default") {
  try {
    const response = await ApiClient.post(`/qrmenu/${qrcode}/auth/login`, { phone, password });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cafeCustomerRegister(phone, name, email, password, qrcode = "default") {
  try {
    const response = await ApiClient.post(`/qrmenu/${qrcode}/auth/register`, { phone, name, email, password });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cafeCustomerWalletTopup(phone, amount, method, ref, qrcode = "default") {
  try {
    const response = await ApiClient.post(`/qrmenu/${qrcode}/wallet/topup`, { phone, amount, method, ref });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cafeCustomerWalletHistory(phone, qrcode = "default") {
  try {
    const response = await ApiClient.get(`/qrmenu/${qrcode}/wallet/history?phone=${phone}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cafeCustomerOrders(phone, qrcode = "default") {
  try {
    const response = await ApiClient.get(`/qrmenu/${qrcode}/orders?phone=${phone}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cafeCustomerOrderDetails(orderId, qrcode = "default") {
  try {
    const response = await ApiClient.get(`/qrmenu/${qrcode}/orders/${orderId}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cafeCustomerAddReservation(customerId, date, tableId, peopleCount, notes = "", qrcode = "default") {
  try {
    const response = await ApiClient.post(`/qrmenu/${qrcode}/reservations`, {
      customerId,
      date,
      tableId,
      peopleCount,
      notes
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function sendPaymentOTP(email, qrcode = "default") {
  try {
    const response = await ApiClient.post(`/qrmenu/${qrcode}/auth/send-otp`, { email });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function verifyPaymentOTP(email, otp, qrcode = "default") {
  try {
    const response = await ApiClient.post(`/qrmenu/${qrcode}/auth/verify-otp`, { email, otp });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function createStripePaymentIntent(amount, currency, qrcode = "default") {
  try {
    const response = await ApiClient.post(`/qrmenu/${qrcode}/payment/create-intent`, { amount, currency });
    return response;
  } catch (error) {
    throw error;
  }
}
