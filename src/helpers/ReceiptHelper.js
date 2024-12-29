const RECEIPT_KEY = "ordersync__RECEIPT__PRINT";

export function getDetailsForReceiptPrint() {
    return JSON.parse(localStorage.getItem(RECEIPT_KEY));
}

export function setDetailsForReceiptPrint(details) {
    localStorage.setItem(RECEIPT_KEY, JSON.stringify(details));
}