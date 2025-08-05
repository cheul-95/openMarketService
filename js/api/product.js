import { request } from "/js/core/config.js";

/**
 * 모든 상품 목록 조회
 * @returns {Promise<Object>} API 호출 결과 객체 (상품 목록 데이터 포함)
 */
export async function getAllProducts() {
  const endpoint = "/products/";
  return await request(endpoint);
}

/**
 * 특정 상품 상세 조회
 * @param {number|string} productId - 조회할 상품 ID
 * @returns {Promise<Object>} API 호출 결과 객체 (상품 상세 데이터 포함)
 */
export async function getProduct(productId) {
  return await request(`/products/${productId}/`);
}

/**
 * 상품 검색
 * @param {string} query - 검색어
 * @returns {Promise<Object>} API 호출 결과 객체 (검색 결과 포함)
 */
export async function searchProducts(query) {
  const endpoint = `/products/?search=${encodeURIComponent(query)}`;
  return await request(endpoint);
}

/**
 * 새 상품 등록
 * @param {Object} productData - 등록할 상품 데이터 (이미지 등 포함 가능)
 * @returns {Promise<Object>} API 호출 결과 객체 (등록된 상품 정보 포함)
 */
export async function createProduct(productData) {
  const formData = new FormData();

  Object.keys(productData).forEach(key => {
    formData.append(key, productData[key]);
  });

  return await request("/products/", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

/**
 * 상품 정보 수정
 * @param {number|string} productId - 수정할 상품 ID
 * @param {Object} productData - 수정할 상품 데이터
 * @returns {Promise<Object>} API 호출 결과 객체 (수정된 상품 정보 포함)
 */
export async function updateProduct(productId, productData) {
  const formData = new FormData();

  Object.keys(productData).forEach(key => {
    if (productData[key] !== undefined && productData[key] !== null) {
      formData.append(key, productData[key]);
    }
  });

  return await request(`/products/${productId}/`, {
    method: "PUT",
    body: formData,
    isFormData: true,
  });
}

/**
 * 상품 삭제
 * @param {number|string} productId - 삭제할 상품 ID
 * @returns {Promise<Object>} API 호출 결과 객체 (삭제 성공 여부 등)
 */
export async function deleteProduct(productId) {
  return await request(`/products/${productId}/`, {
    method: "DELETE",
  });
}
/**
 * 상품 재고
 * @param {number|string} productId - 삭제할 상품 ID
 * @returns {number|string} 재고 수량 전달
 */
export async function checkStock(id) {
  const result = await request(`/products/${id}`, {
    method: "GET",
  });
  const response = await result;
  const data = await response.data;
  if (!result) return false;
  return data.stock;
}
