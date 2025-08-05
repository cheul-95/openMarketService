export function PWvalidate() {
  //password관련 dom 요소
  const $userPassword = document.querySelector("#user-password");
  const $checkUserpassword = document.querySelector("#check-password");
  const $userPasswordStatus = document.querySelector("#user-password-message");
  const $checkUserpasswordValidate = document.querySelector(
    "#check-password-message"
  );

  // 아이콘 요소들
  const $userPasswordIcon = document
    .querySelector("#user-password")
    .closest(".signup__input-group")
    .querySelector(".signup__icon");
  const $checkPasswordIcon = document
    .querySelector("#check-password")
    .closest(".signup__input-group")
    .querySelector(".signup__icon");

  let debounceTimer = null;
  let isPWValid = false;

  // 초기 상태 설정 - 기본 회색 아이콘 표시
  function initializeIcons() {
    // 기본 상태로 설정 (회색 아이콘)
    $userPasswordIcon.classList.remove(
      "signup__icon--success",
      "signup__icon--error"
    );
    $checkPasswordIcon.classList.remove(
      "signup__icon--success",
      "signup__icon--error"
    );
  }

  /**
   * 비밀번호의 유효성을 확인하는 함수
   * @param {*} input
   */
  function validateUserPassword(input) {
    if (!input) {
      // 입력이 없으면 기본 상태로 복원
      $userPasswordStatus.innerHTML = "";
      $userPasswordStatus.classList.remove("signup__message--error");
      $userPassword.classList.remove("error");

      // 기본 회색 아이콘
      $userPasswordIcon.classList.remove(
        "signup__icon--success",
        "signup__icon--error"
      );

      isPWValid = false;
      return;
    }

    if (
      /^(?=.*[~!@#$%^&*_\-+=|\\:;?"'<>,./])[a-zA-Z0-9~!@#$%^&*_\-+=|\\:;?"'<>,./]{8,20}$/.test(
        input
      ) === false
    ) {
      $userPasswordStatus.innerHTML = `8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.`;
      $userPasswordStatus.classList.add("signup__message--error");
      $userPassword.classList.add("error");

      // 에러 아이콘 표시
      $userPasswordIcon.classList.remove("signup__icon--success");
      $userPasswordIcon.classList.add("signup__icon--error");

      isPWValid = false;
    } else {
      $userPasswordStatus.innerHTML = "";
      $userPasswordStatus.classList.remove("signup__message--error");
      $userPassword.classList.remove("error");

      // 성공 아이콘 표시
      $userPasswordIcon.classList.remove("signup__icon--error");
      $userPasswordIcon.classList.add("signup__icon--success");

      isPWValid = true;
    }

    // 비밀번호가 변경되면 비밀번호 확인도 다시 검사
    if ($checkUserpassword.value) {
      checkUserPWvalidate();
    }
  }

  $userPassword.addEventListener("input", e => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      validateUserPassword($userPassword.value);
    }, 500);
  });

  function checkUserPWvalidate() {
    if (!$checkUserpassword.value) {
      // 입력이 없으면 기본 상태로 복원
      $checkUserpasswordValidate.innerHTML = "";
      $checkUserpasswordValidate.classList.remove("signup__message--error");
      $checkUserpassword.classList.remove("error");

      // 기본 회색 아이콘
      $checkPasswordIcon.classList.remove(
        "signup__icon--success",
        "signup__icon--error"
      );
      return;
    }

    if (
      $userPassword.value === $checkUserpassword.value &&
      $checkUserpassword.value !== "" &&
      isPWValid
    ) {
      $checkUserpasswordValidate.innerHTML = "";
      $checkUserpasswordValidate.classList.remove("signup__message--error");
      $checkUserpassword.classList.remove("error");

      // 성공 아이콘 표시
      $checkPasswordIcon.classList.remove("signup__icon--error");
      $checkPasswordIcon.classList.add("signup__icon--success");
    } else {
      $checkUserpasswordValidate.innerHTML = `비밀번호가 일치하지 않습니다.`;
      $checkUserpasswordValidate.classList.add("signup__message--error");
      $checkUserpassword.classList.add("error");

      // 에러 아이콘 표시
      $checkPasswordIcon.classList.remove("signup__icon--success");
      $checkPasswordIcon.classList.add("signup__icon--error");
    }
  }

  $checkUserpassword.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      checkUserPWvalidate();
    }, 500);
  });

  // 컴포넌트 초기화
  initializeIcons();
}
