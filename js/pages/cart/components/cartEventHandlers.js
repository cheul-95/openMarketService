import { removeCartItem } from "/js/api/cart.js";
import { checkStock } from "/js/api/product.js";
import { cartSummaryPrice } from "/js/pages/cart/components/cartCalculator.js";
export function initCartEventHandlers() {
  const $allCheckBox = document.querySelector(".cart__header__checkbox-input");
  const $quantityDel = document.querySelectorAll(".cart-item__delete");
  const $itemOrder = document.querySelectorAll(".cart-item__order-btn");
  const $itemsOrder = document.querySelector(".cartOrder-summary__submit");
  if ($allCheckBox) {
    $allCheckBox.addEventListener("click", handleAllCheckboxClick);
  }
  if ($quantityDel.length > 0) {
    $quantityDel.forEach(item => {
      item.addEventListener("click", handleDeleteCartItem); // 괄호 없이
    });
  }
  if ($itemOrder.length > 0) {
    $itemOrder.forEach(item => {
      item.addEventListener("click", handleOrderCartItem);
    });
  }
  if ($itemsOrder) {
    $itemsOrder.addEventListener("click", handleOrderAllCartItem);
  }
}
// 모든 체크박스 클릭 이벤트 핸들러
function handleAllCheckboxClick() {
  const $allCheckBox = document.querySelector(".cart__header__checkbox-input");
  const $checkBox = document.querySelectorAll(".cart-item__checkbox-input");
  if ($allCheckBox.checked) {
    $checkBox.forEach(cb => {
      cb.checked = true;
    });
  } else {
    $checkBox.forEach(cb => {
      cb.checked = false;
    });
  }
  cartSummaryPrice();
}
// 장바구니 아이템 삭제 이벤트 핸들러
function handleDeleteCartItem(item) {
  if (!confirm("장바구니에서 삭제하시겠습니까?")) {
    return;
  }
  const modalCartId = item.target
    .closest(".cart-item")
    .querySelector(".cartId").value;
  const response = removeCartItem(modalCartId);
  if (!response) return;
  alert("해당 상품이 삭제 되었습니다.");
  window.location.reload();
}
// 장바구니 아이템 주문 이벤트 핸들러
export async function handleOrderCartItem(element) {
  const order_type = "cart_order";
  const selectedItem = [];
  const item = element.target.closest(".cart-item");
  const prdId = item.querySelector(".prdId").value;
  const cartId = item.querySelector(".cartId").value;
  const qty = item.querySelector(".cart-item__quantity-input").value;
  const stock = await checkStock(prdId);
  if (stock < qty) {
    alert("수량이 재고보다 많습니다.");
    return;
  }
  selectedItem.push({ prdId, qty, cartId });
  sessionStorage.setItem("orderList", JSON.stringify(selectedItem));
  sessionStorage.setItem("order_type", order_type);
  window.location.href = `/pages/checkout.html`;
}
// //체크된 제품 주문
export async function handleOrderAllCartItem() {
  const filteredItems = [];
  const order_type = "cart_order";
  const checkedBoxes = document.querySelectorAll(
    ".cart-item__checkbox-input:checked"
  );
  for (const cb of checkedBoxes) {
    const cartItem = cb.closest(".cart-item");
    const qty = parseInt(
      cartItem.querySelector(".cart-item__quantity-input").value
    );
    const prdId = cartItem.querySelector(".prdId").value;
    const cartId = cartItem.querySelector(".cartId").value;
    try {
      const stock = await checkStock(prdId);
      if (stock < qty) {
        alert(`상품 수량이 재고보다 많습니다. (재고: ${stock}, 주문: ${qty})`);
        return;
      }
      filteredItems.push({ prdId, qty, cartId });
    } catch (error) {
      console.error(`재고 확인 중 오류 발생 (상품 ID: ${prdId}):`, error);
      alert("재고 확인 중 오류가 발생했습니다.");
      return;
    }
  }
  if (filteredItems.length === 0) {
    alert("주문할 상품이 없습니다.");
    return;
  }
  sessionStorage.removeItem("orderList");
  sessionStorage.setItem("orderList", JSON.stringify(filteredItems));
  sessionStorage.setItem("order_type", order_type);
  window.location.href = `/pages/checkout.html`;
}
