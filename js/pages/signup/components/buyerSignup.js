/**
 * 구매자 계정 가입 API 요청을 처리하는 컴포넌트
 */

export function buyerSignup() {
  /**
   * 구매자 회원가입 API 호출
   * @param {Object} userData - 사용자 데이터
   * @param {string} userData.username - 아이디
   * @param {string} userData.password - 비밀번호
   * @param {string} userData.name - 이름
   * @param {string} userData.phone_number - 전화번호
   * @returns {Promise<Object>} API 응답 결과
   */
  async function registerBuyer(userData) {
    try {
      const response = await fetch(
        "https://api.wenivops.co.kr/services/open-market/accounts/buyer/signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // 성공 시
        console.log("회원가입 성공:", data);
        return {
          success: true,
          data: data,
          message: "회원가입이 완료되었습니다.",
        };
      } else {
        // 실패 시 - 에러 필드별로 메시지 처리
        console.log("회원가입 실패:", data);
        return {
          success: false,
          errors: data,
          status: response.status,
        };
      }
    } catch (error) {
      console.error("네트워크 오류:", error);
      return {
        success: false,
        message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
        error: error,
      };
    }
  }

  /**
   * 폼 데이터를 수집하여 API 형식에 맞게 변환
   * @returns {Object} API 요청용 데이터
   */
  function collectFormData() {
    const username = document.querySelector("#user-id").value.trim();
    const password = document.querySelector("#user-password").value;
    const name = document.querySelector("#user-name").value.trim();

    // 전화번호 3개 필드를 합쳐서 하나의 문자열로 만들기
    const phone1 = document.querySelector("#user-phoneNumber1").value;
    const phone2 = document.querySelector("#user-phoneNumber2").value;
    const phone3 = document.querySelector("#user-phoneNumber3").value;
    const phone_number = phone1 + phone2 + phone3;

    const formData = {
      username,
      password,
      name,
      phone_number,
    };

    console.log("수집된 폼 데이터:", formData);
    return formData;
  }

  /**
   * API 에러 응답을 화면에 표시
   * @param {Object} errors - API 에러 응답
   */
  function displayErrors(errors) {
    // 기존 에러 메시지 초기화
    clearAllErrors();

    Object.keys(errors).forEach(field => {
      const errorMessages = errors[field];
      if (Array.isArray(errorMessages) && errorMessages.length > 0) {
        displayFieldError(field, errorMessages[0]);
      }
    });
  }

  /**
   * 특정 필드의 에러 메시지 표시
   * @param {string} field - 필드명
   * @param {string} message - 에러 메시지
   */
  function displayFieldError(field, message) {
    let element, messageElement;

    switch (field) {
      case "username":
        element = document.querySelector("#user-id");
        messageElement = document.querySelector(
          ".signup__container-id .signup__message"
        );
        break;
      case "password":
        element = document.querySelector("#user-password");
        messageElement = document.querySelector(
          ".signup__container-password .signup__message"
        );
        break;
      case "name":
        element = document.querySelector("#user-name");
        messageElement = document.querySelector(
          ".signup__container-name .signup__message"
        );
        break;
      case "phone_number":
        // 전화번호는 3개 필드 모두에 에러 표시
        document.querySelector("#user-phoneNumber1").classList.add("error");
        document.querySelector("#user-phoneNumber2").classList.add("error");
        document.querySelector("#user-phoneNumber3").classList.add("error");
        messageElement = document.querySelector("#user-phonenumber-status");
        break;
    }

    if (element && field !== "phone_number") {
      element.classList.add("error");
    }

    if (messageElement) {
      messageElement.textContent = message;
      messageElement.classList.add("signup__message--error");
      messageElement.classList.remove("signup__message--success");

      // 전화번호 메시지의 경우 스타일 클래스 추가
      if (field === "phone_number") {
        messageElement.style.color = "#e52528";
        messageElement.style.fontSize = "16px";
        messageElement.style.marginTop = "4px";
      }
    }
  }

  /**
   * 모든 에러 상태 초기화
   */
  function clearAllErrors() {
    // 입력 필드 에러 클래스 제거
    const inputs = [
      "#user-id",
      "#user-password",
      "#check-password",
      "#user-name",
      "#user-phoneNumber1",
      "#user-phoneNumber2",
      "#user-phoneNumber3",
    ];

    inputs.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.remove("error");
      }
    });

    // 메시지 요소들 초기화
    const messageElements = document.querySelectorAll(".signup__message");
    messageElements.forEach(element => {
      element.classList.remove(
        "signup__message--error",
        "signup__message--success"
      );
      element.textContent = "";
    });

    // 전화번호 메시지 요소 초기화
    const phoneMessage = document.querySelector("#user-phonenumber-status");
    if (phoneMessage) {
      phoneMessage.textContent = "";
      phoneMessage.classList.remove(
        "signup__message--error",
        "signup__message--success"
      );
    }
  }

  /**
   * 회원가입 성공 시 처리
   * @par/indexdata - 성공 응답 데이터
   */
  async function handleSignupSuccess(data) {
    alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
    window.location.href = "/pages/login.html"; // 로그인 페이지로 이동
  }
  /**
   * 회원가입 처리 메인 함수
   */
  async function handleSignup() {
    console.log("handleSignup 함수 시작");
    const formData = collectFormData();

    // 로딩 상태 표시
    const submitButton = document.querySelector("#join");
    console.log("제출 버튼:", submitButton);

    if (!submitButton) {
      console.error("제출 버튼을 찾을 수 없습니다!");
      return;
    }

    const originalText = submitButton.textContent;
    submitButton.textContent = "처리중...";
    submitButton.disabled = true;

    try {
      console.log("API 호출 시작...");
      const result = await registerBuyer(formData);
      console.log("API 호출 결과:", result);

      if (result.success) {
        console.log("회원가입 성공, 성공 처리 시작...");
        handleSignupSuccess(result.data);
      } else {
        console.log("회원가입 실패, 에러 처리 시작...");
        if (result.errors) {
          displayErrors(result.errors);
        } else if (result.message) {
          alert(result.message);
        }
      }
    } catch (error) {
      console.error("handleSignup에서 예외 발생:", error);
    } finally {
      // 로딩 상태 해제 - 버튼이 원래 활성화되어 있었다면 다시 활성화
      submitButton.textContent = originalText;

      // 폼 유효성 검사 상태에 따라 버튼 활성화 여부 결정
      const validator = window.formValidator; // 전역 validator 참조
      if (validator && validator.validateAll()) {
        submitButton.disabled = false;
      }
    }
  }

  return {
    handleSignup,
    collectFormData,
    displayErrors,
    clearAllErrors,
  };
}
