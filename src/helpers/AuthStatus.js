// AuthStatus.js – offline mode: check localStorage session instead of cookie
export function isRestroUserAuthenticated() {
  return !!localStorage.getItem("session_user");
}
