export function menuTab(productData) {
  const tabList = document.querySelector(".product-tab__list");
  const tabContent = document.querySelector(".product-tab__content");

  function renderDetailInfoHtml(data) {
    if (!data) {
      return "<p>상품 상세정보가 준비 중입니다.</p>";
    }

    // 예시로 `productData.info` (상품 설명)와 기타 필드를 활용합니다.
    const shippingMethodText =
      data.shipping_method === "PARCEL" ? "택배" : "직접배송";

    return `
      <div class="product-detail-info">
        <img src="${data.image}" />
        <h3>상품 정보</h3>
        <p>${data.info || "상품에 대한 추가 설명이 없습니다."}</p>
        <hr>
        <h4>기본 정보</h4>
        <ul>
          <li><strong>상품명:</strong> ${data.name || "정보 없음"}</li>
          <li><strong>가격:</strong> ${
            data.price ? data.price.toLocaleString() + "원" : "정보 없음"
          }</li>
          <li><strong>재고:</strong> ${
            data.stock ? data.stock.toLocaleString() + "개" : "정보 없음"
          }</li>
          <li><strong>배송 방식:</strong> ${shippingMethodText}</li>
          <li><strong>배송비:</strong> ${
            data.shipping_fee
              ? data.shipping_fee.toLocaleString() + "원"
              : "정보 없음"
          }</li>
        </ul>
        <hr>
        <h4>판매자 정보</h4>
        <ul>
          <li><strong>상점명:</strong> ${
            data.seller?.store_name || "정보 없음"
          }</li>
          <li><strong>판매자:</strong> ${data.seller?.name || "정보 없음"}</li>
          <li><strong>연락처:</strong> ${
            data.seller?.phone_number || "정보 없음"
          }</li>
          <li><strong>사업자 등록 번호:</strong> ${
            data.seller?.company_registration_number || "정보 없음"
          }</li>
        </ul>
        <hr>
        <p><strong>상품 등록일:</strong> ${
          data.created_at
            ? new Date(data.created_at).toLocaleString()
            : "정보 없음"
        }</p>
        <p><strong>최종 수정일:</strong> ${
          data.updated_at
            ? new Date(data.updated_at).toLocaleString()
            : "정보 없음"
        }</p>
        ${
          data.detail_info
            ? `<h4>추가 상세 정보</h4><p>${data.detail_info}</p>`
            : ""
        }
      </div>
    `;
  }

  // 💡 추가: 반품/교환정보 UI를 렌더링하는 함수
  function renderReturnExchangeInfoHtml(data) {
    // API 응답에 'return_exchange_info' 필드가 직접 HTML 문자열로 온다면 바로 사용
    // 그렇지 않다면, 일반적인 반품/교환 정책 내용을 구성
    if (data.return_exchange_info) {
      // API에 해당 필드가 있다면
      return `
        <div class="product-return-exchange-info">
          <h3>반품/교환 정보</h3>
          ${data.return_exchange_info}
        </div>
      `;
    } else {
      // API에 해당 필드가 없거나 비어있다면, 일반적인 정책을 표시
      return `
        <div class="product-return-exchange-info">
          <h3>반품 및 교환 안내</h3>
          <hr>
          <p>상품 수령 후 7일 이내에 반품/교환 신청이 가능합니다.</p>
          <p>단순 변심으로 인한 반품/교환은 고객님께서 왕복 배송비를 부담하셔야 합니다.</p>
          <p>상품 불량 또는 오배송으로 인한 반품/교환은 판매자가 배송비를 부담합니다.</p>
          <p>제품의 특성상 포장 개봉, 사용 흔적, 상품 가치 훼손 시에는 반품/교환이 어려울 수 있습니다.</p>
          <hr>
          <p>자세한 내용은 고객센터(${
            data.seller?.phone_number || "판매자 문의"
          })로 문의 바랍니다.</p>
          <p>반품 주소: ${data.seller?.store_name || "판매자"} ${
        data.seller?.company_registration_number || ""
      } (정보 없음)</p>
        </div>
      `;
    }
  }

  const tabs = [
    {
      name: "상세정보",
      content: renderDetailInfoHtml(productData),
    },
    {
      name: "리뷰",
      content: "<p>등록된 리뷰가 없습니다.</p>",
    },
    {
      name: "Q&A",
      content: "<p>등록된 Q&A가 없습니다.</p>",
    },
    {
      name: "반품/교환정보",
      content: renderReturnExchangeInfoHtml(productData),
    },
  ];

  function renderTabMenu() {
    tabList.innerHTML = tabs
      .map(
        (tab, index) => `
      <li class="product-tab__item">
        <button 
          class="product-tab__button ${
            index === 0 ? "product-tab__button--active" : ""
          }" 
          data-index="${index}"
          aria-current="${index === 0 ? "true" : "false"}">
          ${tab.name}
          <span 
            class="product-tab__underline ${
              index === 0 ? "product-tab__underline--active" : ""
            }" 
            aria-hidden="true">
          </span>
        </button>
      </li>
    `
      )
      .join("");

    tabContent.innerHTML = tabs[0].content;

    addTabEventListeners();
  }

  function addTabEventListeners() {
    const buttons = tabList.querySelectorAll(".product-tab__button");

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const selectedIndex = button.dataset.index;

        // 버튼 활성화 클래스 초기화
        buttons.forEach(btn => {
          btn.classList.remove("product-tab__button--active");
          btn.setAttribute("aria-current", "false");
          btn
            .querySelector(".product-tab__underline")
            ?.classList.remove("product-tab__underline--active");
        });

        // 클릭된 버튼에 클래스 추가
        button.classList.add("product-tab__button--active");
        button.setAttribute("aria-current", "true");
        button
          .querySelector(".product-tab__underline")
          ?.classList.add("product-tab__underline--active");

        // 콘텐츠 변경
        tabContent.innerHTML = tabs[selectedIndex].content;
      });
    });
  }

  return renderTabMenu();
}
