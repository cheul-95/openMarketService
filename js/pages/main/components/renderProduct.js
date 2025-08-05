export function getProducts() {
  const productList = document.querySelector(".product-container__list");

  //url 파라미터에서 검색어 가져오기
  //쿼리스트링 파싱
  const urlParams = new URLSearchParams(window.location.search);
  //검색 키 가져옴 (header.js와 동일하게 "query"로 변경)
  const searchInput = urlParams.get("query");

  /**
   * api로부터 products 정보를 받아오는 함수
   * @returns product data를 반환
   */
  async function fetchProducts() {
    try {
      let apiUrl = "https://api.wenivops.co.kr/services/open-market/products/";

      // 검색어가 있으면 API URL에 추가
      if (searchInput && searchInput.trim() !== "") {
        apiUrl += `?search=${encodeURIComponent(searchInput)}`;
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`api통신에 실패하였습니다. ${response.status}`);
      }
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error(`API 호출 실패:, ${error} `);
      return [];
    }
  }

  /**
   * api로 받아온 products를 productList에 매핑하는 함수.
   * @param {*} products
   */
  function renderProducts(products) {
    const productHTML = products
      .map(
        product => `
    <li class="product-item">
      <a href="/pages/product-detail.html?id=${
        product.id
      }" class="product-item__link">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-item__text-container">
          <p class="product-item__seller">${product.seller.store_name}</p>
          <p class="product-item__name">${product.name}</p>
          <p><span class="product-item__price">${product.price.toLocaleString()}</span>원</p>
        </div>
      </a>
    </li>
  `
      )
      .join("");

    productList.innerHTML = productHTML;
  }

  // 상품 데이터 로드 및 렌더링
  async function fetchRenderProducts() {
    const products = await fetchProducts();
    if (products.length > 0) {
      renderProducts(products);
    } else {
      // 검색어 유무에 따른 메세지
      if (searchInput && searchInput.trim() !== "") {
        productList.innerHTML = `<li>"${searchInput}"에 대한 검색결과가 없습니다.</li>`;
      } else {
        productList.innerHTML = "<li>상품을 불러올 수 없습니다.</li>";
      }
    }
  }

  return fetchRenderProducts();
}
