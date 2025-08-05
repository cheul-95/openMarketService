import { clearTokens, user } from "/js/core/config.js";

export function logout() {
  clearTokens();
  return { success: true, message: "Logged out successfully" };
}

export function isSeller() {
  const userJSON = JSON.parse(user);
  if (userJSON.user_type == "SELLER") {
    return true;
  }
  return false;
}

export function isBuyer() {
  const userJSON = JSON.parse(user);
  if (userJSON.user_type == "BUYER") {
    return true;
  }
  return false;
}
