export function isRestroUserAuthenticated() {
    const restroAuthenticated = document.cookie.includes("ordersync__authenticated=");
    return restroAuthenticated;
}