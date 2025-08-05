import { gotoReferrer } from "../../../components/useNavigate.js";
import { updateCartItem } from "/js/api/cart.js";
import { checkStock } from "/js/api/product.js";
//로그인 모달
export function loginModalOpen() {
  const modal = document.getElementById("modal-login");
  modal.showModal();
  //취소 버튼
  const $loginModal_cancel = document.querySelector(
    ".modal--login .modal__btn--cancel"
  );
  $loginModal_cancel.addEventListener("click", e => {
    e.preventDefault();
    gotoReferrer();
  });
  //닫기 버튼
  const $loginModal_close = document.querySelector(
    ".modal--login .modal__close"
  );
  $loginModal_close.addEventListener("click", e => {
    e.preventDefault();
    gotoReferrer();
  });
  //확인 버튼
  const $loginModal_confirm = document.querySelector(
    ".modal--login .modal__btn--confirm"
  );
  $loginModal_confirm.addEventListener("click", e => {
    e.preventDefault();
    window.location.href = "/pages/login.html"; // 홈으로 이동
  });
}
export async function modalCalc() {
  const $quantityModal_plus = document.querySelector(".modal--quantity .plus");
  const $quantityModal_minus = document.querySelector(
    ".modal--quantity .minus"
  );
  $quantityModal_plus.addEventListener("click", e => {
    e.preventDefault();
    const $input = document.querySelector(".modal__quantity-input");
    $input.value = Number($input.value) + 1;
  });
  $quantityModal_minus.addEventListener("click", e => {
    e.preventDefault();
    const $input = document.querySelector(".modal__quantity-input");
    if ($input.value > 1) {
      $input.value = Number($input.value) - 1;
    }
  });
}
//수량 모달
export function quantityModalOpen() {
  let modalPrdId;
  let modalCartId;
  // 수량 모달 render
  const $quantityBtn = document.querySelectorAll(".cart-item__quantity-btn");
  $quantityBtn.forEach($quantity => {
    $quantity.addEventListener("click", e => {
      e.preventDefault();
      const $modal = document.querySelector(".modal--quantity");
      $modal.showModal();
      $modal.querySelector(".modal__quantity-input").value = e.target
        .closest(".cart-item__quantity")
        .querySelector("input").value;
      modalPrdId = e.target.closest(".cart-item").querySelector(".prdId").value;
      modalCartId = e.target
        .closest(".cart-item")
        .querySelector(".cartId").value;
    });
  });
  // 수량 모달 close
  const $quantityModal_cancel = document.querySelector(
    ".modal--quantity .modal__btn--cancel"
  );
  const $quantityModal_close = document.querySelector(
    ".modal--quantity .modal__close"
  );
  $quantityModal_close.addEventListener("click", e => {
    e.preventDefault();
    modalClose();
  });
  $quantityModal_cancel.addEventListener("click", e => {
    e.preventDefault();
    modalClose();
  });
  function modalClose() {
    const $modal = document.querySelector(".modal--quantity");
    $modal.close();
  }

  // 수량 숫자 수정 API
  const $quantityModal_confirm = document.querySelector(
    ".modal--quantity .modal__btn--confirm"
  );
  $quantityModal_confirm.addEventListener("click", async e => {
    e.preventDefault();
    const $input = document.querySelector(".modal__quantity-input");
    if (
      $input.value.trim() == "" ||
      !/^[0-9]+$/.test($input.value.trim()) ||
      $input.value <= 0
    ) {
      alert("값을 확인해주세요");
      return;
    }
    const chStock = await checkStock(modalPrdId);
    if (chStock < $input.value) {
      alert("수량이 재고보다 많습니다.");
      return;
    }
    const data = await updateCartItem(modalCartId, $input.value);
    console.log(data);
    if (data.success) {
      alert("수정이 완료되었습니다.");
      window.location.reload();
    } else {
      console.log("데이터를 가져오지 못했습니다.");
    }
  });
}
