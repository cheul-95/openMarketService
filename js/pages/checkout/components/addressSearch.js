export function initPostcodeSearch() {
  //우편번호
  const $postBtn = document.querySelector(".checkout-order__postcode-btn");
  $postBtn.addEventListener("click", function () {
    new daum.Postcode({
      oncomplete: function (data) {
        document.querySelector("#postcode").value = data.zonecode;
        document.querySelector("#address").value = data.address;
      },
    }).open();
  });
}
