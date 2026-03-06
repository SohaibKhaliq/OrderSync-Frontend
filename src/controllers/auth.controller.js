import { Users, initDB, getDB, saveDB } from "../localdb/LocalDB";
import { clearUserDetailsInLocalStorage } from "../helpers/UserDetails";

initDB();

export async function signIn(username, password) {
  try {
    const user = Users.findByUsername(username);
    if (!user || user.password !== password) {
      const err = {
        response: {
          status: 401,
          data: { message: "Invalid username or password" },
        },
      };
      throw err;
    }
    const { password: _p, ...safeUser } = user;
    localStorage.setItem("session_user", JSON.stringify(safeUser));
    return {
      status: 200,
      data: { message: "Login successful", user: safeUser },
    };
  } catch (error) {
    throw error;
  }
}

export async function signUp(biz_name, username, password) {
  try {
    const existing = Users.findByUsername(username);
    if (existing) {
      throw {
        response: { status: 400, data: { message: "Username already exists" } },
      };
    }
    const user = Users.add(
      username,
      password,
      biz_name,
      "",
      "",
      username,
      "dashboard,pos,orders,kitchen,customers,invoices,reports,reservations,users,settings",
    );
    // Upgrade to admin role
    const db = getDB();
    const idx = (db.users || []).findIndex((u) => u.username === username);
    if (idx !== -1) {
      db.users[idx].role = "admin";
      saveDB(db);
    }
    return { status: 200, data: { message: "Registration successful", user } };
  } catch (error) {
    throw error;
  }
}

export async function signOut() {
  try {
    localStorage.removeItem("session_user");
    clearUserDetailsInLocalStorage();
    return { status: 200, data: { message: "Signed out" } };
  } catch (error) {
    throw error;
  }
}

export async function forgotPassword(email) {
  // Offline mode: always pretend to succeed
  return {
    status: 200,
    data: { message: "If that email exists, a reset link has been sent." },
  };
}

export async function resetPassword(token, password) {
  // Offline mode: always pretend to succeed
  return { status: 200, data: { message: "Password reset successful" } };
}

export async function getStripeSubscriptionURL(productLookupKey) {
  return { status: 200, data: { url: "#" } };
}

export function useSubscriptionDetails() {
  return {
    data: { plan: "offline", status: "active" },
    error: null,
    isLoading: false,
    APIURL: null,
  };
}

export async function cancelSubscription(subscriptionId) {
  return {
    status: 200,
    data: { message: "Subscription cancelled (offline mode)" },
  };
}
