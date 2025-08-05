export function formValidate() {
  const $form = document.querySelector(".signup");
  const $submitBtn = document.querySelector("#join");

  // 각 필드의 유효성 상태를 저장하는 객체
  const validationState = {
    id: false,
    password: false,
    passwordConfirm: false,
    name: false,
    phone: false,
    agreement: false,
  };

  // 모든 필드가 유효한지 확인하는 함수
  function checkAllValid() {
    const allValid = Object.values(validationState).every(valid => valid);
    $submitBtn.disabled = !allValid;

    if (allValid) {
      $form.classList.add("signup--valid");
    } else {
      $form.classList.remove("signup--valid");
    }
  }

  // 아이디 유효성 검사
  function validateID() {
    const $userID = document.querySelector("#user-id");
    const value = $userID.value.trim();

    if (value === "") {
      validationState.id = false;
    } else if (!/^[a-zA-Z0-9]{1,20}$/.test(value)) {
      validationState.id = false;
    } else {
      validationState.id = true;
    }

    checkAllValid();
    return validationState.id;
  }

  // 비밀번호 유효성 검사
  function validatePassword() {
    const $password = document.querySelector("#user-password");
    const value = $password.value;

    if (value.length >= 8 && /[a-z]/.test(value)) {
      validationState.password = true;
    } else {
      validationState.password = false;
    }

    checkAllValid();
    return validationState.password;
  }

  // 비밀번호 확인 유효성 검사
  function validatePasswordConfirm() {
    const $password = document.querySelector("#user-password");
    const $passwordConfirm = document.querySelector("#check-password");

    if (
      $password.value === $passwordConfirm.value &&
      $passwordConfirm.value !== ""
    ) {
      validationState.passwordConfirm = true;
    } else {
      validationState.passwordConfirm = false;
    }

    checkAllValid();
    return validationState.passwordConfirm;
  }

  // 이름 유효성 검사
  function validateName() {
    const $name = document.querySelector("#user-name");
    const value = $name.value.trim();

    if (value !== "") {
      validationState.name = true;
    } else {
      validationState.name = false;
    }

    checkAllValid();
    return validationState.name;
  }

  // 전화번호 유효성 검사
  function validatePhone() {
    const $phone1 = document.querySelector("#user-phoneNumber1");
    const $phone2 = document.querySelector("#user-phoneNumber2");
    const $phone3 = document.querySelector("#user-phoneNumber3");

    const phoneNumber = $phone1.value + $phone2.value + $phone3.value;

    if (/^01[0-9]{8,9}$/.test(phoneNumber)) {
      validationState.phone = true;
    } else {
      validationState.phone = false;
    }

    checkAllValid();
    return validationState.phone;
  }

  // 약관 동의 검사
  function validateAgreement() {
    const $agreement = document.querySelector("#agreement");
    validationState.agreement = $agreement.checked;
    checkAllValid();
    return validationState.agreement;
  }

  // 이벤트 리스너 등록
  function initEventListeners() {
    // 아이디 입력 시
    document.querySelector("#user-id").addEventListener("input", validateID);

    // 비밀번호 입력 시
    document.querySelector("#user-password").addEventListener("input", () => {
      validatePassword();
      validatePasswordConfirm(); // 비밀번호 변경 시 확인도 다시 검사
    });

    // 비밀번호 확인 입력 시
    document
      .querySelector("#check-password")
      .addEventListener("input", validatePasswordConfirm);

    // 이름 입력 시
    document
      .querySelector("#user-name")
      .addEventListener("input", validateName);

    // 전화번호 입력 시
    document
      .querySelector("#user-phoneNumber2")
      .addEventListener("input", validatePhone);
    document
      .querySelector("#user-phoneNumber3")
      .addEventListener("input", validatePhone);
    document
      .querySelector("#user-phoneNumber1")
      .addEventListener("change", validatePhone);

    // 약관 동의 체크 시
    document
      .querySelector("#agreement")
      .addEventListener("change", validateAgreement);
  }

  // 외부에서 유효성 상태를 확인할 수 있는 함수들 반환
  return {
    init: initEventListeners,
    getValidationState: () => validationState,
    validateAll: () => {
      validateID();
      validatePassword();
      validatePasswordConfirm();
      validateName();
      validatePhone();
      validateAgreement();
      return Object.values(validationState).every(valid => valid);
    },
  };
}
