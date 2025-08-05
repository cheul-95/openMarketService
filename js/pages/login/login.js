import { getAccessToken, saveTokens } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = getAccessToken();
  if (token) {
    // 이미 로그인 되어 있다면 메인 페이지로 이동
    window.location.href = "/";
  }
});
// 판매자 , 구매자 버튼 클릭 active 기능
const $loginType = document.querySelector(".login__type");
const $userType = document.querySelector(".userType");

$loginType.addEventListener("click", e => {
  const target = e.target.closest(".login__type-button");
  if (!target) return;

  $loginType
    .querySelector(".login__type-button--active")
    ?.classList.remove("login__type-button--active");

  target.classList.add("login__type-button--active");
  if (target.classList.contains("login__type-button--seller")) {
    $userType.value = "SELLER";
  } else {
    $userType.value = "BUYER";
  }
});
// 로그인 기능
const $loginForm = document.querySelector("#login-form");
const $usernameInput = document.querySelector("#id");
const $passwordInput = document.querySelector("#password");
const $error = document.querySelector("#error");
const $submitButton = document.querySelector(".login__submit-button");
$loginForm.addEventListener("submit", e => {
  e.preventDefault();
  login();
});
//로그인 api
async function login() {
  //로그인 벨리데이션
  const $username = $usernameInput.value.trim();
  const $password = $passwordInput.value.trim();
  if (!$username) {
    $error.style.display = "block";
    $submitButton.style.marginTop = "0px";
    $error.textContent = "아이디를 입력해 주세요.";
    $usernameInput.focus();
    return;
  }

  if (!$password) {
    $error.style.display = "block";
    $submitButton.style.marginTop = "0px";
    $error.textContent = "비밀번호를 입력해 주세요.";
    $passwordInput.focus();
    return;
  }
  $error.style.display = "none";
  $submitButton.style.marginTop = "36px";
  $error.textContent = "";
  // fetch를 사용해서 API 호출하기
  try {
    const response = await fetch(
      "https://api.wenivops.co.kr/services/open-market/accounts/login/",
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: $username,
          password: $password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
    const data = await response.json();
    if (data.access && data.refresh) {
      if (data.user.user_type != $userType.value) {
        const userType =
          data.user.user_type == "BUYER" ? "구매회원" : "판매회원";
        alert(`${userType} 로그인을 이용해 주세요.`);
      } else {
        saveTokens(data.access, data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = sessionStorage.getItem("previousPage");
      }
    } else if (data.error) {
      alert(data.error);
    }
  } catch (error) {
    $error.style.display = "block";
    $submitButton.style.marginTop = "0px";
    $error.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
    $usernameInput.focus();
  }
}
