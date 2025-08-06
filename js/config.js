// path-interceptor.js
(function () {
  "use strict";

  const REPO_NAME = "openMarketService";
  const { hostname } = window.location;

  // GitHub Pages에서만 실행
  if (!hostname.includes("github.io")) return;

  console.log("🔧 Path interceptor activated");

  // 경로 변환 함수
  const fixPath = path => {
    if (
      typeof path === "string" &&
      path.startsWith("/") &&
      !path.startsWith(`/${REPO_NAME}/`)
    ) {
      return `/${REPO_NAME}${path}`;
    }
    return path;
  };

  // 1. Image 객체 src 속성 오버라이드
  const ImageProto = Image.prototype;
  const originalSrcDescriptor = Object.getOwnPropertyDescriptor(
    HTMLImageElement.prototype,
    "src"
  );

  Object.defineProperty(HTMLImageElement.prototype, "src", {
    set: function (value) {
      const fixedPath = fixPath(value);
      console.log(`🖼️ Image: ${value} → ${fixedPath}`);
      originalSrcDescriptor.set.call(this, fixedPath);
    },
    get: function () {
      return originalSrcDescriptor.get.call(this);
    },
  });

  // 2. 모든 기존 DOM 요소 즉시 수정
  const fixExistingElements = () => {
    // 이미지
    document.querySelectorAll('img[src^="/"]').forEach(img => {
      const originalSrc = img.getAttribute("src");
      if (!originalSrc.startsWith(`/${REPO_NAME}/`)) {
        const newSrc = fixPath(originalSrc);
        img.setAttribute("src", newSrc);
        console.log(`🔄 Fixed img: ${originalSrc} → ${newSrc}`);
      }
    });

    // 링크
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      const originalHref = link.getAttribute("href");
      if (
        !originalHref.startsWith(`/${REPO_NAME}/`) &&
        !originalHref.includes("#")
      ) {
        const newHref = fixPath(originalHref);
        link.setAttribute("href", newHref);
        console.log(`🔗 Fixed link: ${originalHref} → ${newHref}`);
      }
    });

    // CSS 링크
    document.querySelectorAll('link[href^="/"]').forEach(link => {
      const originalHref = link.getAttribute("href");
      if (!originalHref.startsWith(`/${REPO_NAME}/`)) {
        const newHref = fixPath(originalHref);
        link.setAttribute("href", newHref);
        console.log(`🎨 Fixed CSS: ${originalHref} → ${newHref}`);
      }
    });

    // 스크립트
    document.querySelectorAll('script[src^="/"]').forEach(script => {
      const originalSrc = script.getAttribute("src");
      if (!originalSrc.startsWith(`/${REPO_NAME}/`)) {
        const newSrc = fixPath(originalSrc);
        const newScript = document.createElement("script");
        newScript.src = newSrc;
        newScript.async = script.async;
        newScript.defer = script.defer;
        script.parentNode.replaceChild(newScript, script);
        console.log(`📜 Fixed script: ${originalSrc} → ${newSrc}`);
      }
    });
  };

  // 3. fetch API 오버라이드
  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    const fixedUrl = fixPath(url);
    if (fixedUrl !== url) {
      console.log(`🌐 Fetch: ${url} → ${fixedUrl}`);
    }
    return originalFetch.call(this, fixedUrl, options);
  };

  // 4. XMLHttpRequest 오버라이드
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    const fixedUrl = fixPath(url);
    if (fixedUrl !== url) {
      console.log(`📡 XHR: ${url} → ${fixedUrl}`);
    }
    return originalXHROpen.call(this, method, fixedUrl, ...args);
  };

  // 5. 동적 요소 감시
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // 이미지
          if (node.tagName === "IMG" && node.hasAttribute("src")) {
            const src = node.getAttribute("src");
            if (src.startsWith("/") && !src.startsWith(`/${REPO_NAME}/`)) {
              node.setAttribute("src", fixPath(src));
            }
          }

          // 하위 요소들도 처리
          node
            .querySelectorAll?.('img[src^="/"], a[href^="/"], link[href^="/"]')
            .forEach(el => {
              const attr = el.tagName === "IMG" ? "src" : "href";
              const value = el.getAttribute(attr);
              if (
                value.startsWith("/") &&
                !value.startsWith(`/${REPO_NAME}/`)
              ) {
                el.setAttribute(attr, fixPath(value));
              }
            });
        }
      });
    });
  });

  // 실행
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fixExistingElements);
  } else {
    fixExistingElements();
  }

  observer.observe(document, { childList: true, subtree: true });

  console.log("✅ Path interceptor ready");
})();
