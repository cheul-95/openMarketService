import { getProductSummary } from "./getProductSummary.js";
import { renderQuantityAndPrice } from "./renderQuantityAndPrice.js";
import { setQuantityAndPrice } from "./setQuantityAndPrice.js";
import { getActionButtons } from "./getActionButtons.js";
import { menuTab } from "./menuTab.js";

export function productDetail(productId) {
  const productDetailContainer = document.querySelector(
    ".product-detail__container"
  );

  async function fetchProductDetail() {
    try {
      const response = await fetch(
        `https://api.wenivops.co.kr/services/open-market/products/${productId}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`api통신에 실패하였습니다. ${response.status}`);
      }

      const data = await response.json();
      renderProductDetail(data);
    } catch (error) {
      console.error("API 호출 실패:", error.message);
    }
  }

  function updateMetaTags(data) {
    if (!data) return;

    // Open Graph (OG) Tags
    setMetaTag("og:title", data.name);
    setMetaTag("og:description", data.info);
    setMetaTag("og:image", data.image);
    setMetaTag("og:url", window.location.href);
    setMetaTag("og:type", "product");

    // Twitter Card Tags
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", data.name);
    setMetaTag("twitter:description", data.info);
    setMetaTag("twitter:image", data.image);

    // Standard Meta Tags
    setMetaTag("description", data.info, true);
    setMetaTag(
      "keywords",
      `${data.name}, ${data.seller.store_name}, 상품, 쇼핑`,
      true
    );
  }

  function setMetaTag(property, content, isNameTag = false) {
    let tag = document.querySelector(
      `meta[${isNameTag ? "name" : "property"}="${property}"]`
    );
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(isNameTag ? "name" : "property", property);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  }

  function renderProductDetail(data) {
    if (!data) {
      productDetailContainer.innerHTML = `<p>상품 정보를 불러올 수 없습니다.</p>`;
      return;
    }

    productDetailContainer.innerHTML = `
      ${getProductSummary(data)}
      ${renderQuantityAndPrice(data)}
      <div class="product-detail__actions">
        <button class="product-detail__buy-now">바로 구매</button>
        <button class="product-detail__add-to-cart">장바구니</button>
      </div>
      </div> </div> 
    `;

    setQuantityAndPrice(data);
    menuTab(data);

    const actionButtons = getActionButtons(productId, data?.stock);
    actionButtons.setupEventListeners(productDetailContainer);
  }

  return fetchProductDetail();
}
