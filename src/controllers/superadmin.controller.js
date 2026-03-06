// superadmin.controller.js – offline stub (superadmin not used in offline mode)
import { Users, initDB } from "../localdb/LocalDB";
import { clearUserDetailsInLocalStorage } from "../helpers/UserDetails";

initDB();

const STUB_DASHBOARD = { totalTenants: 0, activeTenants: 0, revenue: 0 };
const STUB_TENANTS = { tenants: [], total: 0 };

export async function signIn(username, password) {
  // Offline: superadmin login is disabled
  throw {
    response: {
      status: 401,
      data: { message: "Superadmin is not available in offline mode" },
    },
  };
}

export async function signOut() {
  clearUserDetailsInLocalStorage();
  localStorage.removeItem("session_user");
  return { status: 200, data: { message: "Signed out" } };
}

export function useSuperAdminDashboard() {
  return { data: STUB_DASHBOARD, error: null, isLoading: false, APIURL: null };
}

export function useSuperAdminTenantsData() {
  return { data: STUB_TENANTS, error: null, isLoading: false, APIURL: null };
}

export async function getSuperAdminTenantsData() {
  return { status: 200, data: STUB_TENANTS };
}

export async function getTenantsData({
  page,
  perPage,
  search,
  status,
  type,
  from,
  to,
}) {
  return { status: 200, data: STUB_TENANTS };
}

export async function addTenant(name, email, password, isActive) {
  return { status: 200, data: { message: "Not available in offline mode" } };
}

export async function updateTenant(name, email, isActive, id) {
  return { status: 200, data: { message: "Not available in offline mode" } };
}

export async function deleteTenant(id) {
  return { status: 200, data: { message: "Not available in offline mode" } };
}

export async function getTenantsDataByStatus(status) {
  return { status: 200, data: STUB_TENANTS };
}

export function useSuperAdminReports({ type, from = null, to = null }) {
  return { data: { reports: [] }, error: null, isLoading: false, APIURL: null };
}

export function useSuperAdminTenantSubscriptionHistory(tenantId) {
  return { data: { history: [] }, error: null, isLoading: false, APIURL: null };
}
