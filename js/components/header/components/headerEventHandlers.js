import { logout } from "/js/components/user.js";
export function searchGNBEvent() {
  // 검색기능
  const $searchForm = document.querySelector(".header__search-form");
  const $headerSearchInput = document.querySelector(".header__search-input");
  $searchForm.addEventListener("submit", e => {
    e.preventDefault();
    const input = $headerSearchInput.value.trim();
    if (input === "") {
      alert("검색어를 작성 해주세요");
      $headerSearchInput.focus();
      return;
    }
    // URLSearchParams로 변경
    const params = new URLSearchParams({
      query: input,
    });
    window.location.href = `/?${params}`;
  });
}
export function toggleGNBEvent() {
  //마이페이지 클릭 토글
  const $dropdown = document.querySelector(".dropdown");
  const $headerMyText = document.querySelectorAll(".header__menu-link");
  const $button = document.querySelector(".dropdown__button");
  if ($button) {
    $button.addEventListener("click", e => {
      e.preventDefault();
      $dropdown.classList.toggle("open");

      if ($dropdown.classList.contains("open")) {
        $headerMyText.forEach(menu => {
          menu.style.color = "#21bf48"; // 글자색
        });
        const $cartImg = document
          .querySelector(".header__menu-cart")
          .parentElement.querySelector("img");
        $cartImg.src = "/assets/icons/icon-shopping-cart-2.svg";
        const $myPageImg = document.querySelector(".dropdown__button img");
        $myPageImg.src = "/assets/icons/icon-user-2.svg";
      } else {
        $headerMyText.forEach(menu => {
          menu.style.color = "#767676"; // 글자색
        });
        const $cartImg = document
          .querySelector(".header__menu-cart")
          .parentElement.querySelector("img");
        //마이페이지 예외처리
        const currentPath = window.location.pathname;
        if (currentPath !== "/pages/cart.html") {
          $cartImg.src = "/assets/icons/icon-shopping-cart.svg";
        }
        const $myPageImg = document.querySelector(".dropdown__button img");
        $myPageImg.src = "/assets/icons/icon-user.svg";
      }
    });
  }
  // 다른 영역 클릭 시 닫기
  document.addEventListener("click", e => {
    if ($dropdown && !$dropdown.contains(e.target)) {
      $dropdown.classList.remove("open");
    }
  });
}
export function logoutGNBEvent() {
  const $logoutBtn = document.querySelector(".dropdown__logout");
  $logoutBtn.addEventListener("click", e => {
    if (logout().success) {
      alert("로그아웃 되었습니다.");
      window.location.reload(true);
    }
  });
}
