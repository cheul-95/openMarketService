export function cartSummaryPrice() {
  let totalPrice = 0;
  let totalShipping = 0;
  document
    .querySelectorAll(".cart-item__checkbox-input:checked")
    .forEach(cb => {
      const cartItem = cb.closest(".cart-item");
      const price = Number(
        cartItem
          .querySelector(".cart-item__price")
          .textContent.replace(/[^0-9]/g, "")
      );
      const shipping = Number(
        cartItem
          .querySelector(".cart-item__info-shipping")
          .textContent.replace(/[^0-9]/g, "")
      );
      totalPrice += price;
      totalShipping += shipping;
    });
  const $cartSummaryPrice = document.querySelectorAll(
    ".cartOrder-summary__value"
  )[0];
  const $cartSummaryShipping = document.querySelectorAll(
    ".cartOrder-summary__value"
  )[1];
  const $cartSummaryTotal = document.querySelector(
    ".cartOrder-summary__value--total"
  );
  $cartSummaryPrice.textContent = `${totalPrice.toLocaleString()}`;
  $cartSummaryShipping.textContent = `${totalShipping.toLocaleString()}`;
  $cartSummaryTotal.textContent = `${(
    totalPrice + totalShipping
  ).toLocaleString()}`;
  const $summaryValue = document.querySelectorAll(".cartOrder-summary__value");
  $summaryValue.forEach(el => {
    el.insertAdjacentHTML(
      "beforeend",
      `<span class="cartOrder-summary__won"> 원</span>`
    );
  });
}
