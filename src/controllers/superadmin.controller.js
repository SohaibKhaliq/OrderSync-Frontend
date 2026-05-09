import ApiClient from "../helpers/ApiClient";
import { clearUserDetailsInLocalStorage } from "../helpers/UserDetails";
import useSWR from "swr";

const fetcher = (url) => ApiClient.get(url).then((res) => res.data);

export async function signIn(username, password) {
  try {
    const response = await ApiClient.post("/superadmin/auth/signin", { username, password });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function signOut() {
  try {
    const response = await ApiClient.post("/superadmin/auth/signout");
    clearUserDetailsInLocalStorage();
    return response;
  } catch (error) {
    throw error;
  }
}

export function useSuperAdminDashboard() {
  const APIURL = "/superadmin/dashboard";
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  return {
    data,
    error,
    isLoading,
    APIURL,
  };
}

export function useSuperAdminTenantsData() {
  const APIURL = "/superadmin/tenants";
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  return {
    data,
    error,
    isLoading,
    APIURL,
  };
}

export async function getSuperAdminTenantsData() {
  try {
    const response = await ApiClient.get("/superadmin/tenants");
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getTenantsData({
  page = 1,
  perPage = 10,
  search = "",
  status = "",
  type = "",
  from = "",
  to = "",
}) {
  try {
    const response = await ApiClient.get(`/superadmin/tenants?page=${page}&perPage=${perPage}&search=${search}&status=${status}&type=${type}&from=${from}&to=${to}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function addTenant(name, email, password, isActive) {
  try {
    const response = await ApiClient.post("/superadmin/tenants/add", { name, email, password, isActive });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function updateTenant(name, email, isActive, id) {
  try {
    const response = await ApiClient.post(`/superadmin/tenants/${id}/update`, { name, email, isActive });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function deleteTenant(id) {
  try {
    const response = await ApiClient.delete(`/superadmin/tenants/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getTenantsDataByStatus(status) {
  try {
    const response = await ApiClient.get(`/superadmin/tenants?status=${status}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export function useSuperAdminReports({ type, from = null, to = null }) {
  const APIURL = `/superadmin/reports?type=${type}&from=${from}&to=${to}`;
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  return {
    data,
    error,
    isLoading,
    APIURL,
  };
}

export function useSuperAdminTenantSubscriptionHistory(tenantId) {
  const APIURL = `/superadmin/tenants/${tenantId}/subscription-history`;
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  return {
    data,
    error,
    isLoading,
    APIURL,
  };
}
