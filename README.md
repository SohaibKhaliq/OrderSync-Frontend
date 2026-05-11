# OrderSync 

OrderSync is the complete frontend for a modern, multi-tenant restaurant and campus management platform. Built with React and Vite, it provides a comprehensive suite of tools for staff, customers, and administrators to manage every aspect of a food service business, from point-of-sale to kitchen displays and customer-facing QR menus.

## ✨ Key Features

This repository contains the frontend implementation for several integrated portals, all within a single React SPA:

-   **Point of Sale (POS):** A fast, touch-friendly interface for staff to take orders, manage tables, and process payments.
-   **Kitchen Display System (KDS):** A real-time, hands-free kitchen management screen that displays incoming orders, their status (New, Preparing, Ready), and can announce orders via text-to-speech.
-   **QR Contactless Menu:** A dynamic, public-facing menu accessible by scanning a QR code. Guests can browse, add items to a cart, and place orders without needing to create an account.
-   **Customer Portal:** An authenticated experience for customers to browse menus, track live order status, manage their digital wallet, and view their order history.
-   **Table & Reservation Management:** A system for both staff and customers to manage table bookings, view availability, and handle walk-ins.
-   **Real-time Updates:** Powered by Socket.io, all portals (POS, KDS, customer tracking) stay perfectly in sync without needing manual refreshes.
-   **Flexible Payments:** Integrated support for multiple payment methods including JazzCash, EasyPaisa, Card (via Stripe), Cash, and a built-in Customer Wallet.
-   **Role-Based Access Control (RBAC):** Granular permissions for different staff roles (e.g., `POS`, `KITCHEN`, `REPORTS`, `SETTINGS`) to ensure users only access the features they need.
-   **Super Admin Dashboard:** A dedicated portal for platform administrators to manage different restaurant tenants, view aggregated reports, and oversee system-wide operations.
-   **Comprehensive Reporting:** In-depth analytics on sales, top-selling items, peak hours, and customer trends to drive data-informed decisions.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v16 or later)
-   npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/sohaibkhaliq/ordersync-frontend.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd ordersync-frontend
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Run the development server:**
    The application will be available at `http://localhost:5173` or the next available port. The `--host` flag exposes it to your local network.
    ```sh
    npm run dev
    ```

## 🛠️ Technology Stack

-   **Framework:** React 18
-   **Build Tool:** Vite 5
-   **Routing:** React Router 6
-   **Styling:** Tailwind CSS 3 & DaisyUI 4
-   **UI Components:** Headless UI
-   **Data Fetching & State:** SWR, React Context API
-   **Real-time Communication:** Socket.io Client
-   **Icons:** Tabler Icons
-   **Notifications:** React Hot Toast

## 📂 Project Structure

The codebase is organized into a modular and scalable structure to separate concerns effectively.

```
src/
├── components/   # Reusable UI components (AppBar, Cards, etc.)
├── config/       # Application configuration (API endpoints, scopes, currencies)
├── contexts/     # React Context providers (Auth, Cart, Socket)
├── controllers/  # Data fetching and business logic functions (SWR hooks)
├── helpers/      # Auth guards, route protection, and utility functions
├── hooks/        # Custom React hooks (e.g., useNotifications)
├── utils/        # General utility functions (validators, debounce)
└── views/        # Top-level page components for each route
    ├── CafeOrdersAdminPage.jsx
    ├── POSPage.jsx
    ├── KitchenPage.jsx
    ├── cafe/         # Customer-facing portal views
    └── SuperAdmin/   # Super Admin dashboard views
```

## 📜 Available Scripts

In the project directory, you can run the following scripts:

-   `npm run dev`: Runs the app in development mode with hot-reloading.
-   `npm run build`: Builds the app for production to the `dist` folder.
-   `npm run preview`: Serves the production build locally to preview it.
-   `npm run test`: Runs the test suite.
