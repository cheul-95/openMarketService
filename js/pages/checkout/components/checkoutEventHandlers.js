import { createCartOrder, createDirectOrder } from "/js/api/order.js";
import { checkStock } from "/js/api/product.js";
export function validationForm() {}
export function confirmInfoAgreement() {
  //정보제공 동의
  const $confirm = document.querySelector(".payment-summary__confirm input");
  const $confirmButton = document.querySelector(
    ".payment-summary__confirm button"
  );
  $confirm.addEventListener("click", function () {
    const isChecked = $confirm.checked;
    if (isChecked) {
      $confirmButton.style.backgroundColor = "#21bf48";
      $confirmButton.style.cursor = "pointer";
    } else {
      $confirmButton.style.backgroundColor = "#c4c4c4";
      $confirmButton.style.cursor = "not-allowed";
    }
    $confirmButton.disabled = !isChecked;
  });
}

export function orderEvent() {
  const $submitBtn = document.querySelector(".payment-summary__submit");
  const orderType = sessionStorage.getItem("order_type");
  let items = JSON.parse(sessionStorage.getItem("orderList")) || [];
  $submitBtn.addEventListener("click", async e => {
    e.preventDefault();
    if (!validationForm()) {
      return; // 유효성 검사 실패 시 함수 종료
    }
    let cart_items = [];
    for (const element of items) {
      cart_items.push(element.prdId);
      const chStock = await checkStock(element.prdId);
      console.log(chStock, element.qty);
      if (element.qty > chStock) {
        alert("재고가 소진되었습니다.");
        window.location.href = "/";
        return;
      }
    }
    let result;
    if (orderType == "cart_order") {
      const price = document.querySelector(
        ".payment-summary__total dd strong"
      ).textContent;

      const orderData = {
        order_type: "cart_order",
        cart_items: cart_items, // cartitem에 담긴 product의 id를 리스트 형태로 보내야합니다.
        total_price: parseInt(price.replace(/[^0-9]/g, ""), 10),
        receiver: document.getElementById("receiver-name").value,
        receiver_phone_number: `${
          document.getElementById("receiver-phone1").value
        }${document.getElementById("receiver-phone2").value}${
          document.getElementById("receiver-phone3").value
        }`,
        address: document.getElementById("address").value,
        address_message:
          document.getElementById("delivery-message").value || null,
        payment_method: document.querySelector('input[name="payment"]:checked')
          .value,
      };
      result = await createCartOrder(orderData);
    } else if (orderType == "direct_order") {
      const price = document.querySelector(
        ".payment-summary__total dd strong"
      ).textContent;
      const orderData = {
        order_type: "direct_order",
        product: cart_items,
        quantity: qty,
        total_price: parseInt(price.replace(/[^0-9]/g, ""), 10),
        receiver: document.getElementById("receiver-name").value,
        receiver_phone_number: `${
          document.getElementById("receiver-phone1").value
        }${document.getElementById("receiver-phone2").value}${
          document.getElementById("receiver-phone3").value
        }`,
        address: document.getElementById("address").value,
        address_message:
          document.getElementById("delivery-message").value || null,
        payment_method: document.querySelector('input[name="payment"]:checked')
          .value,
      };
      const response = await createDirectOrder(orderData);
      result = response.json();
    }
    if (result.success) {
      alert("주문이 완료되었습니다.");
      window.location.href = "/";
    } else {
      alert("주문에 오류가 발생 하였습니다. 관리자에게 문의 해주세요");
    }
  });
}
