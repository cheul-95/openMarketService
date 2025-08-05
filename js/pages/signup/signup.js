import { IDvalidate } from "./components/IDvalidate.js";
import { PWvalidate } from "./components/PWvalidate.js";
import { buyerSignup } from "./components/buyerSignup.js";
import { formValidate } from "./components/formValidate.js";

const $form = document.querySelector(".signup");
const $loginType = document.querySelector(".login__type");
const $userType = document.querySelector(".userType");

// 판매자, 구매자 버튼 클릭 active 기능
$loginType.addEventListener("click", e => {
  const target = e.target.closest(".login__type-button");
  if (!target) return;

  $loginType
    .querySelector(".login__type-button--active")
    ?.classList.remove("login__type-button--active");

  target.classList.add("login__type-button--active");

  if (target.classList.contains("login__type-button--seller")) {
    $userType.value = "SELLER";
    $form.classList.add("signup--seller"); // 클래스 추가

    // 판매자 필드 입력 요소들 활성화
    document.querySelector("#signup__seller-number").disabled = false;
    document.querySelector("#store-name").disabled = false;
  } else {
    $userType.value = "BUYER";
    $form.classList.remove("signup--seller"); // 클래스 제거

    // 판매자 필드 입력 요소들 비활성화
    document.querySelector("#signup__seller-number").disabled = true;
    document.querySelector("#store-name").disabled = true;
  }
});

// 폼 유효성 검사 초기화
const validator = formValidate();
validator.init();

// 전역에서 접근 가능하도록 설정
window.formValidator = validator;

// 개별 컴포넌트 초기화
IDvalidate();
PWvalidate();

// 구매자 가입 컴포넌트 초기화
const buyerSignupHandler = buyerSignup();

// 폼 제출 시 최종 검사
$form.addEventListener("submit", async e => {
  e.preventDefault();

  if (validator.validateAll()) {
    // 사용자 타입에 따라 다른 처리
    const userType = $userType.value;

    if (userType === "BUYER") {
      // 구매자 회원가입 처리
      await buyerSignupHandler.handleSignup();
    } else if (userType === "SELLER") {
      // TODO: 판매자 회원가입 처리 (추후 구현)
      console.log("판매자 회원가입은 추후 구현 예정");
    }
  }
});

// 페이지 로드 시 기본값을 구매자로 설정
document.addEventListener("DOMContentLoaded", function () {
  const $userType = document.querySelector(".userType");
  if ($userType) {
    $userType.value = "BUYER";
  }

  // 판매자 필드들 기본 비활성화
  const sellerNumber = document.querySelector("#signup__seller-number");
  const storeName = document.querySelector("#store-name");
  if (sellerNumber) sellerNumber.disabled = true;
  if (storeName) storeName.disabled = true;
});
