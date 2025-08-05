export function validationForm() {
  const form = document.querySelector(".checkout-form");
  // 1) HTML5 기본 유효성 체크
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  // 이름 형식 체크
  const namePattern = /^[가-힣a-zA-Z\s]+$/;
  const orderName = document.querySelector("#order-name").value.trim();
  const receiverName = document.querySelector("#receiver-name").value.trim();
  // 전화번호 형식 체크
  const phonePattern = /^[0-9]+$/;
  const orderPhone1 = document.querySelector("#order-phone1").value.trim();
  const orderPhone2 = document.querySelector("#order-phone2").value.trim();
  const orderPhone3 = document.querySelector("#order-phone3").value.trim();
  const receiverPhone1 = document
    .querySelector("#receiver-phone1")
    .value.trim();
  const receiverPhone2 = document
    .querySelector("#receiver-phone2")
    .value.trim();
  const receiverPhone3 = document
    .querySelector("#receiver-phone3")
    .value.trim();
  //주소 체크
  const postcode = document.querySelector("#postcode").value.trim();
  const address = document.querySelector("#address").value.trim();
  //이메일 체크
  const email = document.querySelector("#order-email").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //결제수단
  const checkedPayment = document.querySelector(
    'input[name="payment"]:checked'
  );
  //동의
  const agree = document.querySelector('input[name="agree"]');
  if (!namePattern.test(orderName)) {
    alert("주문자 이름은 한글 또는 영문만 입력 가능합니다.");
    return false;
  }
  if (
    !phonePattern.test(orderPhone1) ||
    !phonePattern.test(orderPhone2) ||
    !phonePattern.test(orderPhone3)
  ) {
    alert("주문자 휴대폰 번호는 숫자만 입력해주세요.");
    return false;
  }
  if (!emailPattern.test(email)) {
    alert("올바른 이메일 형식을 입력해주세요.");
    return false;
  }
  if (!namePattern.test(receiverName)) {
    alert("수령인 이름은 한글 또는 영문만 입력 가능합니다.");
    return false;
  }
  if (
    !phonePattern.test(receiverPhone1) ||
    !phonePattern.test(receiverPhone2) ||
    !phonePattern.test(receiverPhone3)
  ) {
    alert("수령인 휴대폰 번호는 숫자만 입력해주세요.");
    return false;
  }
  if (postcode === "" || address === "") {
    alert("주소를 모두 입력해주세요.");
    return false;
  }

  if (!checkedPayment) {
    alert("결제수단을 선택해주세요.");
    return false;
  }
  if (!agree.checked) {
    alert("주문 내용 확인 및 정보 제공 동의가 필요합니다.");
    return false;
  }
  return true;
}
