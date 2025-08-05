export function renderQuantityAndPrice(data) {
  return `
    <span class="section-divider" aria-hidden="true"></span>
    <div class="product-detail__quantity">
      <button type="button" class="product-detail__quantity-decrease"></button>
      <input type="number" class="product-detail__quantity-count" value="1">
      <button type="button" class="product-detail__quantity-increase"></button>
    </div>
    <div class="product-detail__stock-message"></div>
    <span class="section-divider" aria-hidden="true"></span>

    <div class="product-detail__price-result">
      <span class="product-detail__price-label">총 상품 금액</span>

      <div class="product-detail__price-meta">
        <span class="product-detail__quantity-result">
          총 수량 <span class="product-detail__quantity-count-result"></span>개
        </span>

        <span class="divider" aria-hidden="true">|</span>

        <div class="product-detail__total-price">
          <span class="product-detail__price-number">17,500</span>
          <span class="product-detail__price-unit">원</span>
        </div>
      </div>
    </div>
  `;
}
