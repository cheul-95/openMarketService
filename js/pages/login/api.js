import { clearAuth, getAccessToken, getRefreshToken, saveAccessToken } from "./auth.js";
/**
 * Access Token 재발급 요청
 * 실패 시 자동 로그아웃 처리
 */
export async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) {
    handleLogout();
    return null;
  }

  try {
    const res = await fetch("https://api.wenivops.co.kr/services/open-market/accounts/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (res.status === 401) {
      handleLogout();
      return null;
    }
    if (!res.ok) {
      throw new Error(`토큰 재발급 요청 실패 (status: ${res.status})`);
    }
    const data = await res.json();
    if (data.access) {
      saveAccessToken(data.access);
      return data.access;
    } else {
      handleLogout();
      return null;
    }
  } catch (error) {
    console.error("토큰 재발급 중 오류:", error);
    handleLogout();
    return null;
  }
}

/** 로그아웃 처리 */
function handleLogout() {
  clearAuth(); // localStorage 또는 sessionStorage에 저장된 토큰 삭제
  alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
  window.location.href = "/pages/login.html";
}

export async function fetchWithAuth(url, options = {}) {
  let token = getAccessToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...(options.headers || {}) },
  });

  // 토큰 만료 (401) 처리
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      // Refresh Token도 만료 → 로그아웃 처리
      return null;
    }

    const retryResponse = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, Authorization: `Bearer ${refreshed}` },
    });

    if (!retryResponse.ok) throw new Error(`API 호출 실패: ${retryResponse.status}`);
    return retryResponse;
  }

  if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`);
  return response;
}
