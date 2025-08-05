import { shippingMethodMap } from "../../../utils/constants.js";
export function getProductSummary(data) {
  return `
    <img class="product-detail__image" src="${data?.image}" alt="상품 사진">
    <div class="product-detail__summary">
      <p class="product-detail__category">백엔드 글로벌</p>
      <h2 class="product-detail__name">
        ${data?.name}
      </h2>
      <p class="product-detail__price"><span class="xl-font">${data?.price.toLocaleString(
        "ko-KR"
      )}</span><span>원</span></p>

      <p class="product-detail__delivery-cost">
        <span>${shippingMethodMap[data?.shipping_method] || "알 수 없음"}</span>
        <span class="divider" aria-hidden="true">/</span>
        <span>
          ${
            data?.shipping_fee !== 0
              ? "배송비 " + data?.shipping_fee.toLocaleString("ko-KR") + "원"
              : "무료배송"
          }
        </span>
      </p>
  `;
}
