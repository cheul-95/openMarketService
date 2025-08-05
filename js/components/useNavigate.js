export function gotoReferrer() {
  const prevUrl = document.referrer;
  if (prevUrl && prevUrl !== window.location.href && prevUrl != null) {
    window.location.href = prevUrl; // 이전 페이지로 이동
  } else {
    window.location.href = "/"; // 홈(혹은 원하는 기본 페이지)
  }
}
