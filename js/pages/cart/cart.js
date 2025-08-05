import { cartSummaryPrice } from "/js/pages/cart/components/cartCalculator.js";
import { initCartEventHandlers } from "/js/pages/cart/components/cartEventHandlers.js";
import {
  modalCalc,
  quantityModalOpen,
} from "/js/pages/cart/components/cartModal.js";
import {
  cartRender,
  cartUserCheck,
} from "/js/pages/cart/components/cartRenderer.js";
document.addEventListener("DOMContentLoaded", async function () {
  //권한 확인
  const userType = cartUserCheck();
  if (userType) {
    document.querySelector(".cart").style.display = "block";
  }
  //헤더푸터 렌더링
  await cartRender();
  cartSummaryPrice();
  initCartEventHandlers();
  modalCalc();
  quantityModalOpen();
});
