// auth.js
const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

/** 토큰 저장 */
export function saveTokens(access, refresh) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

/** Access Token 가져오기 */
export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

/** Refresh Token 가져오기 */
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

/** Access Token 갱신 */
export function saveAccessToken(access) {
  localStorage.setItem(ACCESS_KEY, access);
}

/** 토큰 및 사용자 정보 삭제 */
export function clearAuth() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem("user");
  sessionStorage.removeItem("order_type");
  sessionStorage.removeItem("orderList");
}
