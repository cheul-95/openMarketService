import { getCart } from "/js/api/cart.js";
import { checkStock } from "/js/api/product.js";
import { loadComponent } from "/js/components/loadComponent.js";
import { isSeller } from "/js/components/user.js";
import { user } from "/js/core/config.js";
import { loginModalOpen } from "/js/pages/cart/components/cartModal.js";
export function cartUserCheck() {
  //유저인지 체크
  if (user == null) {
    loginModalOpen();
    return false;
  } else {
    //구매자인지 체크
    if (isSeller()) {
      alert("구매자만 접근 가능한 페이지 입니다.");
      window.location.href = "/";
      return false;
    }
    return true;
  }
}

export async function cartRender() {
  await loadComponent("header", "./components/header.html");
  await loadComponent("footer", "./components/footer.html");
  const $cart = document.querySelector(".header__menu-cart");
  $cart.parentElement.querySelector("img").src =
    "/assets/icons/icon-shopping-cart-2.svg";
  $cart.style.color = "#21bf48";
  const response = await getCart();
  const cartCount = response.data.count;
  //비어있을경우
  if (cartCount == 0) {
    const cartList = document.querySelector(".cart__list");
    const cartListNoneInnerHTML = `
          <div class="cart-empty" aria-labelledby="cart-empty-title">
            <header class="cart-empty__header">
              <h2 id="cart-empty-title" class="cart-empty__title">
                장바구니에 담긴 상품이 없습니다.
              </h2>
            </header>
            <p class="cart-empty__description">
              원하는 상품을 장바구니에 담아보세요!
            </p>
          </div>
        `;
    cartList.insertAdjacentHTML("beforeend", cartListNoneInnerHTML);
  } else {
    //비어있지 않을경우
    const cartList = response.data.results;
    await renderHtml(cartList);
  }
}

async function renderHtml(data) {
  await Promise.all(
    data.map(async x => {
      const prdId = x.product.id;
      const cartId = x.id;
      const imgUlr = x.product.image;
      const prdName = x.product.name;
      const prdSeller = x.product.seller.name;
      const prdPrice = x.product.price;
      const shipping_method =
        x.product.shipping_method == "PARCEL"
          ? "택배,소포,등기"
          : "직접배송(화물배달)";
      const shipping_fee = x.product.shipping_fee;
      const cartNum = x.quantity;
      const stock = await checkStock(prdId);
      const cartListInnerHTML = `
          <article class="cart-item">
            <input type="hidden" class="cartId" value="${cartId}">
            <input type="hidden" class="prdId" value="${prdId}">
            <label class="cart-item__checkbox-label" for="check${cartId}">
              <input type="checkbox" class="cart-item__checkbox-input" id="check${cartId}" aria-label="상품 선택" checked/>
              <span class="cart-item__checkbox-span" aria-hidden="true"></span>
            </label>
            <img src="${imgUlr}" alt="${prdName}" class="cart-item__image" />
            <div class="cart-item__info">
              <p class="cart-item__info-seller">${prdSeller}</p>
              <p class="cart-item__info-name">${prdName}</p>
              <p class="cart-item__info-price">${prdPrice.toLocaleString()} 원</p>
              <p class="cart-item__info-shipping">${shipping_method} / ${shipping_fee.toLocaleString()} 원</p>
            </div>
            <div class="cart-item__quantity">
              <button type="button" class="cart-item__quantity-btn minus" ><img src="../../assets/icons/icon-minus-line.svg" alt="수량 감소"  /></button>
              <input type="number" class="cart-item__quantity-input" value="${cartNum}" aria-label="수량 입력" readonly/>
              <button type="button" class="cart-item__quantity-btn plus" ><img src="../../assets/icons/icon-plus-line.svg" alt="수량 증가" /></button>
            </div>
            <div class="cart-item__price-wrap">
              <p class="cart-item__price">${(
                prdPrice * cartNum
              ).toLocaleString()}원</p>
              <button class="cart-item__order-btn">주문하기</button>
            </div>
            <button type="button" class="cart-item__delete"><img src="../../assets/icons/icon-delete.svg" alt="장바구니 삭제"></button>
          </article>`;

      const NoStockInnerHTML = `
      <article class="cart-item">
        <input type="hidden" class="cartId" value="${cartId}">
        <input type="hidden" class="prdId" value="${prdId}">
        <label class="cart-item__checkbox-label" for="check${cartId}">
          <span class="cart-item__checkbox-span" aria-hidden="true"></span>
        </label>
        <img src="${imgUlr}" alt="${prdName}" class="cart-item__image" />
        <div class="cart-item__info">
          <p class="cart-item__info-seller">${prdSeller}</p>
          <p class="cart-item__info-name">${prdName}</p>
          <p class="cart-item__info-price">${prdPrice.toLocaleString()} 원</p>
          <p class="cart-item__info-shipping">${shipping_method} / ${shipping_fee.toLocaleString()} 원</p>
        </div>
        <div class="cart-item__quantity">
          <button type="button" class="cart-item__quantity-btn minus" ><img src="../../assets/icons/icon-minus-line.svg" alt="수량 감소"  /></button>
          <input type="number" class="cart-item__quantity-input" value="${cartNum}" aria-label="수량 입력" readonly/>
          <button type="button" class="cart-item__quantity-btn plus" ><img src="../../assets/icons/icon-plus-line.svg" alt="수량 증가" /></button>
          <p class="cart-item__no-stock">재고 부족 ${stock}개</p>
        </div>
        <div class="cart-item__price-wrap">
          <p class="cart-item__price">${(
            prdPrice * cartNum
          ).toLocaleString()}원</p>
          <button class="cart-item__order-btn" disabled>주문하기</button>
        </div>
        <button type="button" class="cart-item__delete"><img src="../../assets/icons/icon-delete.svg" alt="장바구니 삭제"></button>
      </article>`;

      const cartList = document.querySelector(".cart__list");
      if (cartNum > stock) {
        cartList.insertAdjacentHTML("beforeend", NoStockInnerHTML);
      } else {
        cartList.insertAdjacentHTML("beforeend", cartListInnerHTML);
      }
    })
  );
  const $cartSummary = document.querySelector(".cartOrder-summary");
  const $cartAllOrderBtn = document.querySelector(".cartOrder-summary__submit");
  $cartSummary.style.display = "block";
  $cartAllOrderBtn.style.display = "block";
}
