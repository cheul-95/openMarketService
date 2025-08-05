export function showLoginModal() {
  const loginModal = document.getElementById("login-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const loginBtn = document.getElementById("login");
  const closeXBtn = document.getElementById("close-x-btn");

  if (!loginModal) {
    console.error("Error: 'login-modal' element not found.");
    return;
  }
  if (!closeModalBtn) {
    console.error("Error: 'close-modal' button not found within loginModal.");
    return;
  }
  if (!loginBtn) {
    console.error("Error: 'login' button not found within loginModal.");
    return;
  }
  if (!closeXBtn) {
    console.error("Error: 'close-x-btn' button not found within loginModal.");
    return;
  }

  loginModal.showModal();
  loginModal.style.display = "flex";

  closeModalBtn.addEventListener(
    "click",
    () => {
      loginModal.close();
      loginModal.style.display = "none";
    },
    { once: true }
  );

  loginBtn.addEventListener(
    "click",
    () => {
      loginModal.close();
      loginModal.style.display = "none";
      window.location.href = "login.html";
    },
    { once: true }
  );

  closeXBtn.addEventListener(
    "click",
    () => {
      loginModal.close();
      loginModal.style.display = "none";
    },
    { once: true }
  );

  loginModal.addEventListener(
    "cancel",
    event => {
      console.log("모달이 Esc 키로 닫혔습니다.");
    },
    { once: true }
  );
}
