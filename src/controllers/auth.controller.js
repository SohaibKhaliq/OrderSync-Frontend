import ApiClient from "../helpers/ApiClient";
import { clearUserDetailsInLocalStorage } from "../helpers/UserDetails";
import useSWR from "swr";

const fetcher = (url) => ApiClient.get(url).then((res) => res.data);

export async function signIn(username, password) {
  try {
    const response = await ApiClient.post("/auth/signin", { username, password });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function signUp(biz_name, username, password, reg_no) {
  try {
    const response = await ApiClient.post("/auth/signup", {
      biz_name,
      username,
      password,
      reg_no,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function signOut() {
  try {
    const response = await ApiClient.post("/auth/signout");
    clearUserDetailsInLocalStorage();
    return response;
  } catch (error) {
    throw error;
  }
}

export async function forgotPassword(email) {
  try {
    const response = await ApiClient.post("/auth/forgot-password", { email });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(token, password) {
  try {
    const response = await ApiClient.post(`/auth/reset-password/${token}`, { password });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getStripeSubscriptionURL(productLookupKey) {
  try {
    const response = await ApiClient.post("/auth/stripe-product-lookup", { productLookupKey });
    return response;
  } catch (error) {
    throw error;
  }
}

export function useSubscriptionDetails() {
  const APIURL = "/auth/subscription-details";
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  return {
    data,
    error,
    isLoading,
    APIURL,
  };
}

export async function cancelSubscription(subscriptionId) {
  try {
    const response = await ApiClient.post("/auth/cancel-subscription", { subscriptionId });
    return response;
  } catch (error) {
    throw error;
  }
}

