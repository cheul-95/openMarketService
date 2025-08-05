export function IDvalidate() {
  //id관련 dom 요소
  const $userID = document.querySelector("#user-id");
  const $userIDvalidate = document.querySelector(".signup__message");
  const $checkUserIDvalidate = document.querySelector(".signup__check-id");

  /**
   * api에 ID를 보내 중복인지 확인하는 함수
   * @param {*} username
   */
  async function validateUsername(username) {
    try {
      const response = await fetch(
        "https://api.wenivops.co.kr/services/open-market/accounts/validate-username/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
          }),
        }
      );
      if (response.ok) {
        $userIDvalidate.innerHTML = `멋진 아이디네요 :)`;
        $userIDvalidate.classList.add("signup__message--success");
        $userIDvalidate.classList.remove("signup__message--error");
        $userID.classList.remove("error"); // 에러 클래스 제거
      }
      if (!response.ok) {
        $userIDvalidate.innerHTML = `이미 사용 중인 아이디입니다.`;
        $userIDvalidate.classList.add("signup__message--error");
        $userIDvalidate.classList.remove("signup__message--success");
        $userID.classList.add("error"); // 에러 클래스 추가
      }
    } catch (error) {
      console.log(error, "통신에러발생!");
    }
  }

  /**
   * 아이디의 유효성을 검사하는 함수
   * @param {*} input
   */
  function validateUserID(input) {
    if (/^[a-zA-Z0-9]{1,20}$/.test(input) === true) {
      // 정규식 통과 시 에러 클래스 제거
      $userID.classList.remove("error");
      validateUsername(input);
    } else if (/^[a-zA-Z0-9]{1,20}$/.test(input) === false) {
      $userIDvalidate.innerHTML = `20자 이내의 영문 소문자, 대문자, 숫자만 가능합니다.`;
      $userIDvalidate.classList.add("signup__message--error");
      $userIDvalidate.classList.remove("signup__message--success");
      $userID.classList.add("error"); // 에러 클래스 추가
    }
  }
  $checkUserIDvalidate.addEventListener("click", e => {
    validateUserID($userID.value);
  });
}
