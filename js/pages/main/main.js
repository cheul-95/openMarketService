//메인 페이지 js파일입니다.
import { initHeader } from "../../components/header/header.js"; //
import { carouselControl } from "./components/carousel.js";
import { getProducts } from "./components/renderProduct.js";

// 헤더와 푸터 로드
async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error(`Failed to load ${filePath}:`, error);
  }
}

// 페이지 로드 시 헤더와 푸터 로드
document.addEventListener("DOMContentLoaded", async function () {
  // 헤더와 푸터 로드
  await loadComponent("header", "/pages/components/header.html");
  await loadComponent("footer", "/pages/components/footer.html");

  // 헤더 로드 후 initHeader
  initHeader();

  //캐러셀컨트롤 함수 로드
  carouselControl();
  //products render 함수 로드
  getProducts();
});
