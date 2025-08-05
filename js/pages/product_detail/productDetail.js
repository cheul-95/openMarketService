//메인 페이지 js파일입니다.
import { productDetail } from "./components/productDetailContainer.js";

// 헤더와 푸터 로드
async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error(`Failed to load ${filePath}:`, error);
  }
  //헤더가 그려지는 부분에서 import 진행시 돔요소 읽어 옴.
  if (elementId == "header") {
    const { initHeader } = await import("../../components/header.js");
    initHeader();
  }
}

function getProductIdFromUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    return productId;
  } else {
    window.location.href = "/pages/error.html";
    return null;
  }
}

// 페이지 로드 시 헤더와 푸터 로드
document.addEventListener("DOMContentLoaded", async function () {
  loadComponent("header", "./components/header.html");
  loadComponent("footer", "./components/footer.html");
  productDetail(getProductIdFromUrlParams());
});
