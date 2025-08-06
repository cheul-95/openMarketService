import { isBuyer } from "/js/components/user.js";
//GNB 랜딩작업
export function getHeaderGNB(loginStatus) {
  const $headerMenu = document.querySelector(".header__menu");
  let $headerItem;
  const cart = `<li class="header__menu-item">
      <a href="/pages/cart.html" class="header__menu-link">
        <img
          src="/assets/icons/icon-shopping-cart.svg "
          alt="장바구니 아이콘"
        />
        <span class="header__menu-text header__menu-cart">장바구니</span>
      </a>
    </li>`;

  if (!loginStatus.hasAccessToken) {
    // 비로그인 사용자
    const login = `<li class="header__menu-item">
        <a href="/pages/login.html" class="header__menu-link">
          <img src="/assets/icons/icon-user.svg " alt="로그인 아이콘" />
          <span class="header__menu-text header__menu-login">로그인</span>
        </a>
    </li>`;
    $headerItem = cart + login;
  } else {
    // 로그인 사용자
    const seller = `<li class="header__menu-item header__seller-item">
        <a href="#" class="header__menu-link">
          <img src="/assets/icons/icon-seller-button.svg" alt="판매자 센터 아이콘" />
        </a>
      </li>`;
    const mypage = `<li class="header__menu-item header__menu-item--mypage dropdown">
        <button type="button" class="header__menu-link dropdown__button">
          <img src="/assets/icons/icon-user.svg" alt="마이페이지 아이콘" />
          <span class="header__menu-text">마이페이지</span>
        </button>
        <ul class="dropdown__menu">
          <li class="dropdown__item">
            <a href="/pages/mypage.html" class="dropdown__link">마이페이지</a>
          </li>
          <li class="dropdown__item">
            <button class="dropdown__logout">로그아웃</button>
          </li>
        </ul>
      </li>`;
    if (isBuyer) {
      // 로그인 사용자 - 구매자
      $headerItem = cart + mypage;
    } else {
      $headerItem = mypage + seller;
    }
  }
  $headerMenu.insertAdjacentHTML("beforeend", $headerItem);
}
