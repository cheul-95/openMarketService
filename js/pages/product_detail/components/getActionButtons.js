import { showLoginModal } from "./showLoginModal.js";
import { fetchWithAuth } from "../../login/api.js";

export function getActionButtons(productId, stock) {
  function checkAuthAndUserType() {
    const accessToken = localStorage.getItem("accessToken");
    const userString = localStorage.getItem("user");
    const userData = JSON.parse(userString);

    const isLoggedIn = accessToken !== null;

    if (!isLoggedIn) {
      showLoginModal(
        () => {
          window.location.href = "/login.html";
        },
        () => {
          console.log("사용자가 로그인을 거부하거나 모달을 닫았습니다.");
        }
      );
      return false;
    }

    if (userData.user_type !== "BUYER") {
      alert("구매자(BUYER)만 이용 가능한 기능입니다.");
      return false;
    }
    return true;
  }

  function updateQuantityDisplay(inputElement, value) {
    if (inputElement) {
      inputElement.value = value;
    }
  }

  function getQuantityInput() {
    return document.querySelector(".product-detail__quantity-count");
  }

  function displayStockMessage(message) {
    const stockMessageElement = document.querySelector(
      ".product-detail__stock-message"
    );
    if (stockMessageElement) {
      stockMessageElement.textContent = message;
      stockMessageElement.style.display = message ? "block" : "none";
    }
  }

  function validateQuantity(quantity) {
    if (isNaN(quantity) || quantity < 1) {
      alert("수량은 1개 이상으로 입력해주세요.");
      return false;
    }
    if (quantity > stock) {
      alert(`현재 선택하신 수량은 재고(${stock}개)보다 많습니다.`);
      return false;
    }
    return true;
  }

  async function handleAddToCart() {
    if (!checkAuthAndUserType()) {
      return;
    }

    const inputQuantityElement = getQuantityInput();
    const currentQuantity = inputQuantityElement
      ? Number(inputQuantityElement.value)
      : 1;

    if (!validateQuantity(currentQuantity)) {
      return;
    }

    const cartItemData = {
      product_id: productId,
      quantity: currentQuantity,
      order_type: "cart_order",
    };

    try {
      const response = await fetchWithAuth(
        `https://api.wenivops.co.kr/services/open-market/cart/`,
        {
          method: "POST",
          body: JSON.stringify(cartItemData),
        }
      );

      if (!response) {
        alert("장바구니 추가에 실패했습니다. 다시 시도해주세요.");
        sessionStorage.removeItem("cartItemToAdd");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `장바구니 추가 실패: ${response.status} - ${
            errorData.message || "알 수 없는 오류"
          }`
        );
      }

      const result = await response.json();
      const confirmMoveToCart = confirm(
        "상품이 장바구니에 추가되었습니다!\n장바구니 페이지로 이동하시겠습니까?"
      );

      if (confirmMoveToCart) {
        window.location.href = "/pages/cart.html";
      } else {
        console.log("장바구니 이동을 취소했습니다.");
      }
    } catch (error) {
      console.error("장바구니 추가 중 오류:", error);
      alert("장바구니 추가 중 오류가 발생했습니다.");
      sessionStorage.removeItem("cartItemToAdd");
    }
  }

  async function handleBuyNow() {
    if (!checkAuthAndUserType()) {
      return;
    }

    const inputQuantityElement = getQuantityInput();
    const currentQuantity = inputQuantityElement
      ? Number(inputQuantityElement.value)
      : 1;

    if (!validateQuantity(currentQuantity)) {
      return;
    }

    const orderData = {
      id: productId,
      qty: currentQuantity,
    };
    sessionStorage.setItem("orderList", JSON.stringify(orderData));
    sessionStorage.setItem("order_type", "direct_order");

    window.location.href = "/pages/checkout.html";
  }

  function setupEventListeners(containerElement) {
    const buyNowBtn = containerElement.querySelector(
      ".product-detail__buy-now"
    );
    const addToCartBtn = containerElement.querySelector(
      ".product-detail__add-to-cart"
    );
    const inputQuantityElement = getQuantityInput();
    const minusBtn = containerElement.querySelector(
      ".product-detail__quantity-minus"
    );
    const plusBtn = containerElement.querySelector(
      ".product-detail__quantity-plus"
    );

    if (stock === 0) {
      displayStockMessage("재고 소진");
      if (buyNowBtn) buyNowBtn.disabled = true;
      if (addToCartBtn) addToCartBtn.disabled = true;
      if (inputQuantityElement) inputQuantityElement.disabled = true;
      if (minusBtn) minusBtn.disabled = true;
      if (plusBtn) plusBtn.disabled = true;
    } else {
      displayStockMessage("");
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", handleBuyNow);
    }
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", handleAddToCart);
    }

    if (inputQuantityElement) {
      inputQuantityElement.addEventListener("change", event => {
        let value = Number(event.target.value);
        if (isNaN(value) || value < 1) {
          value = 1;
          alert("수량은 1개 이상으로 입력해주세요.");
        } else if (value > stock) {
          value = stock;
          alert(`현재 선택하신 수량은 재고(${stock}개)보다 많습니다.`);
        }
        updateQuantityDisplay(inputQuantityElement, value);
      });
    }

    if (minusBtn) {
      minusBtn.addEventListener("click", () => {
        const currentQuantity = Number(inputQuantityElement.value);
        if (currentQuantity > 1) {
          updateQuantityDisplay(inputQuantityElement, currentQuantity - 1);
        } else {
          alert("수량은 1개 이상으로 입력해주세요.");
        }
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener("click", () => {
        const currentQuantity = Number(inputQuantityElement.value);
        if (currentQuantity < stock) {
          updateQuantityDisplay(inputQuantityElement, currentQuantity + 1);
        } else {
          alert(`현재 선택하신 수량은 재고(${stock}개)보다 많습니다.`);
        }
      });
    }
  }

  return { setupEventListeners };
}
