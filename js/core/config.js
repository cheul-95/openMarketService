export const DEFAULT_CONFIG = {
  baseURL: "https://api.wenivops.co.kr/services/open-market",
  autoRefresh: true,
  debug: false,
};

export let globalConfig = { ...DEFAULT_CONFIG };
export let accessToken = localStorage.getItem("accessToken");
export let refreshToken = localStorage.getItem("refreshToken");
export let user = localStorage.getItem("user");

// 토큰 갱신 관련 상태
let isRefreshing = false;
let failedQueue = [];

// 설정 관리
export function updateConfig(newConfig) {
  globalConfig = { ...globalConfig, ...newConfig };
  if (globalConfig.debug) {
    console.log("[API] Config updated:", globalConfig);
  }
}

// 현재 설정을 복사해서 반환
export function getConfig() {
  return { ...globalConfig };
}

// 토큰 상태 확인
export function getTokenStatus() {
  return {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    autoRefresh: globalConfig.autoRefresh,
  };
}

// 토큰 및 사용자 정보 저장
export function setTokens(access, refresh, userData) {
  accessToken = access;
  refreshToken = refresh;
  if (access) localStorage.setItem("accessToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);
  if (userData) localStorage.setItem("user", JSON.stringify(userData));
}

// 토큰 및 사용자 정보 삭제
export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  user = null;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  sessionStorage.removeItem("orderList");
  sessionStorage.removeItem("orderType");
}

// HTTP 요청 헤더 생성
function getHeaders(isFormData = false) {
  const headers = {};

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * AccessToken 갱신
 * @returns {Promise<Object>} API 응답 결과
 */
export async function refreshAccessToken() {
  if (!refreshToken) {
    return { success: false, error: "No refresh token available" };
  }

  try {
    const url = `${globalConfig.baseURL}/accounts/token/refresh/`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();

    if (response.ok) {
      setTokens(data.access, refreshToken);
      if (globalConfig.debug) {
        console.log("[API] Token refreshed successfully");
      }
      return { success: true, data };
    } else {
      throw new Error(JSON.stringify(data));
    }
  } catch (error) {
    if (globalConfig.debug) {
      console.log("[API] Token refresh failed:", error.message);
    }
    return { success: false, error: error.message };
  }
}

/**
 * 토큰 갱신 처리 함수
 */
async function handleTokenRefresh(url, config, endpoint, originalOptions) {
  // autoRefresh가 비활성화된 경우 갱신하지 않음
  if (!globalConfig.autoRefresh) {
    return {
      success: false,
      error: "Token expired and auto refresh is disabled",
      status: 401,
    };
  }

  // 이미 갱신 중이면 대기열에 추가
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then(() => {
        // 갱신 완료 후 원래 요청 재시도
        return request(endpoint, { ...originalOptions, _retry: true });
      })
      .catch(err => {
        return { success: false, error: err.message, status: 401 };
      });
  }

  isRefreshing = true;

  try {
    const refreshResult = await refreshAccessToken();

    if (refreshResult.success) {
      processQueue(null, refreshResult.data.access);

      // 새로운 토큰으로 원래 요청 재시도
      return await request(endpoint, { ...originalOptions, _retry: true });
    } else {
      // 리프레시 토큰도 만료된 경우
      processQueue(new Error("Token refresh failed"), null);
      handleTokenExpired();

      return {
        success: false,
        error: "Authentication failed",
        status: 401,
      };
    }
  } catch (error) {
    processQueue(error, null);
    handleTokenExpired();

    return {
      success: false,
      error: error.message,
      status: 401,
    };
  } finally {
    isRefreshing = false;
  }
}

/**
 * 토큰 만료 시 처리 (로그아웃 등)
 */
function handleTokenExpired() {
  if (globalConfig.debug) {
    console.log("[API] All tokens expired, redirecting to login");
  }

  // 토큰 제거
  clearTokens();

  // 로그인 페이지로 리다이렉트 또는 커스텀 이벤트 발생
  if (typeof window !== "undefined") {
    // 커스텀 이벤트로 처리하여 더 유연하게 대응
    window.dispatchEvent(new CustomEvent("tokenExpired"));

    // 또는 직접 리다이렉트
    // window.location.href = "/login";
  }
}

// API 요청 기본 함수
export async function request(endpoint, options = {}) {
  const url = `${globalConfig.baseURL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(options.isFormData),
      ...options.headers,
    },
  };

  if (globalConfig.debug) {
    console.log(`[API] Request: ${url}`, config);
  }

  try {
    const response = await fetch(url, config);

    // 401 에러 (토큰 만료)인 경우 자동 갱신 시도
    if (
      response.status === 401 &&
      !options._retry &&
      globalConfig.autoRefresh
    ) {
      return await handleTokenRefresh(url, config, endpoint, options);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    if (globalConfig.debug) {
      console.log(`[API] Success:`, data);
    }

    return { success: true, data, status: response.status };
  } catch (error) {
    if (globalConfig.debug) {
      console.log(`[API] Error:`, error.message);
    }

    return {
      success: false,
      error: error.message,
      status: error.status || 500,
    };
  }
}
