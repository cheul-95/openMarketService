// setQuantityAndPrice.js 파일
export function setQuantityAndPrice(data) {
  const price = data?.price;
  const stock = data?.stock;

  const decreaseBtn = document.querySelector(
    ".product-detail__quantity-decrease"
  );
  const increaseBtn = document.querySelector(
    ".product-detail__quantity-increase"
  );
  const inputQuantity = document.querySelector(
    ".product-detail__quantity-count"
  );
  const quantityResult = document.querySelector(
    ".product-detail__quantity-count-result"
  );
  const priceResult = document.querySelector(".product-detail__price-number");
  const stockMessage = document.querySelector(".product-detail__stock-message");

  const buyNowBtn = document.querySelector(".product-detail__buy-now");
  const addToCartBtn = document.querySelector(".product-detail__add-to-cart");

  function displayStockMessage(message) {
    if (stockMessage) {
      stockMessage.textContent = message;
      stockMessage.style.display = message ? "block" : "none";
      stockMessage.style.color = "red";
      stockMessage.style.marginBottom = "30px";
    }
  }

  function setButtonAndInputState(isDisabled) {
    if (decreaseBtn) decreaseBtn.disabled = isDisabled;
    if (increaseBtn) increaseBtn.disabled = isDisabled;
    if (inputQuantity) inputQuantity.disabled = isDisabled;
    if (buyNowBtn) buyNowBtn.disabled = isDisabled;
    if (addToCartBtn) addToCartBtn.disabled = isDisabled;

    if (buyNowBtn) {
      if (isDisabled) buyNowBtn.classList.add("deactivate");
      else buyNowBtn.classList.remove("deactivate");
    }
    if (addToCartBtn) {
      if (isDisabled) addToCartBtn.classList.add("deactivate");
      else addToCartBtn.classList.remove("deactivate");
    }
  }

  function updateUI() {
    let currentQuantity = Number(inputQuantity.value);
    let originalQuantity = Number(inputQuantity.dataset.originalValue || 1); // 변경 전 값 저장

    if (stock === 0) {
      displayStockMessage("재고 소진");
      setButtonAndInputState(true);
      inputQuantity.value = 0;
      quantityResult.textContent = 0;
      priceResult.textContent = (0).toLocaleString();
      return;
    }

    if (isNaN(currentQuantity) || currentQuantity < 1) {
      if (currentQuantity !== originalQuantity) {
        // 값이 실제로 변경된 경우에만 alert
        alert("수량은 1개 이상으로 입력해주세요.");
      }
      currentQuantity = 1;
      inputQuantity.value = 1;
    } else if (currentQuantity > stock) {
      if (currentQuantity !== originalQuantity) {
        // 값이 실제로 변경된 경우에만 alert
        alert(`현재 선택하신 수량은 재고(${stock}개)보다 많습니다.`);
      }
      currentQuantity = stock;
      inputQuantity.value = stock;
    }

    // 변경된 값을 originalValue에 저장
    inputQuantity.dataset.originalValue = currentQuantity;

    displayStockMessage("");
    setButtonAndInputState(false);

    quantityResult.textContent = currentQuantity;
    priceResult.textContent = (price * currentQuantity).toLocaleString();
  }

  if (decreaseBtn) {
    decreaseBtn.addEventListener("click", () => {
      let currentQuantity = Number(inputQuantity.value);
      if (currentQuantity > 1) {
        inputQuantity.value = currentQuantity - 1;
      } else {
        alert("수량은 1개 이상으로 입력해주세요.");
      }
      updateUI();
    });
  }

  if (increaseBtn) {
    increaseBtn.addEventListener("click", () => {
      let currentQuantity = Number(inputQuantity.value);
      if (currentQuantity < stock) {
        inputQuantity.value = currentQuantity + 1;
      } else {
        alert(`현재 선택하신 수량은 재고(${stock}개)보다 많습니다.`);
      }
      updateUI();
    });
  }

  if (inputQuantity) {
    inputQuantity.addEventListener("change", event => {
      updateUI();
    });
    // 초기 렌더링 시 originalValue 설정
    inputQuantity.dataset.originalValue = Number(inputQuantity.value || 1);
  }

  if (!inputQuantity.value) {
    inputQuantity.value = 1;
  }
  updateUI();
}
