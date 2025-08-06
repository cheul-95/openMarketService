// js/config.js (또는 루트에 config.js)
(function () {
  "use strict";

  // 환경 감지 및 basePath 설정
  const getBasePath = () => {
    const { hostname, pathname } = window.location;

    if (hostname.includes("github.io")) {
      const segments = pathname.split("/").filter(Boolean);
      return segments.length > 0 ? `/${segments[0]}` : "";
    }
    return "";
  };

  const basePath = getBasePath();

  // basePath가 없으면 스크립트 종료 (로컬환경)
  if (!basePath) return;

  console.log("🔧 Auto-fixing paths for:", basePath);

  // DOM 변환 함수
  const fixAllPaths = () => {
    // 1. 모든 이미지 src 속성 자동 변경
    document.querySelectorAll('img[src^="/"]').forEach(img => {
      const originalSrc = img.getAttribute("src");
      if (!originalSrc.startsWith(basePath)) {
        img.src = basePath + originalSrc;
      }
    });

    // 2. 모든 링크 href 속성 자동 변경
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      const originalHref = link.getAttribute("href");
      if (!originalHref.startsWith(basePath) && !originalHref.includes("#")) {
        link.href = basePath + originalHref;
      }
    });

    // 3. CSS 링크 자동 변경
    document.querySelectorAll('link[href^="/"]').forEach(link => {
      const originalHref = link.getAttribute("href");
      if (!originalHref.startsWith(basePath)) {
        link.href = basePath + originalHref;
      }
    });

    // 4. Script src 자동 변경
    document.querySelectorAll('script[src^="/"]').forEach(script => {
      const originalSrc = script.getAttribute("src");
      if (!originalSrc.startsWith(basePath)) {
        script.src = basePath + originalSrc;
      }
    });

    // 5. Form action 자동 변경
    document.querySelectorAll('form[action^="/"]').forEach(form => {
      const originalAction = form.getAttribute("action");
      if (!originalAction.startsWith(basePath)) {
        form.action = basePath + originalAction;
      }
    });

    // 6. JavaScript로 생성되는 요소들 감시
    observeNewElements();
  };

  // 새로 추가되는 DOM 요소들 자동 감시
  const observeNewElements = () => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            fixElementPaths(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  // 개별 요소 경로 수정
  const fixElementPaths = element => {
    // 이미지
    if (element.tagName === "IMG" && element.src.startsWith("/")) {
      element.src = basePath + element.getAttribute("src");
    }

    // 링크
    if (element.tagName === "A" && element.href.startsWith("/")) {
      element.href = basePath + element.getAttribute("href");
    }

    // 하위 요소들도 검사
    element
      .querySelectorAll?.(
        'img[src^="/"], a[href^="/"], link[href^="/"], script[src^="/"]'
      )
      .forEach(child => {
        fixElementPaths(child);
      });
  };

  // JavaScript의 window.location.href 등 자동 변경
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (state, title, url) {
    if (
      typeof url === "string" &&
      url.startsWith("/") &&
      !url.startsWith(basePath)
    ) {
      url = basePath + url;
    }
    return originalPushState.call(this, state, title, url);
  };

  history.replaceState = function (state, title, url) {
    if (
      typeof url === "string" &&
      url.startsWith("/") &&
      !url.startsWith(basePath)
    ) {
      url = basePath + url;
    }
    return originalReplaceState.call(this, state, title, url);
  };

  // fetch, XMLHttpRequest 등도 자동 변경
  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    if (
      typeof url === "string" &&
      url.startsWith("/") &&
      !url.startsWith(basePath)
    ) {
      url = basePath + url;
    }
    return originalFetch(url, options);
  };

  // DOM 로드 완료시 실행
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fixAllPaths);
  } else {
    fixAllPaths();
  }

  console.log("✅ Path auto-fix initialized");
})();
