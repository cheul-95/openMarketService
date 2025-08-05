export function userPhoneNumberValidate() {
  const phoneNumberStatus = document.querySelector("#user-phonenumber-status");

  const $phone1 = document.querySelector("#user-phoneNumber1");
  const $phone2 = document.querySelector("#user-phoneNumber2");
  const $phone3 = document.querySelector("#user-phoneNumber3");

  function getPhoneNumber() {
    return $phone1.value + $phone2.value + $phone3.value;
  }

  async function validateUsername(userPhoneNumber) {
    try {
      const response = await fetch(
        "https://api.wenivops.co.kr/services/open-market/accounts/buyer/signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone_number: userPhoneNumber,
          }),
        }
      );
      if (!response.ok) {
        const errorMsg = await response.json();
        throw errorMsg;
      }
    } catch (error) {
      phoneNumberStatus.innerHTML = JSON.stringify(error);
    }
  }

  validateUsername(getPhoneNumber());
}
