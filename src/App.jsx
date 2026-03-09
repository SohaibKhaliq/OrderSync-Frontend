import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./helpers/PrivateRoute";
import LoginPage from "./views/LoginPage";
import DashboardLayout from "./views/DashboardLayout";
import DashboardPage from "./views/DashboardPage";
import POSPage from "./views/POSPage";
import OrdersPage from "./views/OrdersPage";
import KitchenPage from "./views/KitchenPage";
import ReservationPage from "./views/ReservationPage";
import CustomersPage from "./views/CustomersPage";
import InvoicesPage from "./views/InvoicesPage";
import UsersPage from "./views/UsersPage";
import ReportsPage from "./views/ReportsPage";
import SettingsPage from "./views/SettingsPage";
import SettingDetailsPage from "./views/SettingsViews/SettingDetailsPage";
import PrintSettingsPage from "./views/SettingsViews/PrintSettingsPage";
import TablesSettingsPage from "./views/SettingsViews/TableSettingsPage";
import MenuItemsSettingsPage from "./views/SettingsViews/MenuItemsSettingsPage";
import TaxSetupPage from "./views/SettingsViews/TaxSetupPage";
import PaymentTypesPage from "./views/SettingsViews/PaymentTypesPage";

import CategoriesPage from "./views/SettingsViews/CategoriesPage";
import MenuItemViewPage from "./views/SettingsViews/MenuItemViewPage";
import { NavbarContext } from "./contexts/NavbarContext";
import { getIsNavbarCollapsed } from "./helpers/NavbarSettings";
import PrintReceiptPage from "./views/PrintReceiptPage";
import PrintTokenPage from "./views/PrintTokenPage";
import NoAccessPage from "./views/NoAccessPage";
import ProfilePage from "./views/ProfilePage";
import { SCOPES } from "./config/scopes";
import ScopeProtectedRoute from "./helpers/ScopeProtectedRoute";
import { SocketProvider } from "./contexts/SocketContext";
import RegistrationPage from "./views/RegistrationPage";
import ForgotPasswordPage from "./views/ForgotPasswordPage";
import InActiveSubscriptionPage from "./views/InActiveSubscriptionPage";
import PaymentSuccessPage from "./views/PaymentSuccessPage";
import PaymentCancelledPage from "./views/PaymentCancelledPage";
import ResetPasswordPage from "./views/ResetPasswordPage";
import QRMenuPage from "./views/QRMenuPage";
import SuperAdminProtectedRoute from "./helpers/SuperAdminProtectedRoute";
import SuperAdminLoginPage from "./views/SuperAdmin/LoginPage";
import SuperAdminDashboadLayout from "./views/SuperAdmin/SuperAdminDashboadLayout";
import SuperAdminDashboardPage from "./views/SuperAdmin/SuperAdminDashboardPage";
import SuperAdminTenantsPage from "./views/SuperAdmin/SuperAdminTenantsPage";
import SuperAdminReportsPage from "./views/SuperAdmin/SuperAdminReportsPage";
import SuperAdminTenantSubscriptionHistoryPage from "./views/SuperAdmin/SuperAdminTenantSubscriptionHistoryPage";
import CartPage from "./views/CartPage";
import OrderSuccessPage from "./views/OrderSuccessPage";
import OrderFailedPage from "./views/OrderFailedPage";
import CafeOrdersAdminPage from "./views/CafeOrdersAdminPage";
import CafeTableQRAdminPage from "./views/CafeTableQRAdminPage";

// ── OCOS – Customer Portal ────────────────────────────────
import { CustomerProvider } from "./contexts/CustomerContext";
import { CafeCartProvider } from "./contexts/CafeCartContext";
import CustomerRoute from "./helpers/CustomerRoute";
import CafeLandingPage from "./views/cafe/CafeLandingPage";
import CafeLoginPage from "./views/cafe/CafeLoginPage";
import CafeRegisterPage from "./views/cafe/CafeRegisterPage";
import CafeMenuPage from "./views/cafe/CafeMenuPage";
import CafeCartPage from "./views/cafe/CafeCartPage";
import CafeCheckoutPage from "./views/cafe/CafeCheckoutPage";
import CafeOrdersPage from "./views/cafe/CafeOrdersPage";
import CafeOrderTrackingPage from "./views/cafe/CafeOrderTrackingPage";
import CafeAboutPage from "./views/cafe/CafeAboutPage";
import CafeGalleryPage from "./views/cafe/CafeGalleryPage";
import CafeContactPage from "./views/cafe/CafeContactPage";
import CafeReservationPage from "./views/cafe/CafeReservationPage";
import CafeWalletPage from "./views/cafe/CafeWalletPage";
import CafeTableQRPage from "./views/cafe/CafeTableQRPage";
import CafeLayout from "./views/cafe/CafeLayout";

// ── Payment Gateway Simulations ───────────────────────────
import JazzCashPage from "./views/payment/JazzCashPage";
import EasypaisaPage from "./views/payment/EasypaisaPage";
import StripePage from "./views/payment/StripePage";
import PaymentResultPage from "./views/payment/PaymentResultPage";

export default function App() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(
    getIsNavbarCollapsed(),
  );

  return (
    <SocketProvider>
      <CustomerProvider>
        <CafeCartProvider>
          <NavbarContext.Provider
            value={[isNavbarCollapsed, setIsNavbarCollapsed]}
          >
            <BrowserRouter>
              <Routes>
                {/* ── Customer cafe portal (root) ── */}
                <Route element={<CafeLayout />}>
                  <Route path="/" element={<CafeLandingPage />} />
                  <Route path="/about" element={<CafeAboutPage />} />
                  <Route path="/gallery" element={<CafeGalleryPage />} />
                  <Route path="/contact" element={<CafeContactPage />} />
                  <Route path="/reserve" element={<CafeReservationPage />} />
                  <Route path="/login" element={<CafeLoginPage />} />
                  <Route path="/register" element={<CafeRegisterPage />} />
                  <Route
                    path="/menu"
                    element={
                      <CustomerRoute>
                        <CafeMenuPage />
                      </CustomerRoute>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <CustomerRoute>
                        <CafeCartPage />
                      </CustomerRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <CustomerRoute>
                        <CafeCheckoutPage />
                      </CustomerRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <CustomerRoute>
                        <CafeOrdersPage />
                      </CustomerRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <CustomerRoute>
                        <CafeOrderTrackingPage />
                      </CustomerRoute>
                    }
                  />
                  <Route
                    path="/wallet"
                    element={
                      <CustomerRoute>
                        <CafeWalletPage />
                      </CustomerRoute>
                    }
                  />
                </Route>

                {/* QR table landing — no auth required */}
                <Route path="/table/:tableId" element={<CafeTableQRPage />} />

                {/* ── Staff login / register ── */}
                <Route path="/staff/login" element={<LoginPage />} />
                <Route path="/staff/register" element={<RegistrationPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/print-receipt" element={<PrintReceiptPage />} />
                <Route path="/print-token" element={<PrintTokenPage />} />
                <Route path="/no-access" element={<NoAccessPage />} />

                <Route path="/success" element={<PaymentSuccessPage />} />
                <Route
                  path="/cancelled-payment"
                  element={<PaymentCancelledPage />}
                />

                <Route
                  path="/dashboard/inactive-subscription"
                  element={<InActiveSubscriptionPage />}
                />

                <Route path="/m/:qrcode" element={<QRMenuPage />} />
                <Route path="/m/:qrcode/cart" element={<CartPage />} />
                <Route path="/m/order-success" element={<OrderSuccessPage />} />
                <Route path="/m/order-failed" element={<OrderFailedPage />} />

                {/* app routes */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <DashboardLayout />
                    </PrivateRoute>
                  }
                >
                  <Route
                    path=""
                    element={
                      <ScopeProtectedRoute scopes={[SCOPES.DASHBOARD]}>
                        <DashboardPage />
                      </ScopeProtectedRoute>
                    }
                  />
                  <Route
                    path="home"
                    element={
                      <ScopeProtectedRoute scopes={[SCOPES.DASHBOARD]}>
                        <DashboardPage />
                      </ScopeProtectedRoute>
                    }
                  />
                  <Route path="profile" element={<ProfilePage />} />

                  <Route
                    path="pos"
                    element={
                      <ScopeProtectedRoute scopes={[SCOPES.POS]}>
                        <POSPage />
                      </ScopeProtectedRoute>
                    }
                  />
                  <Route
                    path="orders"
                    element={
                      <ScopeProtectedRoute
                        scopes={[
                          SCOPES.POS,
                          SCOPES.ORDERS,
                          SCOPES.ORDER_STATUS,
                          SCOPES.ORDER_STATUS_DISPLAY,
                        ]}
                      >
                        <OrdersPage />
                      </ScopeProtectedRoute>
                    }
                  />
                  <Route
                    path="kitchen"
                    element={
                      <ScopeProtectedRoute
                        scopes={[SCOPES.KITCHEN, SCOPES.KITCHEN_DISPLAY]}
                      >
                        <KitchenPage />
                      </ScopeProtectedRoute>
                    }
                  />
                  <Route
                    path="reservation"
                    element={
                      <ScopeProtectedRoute
                        scopes={[
                          SCOPES.RESERVATIONS,
                          SCOPES.VIEW_RESERVATIONS,
                          SCOPES.MANAGE_RESERVATIONS,
                        ]}
                      >
                        <ReservationPage />
                      </ScopeProtectedRoute>
                    }
                  />
                  <Route
                    path="customers"
                    element={
                      <ScopeProtectedRoute
                        scopes={[
                          SCOPES.CUSTOMERS,
                          SCOPES.VIEW_CUSTOMERS,
                          SCOPES.MANAGE_CUSTOMERS,
                        ]}
                      >
                        <CustomersPage />
                      </ScopeProtectedRoute>
                    }
                  />
                  <Route
                    path="invoices"
                    element={
                      <ScopeProtectedRoute scopes={[SCOPES.INVOICES]}>
                        <InvoicesPage />
                      </ScopeProtectedRoute>
                    }
                  />
                  <Route
                    path="users"
                    element={
                      <ScopeProtectedRoute scopes={[SCOPES.SETTINGS]}>
                        <UsersPage />
                      </ScopeProtectedRoute>
                    }
                  />
                  <Route
                    path="reports"
                    element={
                      <ScopeProtectedRoute scopes={[SCOPES.REPORTS]}>
                        <ReportsPage />
                      </ScopeProtectedRoute>
                    }
                  />

                  <Route
                    path="settings"
                    element={
                      <ScopeProtectedRoute scopes={[SCOPES.SETTINGS]}>
                        <SettingsPage />
                      </ScopeProtectedRoute>
                    }
                  >
                    <Route path="" element={<SettingDetailsPage />} />
                    <Route path="details" element={<SettingDetailsPage />} />
                    <Route
                      path="print-settings"
                      element={<PrintSettingsPage />}
                    />
                    <Route path="tables" element={<TablesSettingsPage />} />
                    <Route
                      path="menu-items"
                      element={<MenuItemsSettingsPage />}
                    />
                    <Route
                      path="menu-items/:id"
                      element={<MenuItemViewPage />}
                    />
                    <Route
                      path="menu-items/categories"
                      element={<CategoriesPage />}
                    />
                    <Route path="tax-setup" element={<TaxSetupPage />} />
                    <Route
                      path="payment-types"
                      element={<PaymentTypesPage />}
                    />
                  </Route>

                  <Route path="cafe-orders" element={<CafeOrdersAdminPage />} />
                  <Route
                    path="cafe-table-qr"
                    element={<CafeTableQRAdminPage />}
                  />
                </Route>
                {/* app routes */}

                {/* superadmin routes */}
                <Route path="/superadmin" element={<SuperAdminLoginPage />} />
                <Route
                  path="/superadmin/login"
                  element={<SuperAdminLoginPage />}
                />
                <Route
                  path="/superadmin/dashboard"
                  element={
                    <PrivateRoute>
                      <SuperAdminDashboadLayout />
                    </PrivateRoute>
                  }
                >
                  <Route
                    path=""
                    element={
                      <SuperAdminProtectedRoute>
                        <SuperAdminDashboardPage />
                      </SuperAdminProtectedRoute>
                    }
                  />
                  <Route
                    path="home"
                    element={
                      <SuperAdminProtectedRoute>
                        <SuperAdminDashboardPage />
                      </SuperAdminProtectedRoute>
                    }
                  />
                  <Route
                    path="tenants"
                    element={
                      <SuperAdminProtectedRoute>
                        <SuperAdminTenantsPage />
                      </SuperAdminProtectedRoute>
                    }
                  />
                  <Route
                    path="tenants/:id/subscription-history"
                    element={
                      <SuperAdminProtectedRoute>
                        <SuperAdminTenantSubscriptionHistoryPage />
                      </SuperAdminProtectedRoute>
                    }
                  />
                  <Route
                    path="reports"
                    element={
                      <SuperAdminProtectedRoute>
                        <SuperAdminReportsPage />
                      </SuperAdminProtectedRoute>
                    }
                  />
                </Route>
                {/* superadmin routes */}

                {/* ── Payment Gateway Simulations ── */}
                <Route path="/payment/jazzcash" element={<JazzCashPage />} />
                <Route path="/payment/easypaisa" element={<EasypaisaPage />} />
                <Route path="/payment/stripe" element={<StripePage />} />
                <Route path="/payment/result" element={<PaymentResultPage />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </NavbarContext.Provider>
        </CafeCartProvider>
      </CustomerProvider>
    </SocketProvider>
  );
}
