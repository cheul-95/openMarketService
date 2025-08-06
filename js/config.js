// auto-base.js
(function () {
  "use strict";

  const { hostname, pathname } = window.location;

  // GitHub Pages 환경에서만 실행
  if (hostname.includes("github.io")) {
    const pathSegments = pathname.split("/").filter(Boolean);
    const repoName = pathSegments[0];

    if (repoName) {
      // 기존 base 태그가 있으면 제거
      const existingBase = document.querySelector("base");
      if (existingBase) {
        existingBase.remove();
      }

      // 새 base 태그 생성 및 삽입
      const base = document.createElement("base");
      base.href = `/${repoName}/`;

      // head의 가장 첫 번째에 삽입 (다른 모든 리소스보다 먼저)
      const head = document.head || document.getElementsByTagName("head")[0];
      head.insertBefore(base, head.firstChild);

      console.log(`✅ Base path set to: /${repoName}/`);
    }
  }
})();
