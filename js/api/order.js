import { request } from "../core/config.js";

/**
 * 직접 주문 생성 (장바구니 사용하지 않고)
 * @param {Object} orderData - 주문 정보
 * @returns {Promise<Object>} API 응답 결과
 */
export async function createDirectOrder(orderData) {
  const requestData = {
    order_type: "direct_order",
    ...orderData,
  };

  return await request("/order/", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

/**
 * 장바구니 기반 주문 생성
 * @param {Object} orderData - 주문 정보
 * @returns {Promise<Object>} API 응답 결과
 */
export async function createCartOrder(orderData) {
  const requestData = {
    order_type: "cart_order",
    ...orderData,
  };

  return await request("/order/", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

/**
 * 주문 목록 조회
 * @returns {Promise<Object>} API 응답 결과 (주문 목록)
 */
export async function getOrders() {
  const endpoint = "/order/";
  return await request(endpoint);
}

/**
 * 특정 주문 상세 조회
 * @param {number|string} orderId - 주문 ID
 * @returns {Promise<Object>} API 응답 결과 (주문 상세)
 */
export async function getOrder(orderId) {
  return await request(`/order/${orderId}/`);
}

/**
 * 주문 취소
 * @param {number|string} orderId - 주문 ID
 * @returns {Promise<Object>} API 응답 결과
 */
export async function cancelOrder(orderId) {
  return await request(`/order/${orderId}/`, {
    method: "DELETE",
  });
}
