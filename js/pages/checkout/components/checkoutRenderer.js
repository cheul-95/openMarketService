import { getProduct } from "/js/api/product.js";
import { loadComponent } from "/js/components/loadComponent.js";
export async function chkCartItem() {
  let items = JSON.parse(sessionStorage.getItem("orderList")) || [];
  if (!Array.isArray(items)) {
    items = [items];
  }
  if (items === null || items === "" || items.length == 0) {
    alert("주문할 상품이 없습니다.");
    window.location.href = "/";
  }
}
export async function checkoutRender() {
  await loadComponent("header", "/pages/components/header.html");
  await loadComponent("footer", "/pages/components/footer.html");
  let items = JSON.parse(sessionStorage.getItem("orderList")) || [];
  let allPrdPrice = 0;
  let allFeePrice = 0;
  let resultPrice = 0;
  for (const element of items) {
    const response = await getProduct(element.prdId);
    if (!response) return;
    const data = await response.data;
    allPrdPrice += data.price * element.qty;
    allFeePrice += data.shipping_fee;
    const itemPrice = data.price * element.qty + data.shipping_fee;
    element.price = itemPrice;
    const cartList = document.querySelector(".checkout__list");
    const elementHtml = `
        <article class="checkout__list-item">
          <div class="checkout-item__details">
            <img src="${data.image}" alt="${
      data.name
    }" class="checkout-item__image" />
            <div class="checkout-item__details-wrap">
              <span class="checkout-item__seller">${data.seller.name}</span>
              <h3 class="checkout-item__title">${data.name}</h3>
              <dl class="checkout-item__info checkout-item__info-row">
                <dt>수량</dt>
                <dd>${element.qty}개</dd>
              </dl>
            </div>
          </div>
          <p class="checkout-item__discount">-</p>
          <div class="checkout-item__delFee">
            <dd>${data.shipping_fee.toLocaleString()} 원</dd>
          </div>
          <p class="checkout-item__price"><strong>${data.price.toLocaleString()}원</strong></p>
        </article>`;
    cartList.insertAdjacentHTML("afterbegin", elementHtml);
  }
  // 총액 계산
  const listAllPrice = document.querySelector(".checkout-list__all-price dd");
  listAllPrice.textContent =
    (allPrdPrice + allFeePrice).toLocaleString() + "원";
  const prdPrice = document
    .querySelector(".payment-summary__details")
    .firstElementChild.querySelector("dd");
  prdPrice.innerHTML = `${allPrdPrice.toLocaleString()}<span class="unit">원</span>`;
  const feePrice = document
    .querySelector(".payment-summary__details")
    .children[2].querySelector("dd");
  feePrice.innerHTML = `${allFeePrice.toLocaleString()}<span class="unit">원</span>`;
  const AllPrice = document.querySelector(".payment-summary__total strong");
  AllPrice.textContent = (allPrdPrice + allFeePrice).toLocaleString() + "원";
  resultPrice = allPrdPrice + allFeePrice;
}
