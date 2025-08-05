import { request, setTokens } from "/js/core/config.js";

/**
 * 로그인
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} API 응답 결과(success, data 포함)
 */
export async function login(username, password) {
  const result = await request("/accounts/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (result.success) {
    setTokens(result.data.access, result.data.refresh, result.data.user);
  }

  return result;
}

/**
 * 구매자 회원가입
 * @param {Object} userData - 회원 정보
 * @returns {Promise<Object>} API 응답 결과
 */
export async function signupBuyer(userData) {
  return await request("/accounts/buyer/signup/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/**
 * 판매자 회원가입
 * @param {Object} userData - 회원 정보
 * @returns {Promise<Object>} API 응답 결과
 */
export async function signupSeller(userData) {
  return await request("/accounts/seller/signup/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/**
 * 사용자명 유효성 검사
 * @param {string} username
 * @returns {Promise<Object>} API 응답 결과
 */
export async function validateUsername(username) {
  return await request("/accounts/validate-username/", {
    method: "POST",
    body: JSON.stringify({ username }),
  });
}
