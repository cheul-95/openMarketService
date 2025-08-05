import { request } from "../core/config.js";

/**
 * 장바구니 조회
 * @returns {Promise<Object>} API 응답 결과 (장바구니 데이터)
 */
export async function getCart() {
  const endpoint = "/cart/";
  return await request(endpoint);
}

/**
 * 장바구니에 상품 추가
 * @param {number|string} productId - 상품 ID
 * @param {number} quantity - 수량
 * @returns {Promise<Object>} API 응답 결과
 */
export async function addToCart(productId, quantity) {
  return await request("/cart/", {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity,
    }),
  });
}

/**
 * 장바구니 상품 수량 수정
 * @param {number|string} cartItemId - 장바구니 아이템 ID
 * @param {number} quantity - 변경할 수량
 * @returns {Promise<Object>} API 응답 결과
 */
export async function updateCartItem(cartItemId, quantity) {
  return await request(`/cart/${cartItemId}/`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

/**
 * 장바구니 상품 삭제
 * @param {number|string} cartItemId - 장바구니 아이템 ID
 * @returns {Promise<Object>} API 응답 결과
 */
export async function removeCartItem(cartItemId) {
  return await request(`/cart/${cartItemId}/`, {
    method: "DELETE",
  });
}

/**
 * 장바구니 전체 비우기
 * @returns {Promise<Object>} API 응답 결과
 */
export async function clearCart() {
  return await request("/cart/", {
    method: "DELETE",
  });
}
