// UserDetails.js – stores logged-in user details in localStorage
// Both ordersync_user (legacy) and session_user are kept in sync.
const KEY = "ordersync_user";
const SESSION_KEY = "session_user";

export function saveUserDetailsInLocalStorage(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getUserDetailsInLocalStorage() {
  const userStr =
    localStorage.getItem(KEY) || localStorage.getItem(SESSION_KEY);
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function clearUserDetailsInLocalStorage() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(SESSION_KEY);
}
