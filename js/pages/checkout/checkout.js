import { fetchWithAuth } from "../login/api.js";
async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error(`Failed to load ${filePath}:`, error);
  }
  if (elementId == "header") {
    const { initHeader } = await import("../../components/header.js");
    initHeader();
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  loadComponent("header", "./components/header.html");
  loadComponent("footer", "./components/footer.html");
});

let items = JSON.parse(sessionStorage.getItem("orderList")) || [];
if (!Array.isArray(items)) {
  items = [items];
}
if (items === null || items === "" || items.length == 0) {
  alert("주문할 상품이 없습니다.");
  window.location.href = "/";
}
const orderType = sessionStorage.getItem("order_type");
let resultPrice = 0;
(async function renderItems() {
  let allPrdPrice = 0;
  let allFeePrice = 0;

  for (const element of items) {
    const response = await fetchWithAuth(
      `https://api.wenivops.co.kr/services/open-market/products/${element.id}/`,
      {
        method: "GET",
      }
    );
    if (!response) return;
    const data = await response.json();

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
})();
//우편번호
const $postBtn = document.querySelector(".checkout-order__postcode-btn");
$postBtn.addEventListener("click", function () {
  new daum.Postcode({
    oncomplete: function (data) {
      document.querySelector("#postcode").value = data.zonecode;
      document.querySelector("#address").value = data.address;
    },
  }).open();
});
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
const form = document.querySelector(".checkout-form");
const $submitBtn = document.querySelector(".payment-summary__submit");
$submitBtn.addEventListener("click", async e => {
  e.preventDefault();
  // 1) HTML5 기본 유효성 체크
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  // 이름 형식 체크
  const namePattern = /^[가-힣a-zA-Z\s]+$/;
  const orderName = document.querySelector("#order-name").value.trim();
  const receiverName = document.querySelector("#receiver-name").value.trim();
  // 전화번호 형식 체크
  const phonePattern = /^[0-9]+$/;
  const orderPhone1 = document.querySelector("#order-phone1").value.trim();
  const orderPhone2 = document.querySelector("#order-phone2").value.trim();
  const orderPhone3 = document.querySelector("#order-phone3").value.trim();
  const receiverPhone1 = document
    .querySelector("#receiver-phone1")
    .value.trim();
  const receiverPhone2 = document
    .querySelector("#receiver-phone2")
    .value.trim();
  const receiverPhone3 = document
    .querySelector("#receiver-phone3")
    .value.trim();
  //주소 체크
  const postcode = document.querySelector("#postcode").value.trim();
  const address = document.querySelector("#address").value.trim();
  //이메일 체크
  const email = document.querySelector("#order-email").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //결제수단
  const checkedPayment = document.querySelector(
    'input[name="payment"]:checked'
  );
  //동의
  const agree = document.querySelector('input[name="agree"]');
  if (!namePattern.test(orderName)) {
    alert("주문자 이름은 한글 또는 영문만 입력 가능합니다.");
    return;
  }
  if (
    !phonePattern.test(orderPhone1) ||
    !phonePattern.test(orderPhone2) ||
    !phonePattern.test(orderPhone3)
  ) {
    alert("주문자 휴대폰 번호는 숫자만 입력해주세요.");
    return;
  }
  if (!emailPattern.test(email)) {
    alert("올바른 이메일 형식을 입력해주세요.");
    return;
  }
  if (!namePattern.test(receiverName)) {
    alert("수령인 이름은 한글 또는 영문만 입력 가능합니다.");
    return;
  }
  if (
    !phonePattern.test(receiverPhone1) ||
    !phonePattern.test(receiverPhone2) ||
    !phonePattern.test(receiverPhone3)
  ) {
    alert("수령인 휴대폰 번호는 숫자만 입력해주세요.");
    return;
  }
  if (postcode === "" || address === "") {
    alert("주소를 모두 입력해주세요.");
    return;
  }

  if (!checkedPayment) {
    alert("결제수단을 선택해주세요.");
    return;
  }
  if (!agree.checked) {
    alert("주문 내용 확인 및 정보 제공 동의가 필요합니다.");
    return;
  }

  // --- 모든 유효성 검사를 통과했을 때 ---
  // 여기에 결제 API 호출 코드 삽입

  if (orderType == "cart_order") {
    let cart_items = [];
    for (const element of items) {
      cart_items.push(element.id);
      if (element.qty < checkStock(element.id)) {
        alert("재고가 소진되었습니다.");
        window.location.href = "/";
        return;
      }
    }
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
    await createCartOrder(orderData);
  } else if (orderType == "direct_order") {
    let cart_items = [];
    let qty = 0;
    for (const element of items) {
      cart_items = element.id;
      qty = element.qty;
      if (element.qty < checkStock(element.id)) {
        console.log(element.qty);
        console.log(checkStock(element.id));
        alert("재고가 소진된 제품이 있습니다 확인해주세요.");
        window.location.href = "/";
        return;
      }
    }
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
    const response = await createCartOrder(orderData);
    const data = response.json();
  }
  //장바구니 비우기
  alert("주문이 완료되었습니다.");
  window.location.href = "/";
});
async function createCartOrder(orderData) {
  const response = await fetchWithAuth(
    "https://api.wenivops.co.kr/services/open-market/order/",
    {
      method: "POST",
      body: JSON.stringify(orderData),
    }
  );

  if (!response) return;
  return response;
}
async function checkStock(id) {
  const response = await fetchWithAuth(
    `https://api.wenivops.co.kr/services/open-market/products/${id}`,
    {
      method: "GET",
    }
  );
  const data = await response.json();
  if (!response) return false;
  return data.stock;
}
