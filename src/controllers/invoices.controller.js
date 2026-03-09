import ApiClient from "../helpers/ApiClient";
import useSWR from "swr";

const fetcher = (url) => ApiClient.get(url).then((res) => res.data);

const MOCK_INVOICES = [
  {
    invoice_id: "INV-1001",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    sub_total: "18.50",
    tax_total: "1.85",
    total: "20.35",
    table_id: 3,
    table_title: "T3",
    floor: "Ground",
    delivery_type: "Dine-In",
    customer_type: "regular",
    customer_id: null,
    name: null,
    email: null,
    orders: [
      { order_id: 201, token_no: "A1" },
      { order_id: 202, token_no: "A2" },
    ],
  },
  {
    invoice_id: "INV-1002",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    sub_total: "32.00",
    tax_total: "3.20",
    total: "35.20",
    table_id: null,
    table_title: null,
    floor: null,
    delivery_type: "Takeaway",
    customer_type: "regular",
    customer_id: 7,
    name: "Alice Johnson",
    email: "alice@example.com",
    orders: [{ order_id: 203, token_no: "B5" }],
  },
  {
    invoice_id: "INV-1003",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    sub_total: "54.00",
    tax_total: "5.40",
    total: "59.40",
    table_id: 1,
    table_title: "T1",
    floor: "First",
    delivery_type: "Dine-In",
    customer_type: "vip",
    customer_id: 12,
    name: "Bob Martinez",
    email: "bob@example.com",
    orders: [
      { order_id: 204, token_no: "C3" },
      { order_id: 205, token_no: "C4" },
    ],
  },
  {
    invoice_id: "INV-1004",
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    sub_total: "12.00",
    tax_total: "1.20",
    total: "13.20",
    table_id: null,
    table_title: null,
    floor: null,
    delivery_type: "Delivery",
    customer_type: "regular",
    customer_id: null,
    name: null,
    email: null,
    orders: [{ order_id: 206, token_no: "D9" }],
  },
  {
    invoice_id: "INV-1005",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    sub_total: "45.75",
    tax_total: "4.58",
    total: "50.33",
    table_id: 5,
    table_title: "T5",
    floor: "Ground",
    delivery_type: "Dine-In",
    customer_type: "regular",
    customer_id: 19,
    name: "Sara Lee",
    email: "sara@example.com",
    orders: [{ order_id: 207, token_no: "E2" }],
  },
];

export function useInvoices({ type, from = null, to = null }) {
  const APIURL = `/invoices?type=${type}&from=${from}&to=${to}`;
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  const resolvedData =
    !isLoading && !error && Array.isArray(data) && data.length === 0
      ? MOCK_INVOICES
      : data;
  return {
    data: resolvedData,
    error,
    isLoading,
    APIURL,
  };
}

export async function getInvoicesInit() {
  try {
    const res = await ApiClient.get("/invoices/init");
    return res;
  } catch (error) {
    throw error;
  }
}

export async function getInvoiceOrders(orderIds) {
  try {
    const res = await ApiClient.post("/invoices/orders", {
      orderIds,
    });
    return res;
  } catch (error) {
    throw error;
  }
}

export async function searchInvoices(query) {
  try {
    const response = await ApiClient.get(`/invoices/search?q=${query}`);
    return response;
  } catch (error) {
    throw error;
  }
}
