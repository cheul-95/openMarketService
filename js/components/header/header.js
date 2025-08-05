import {
  logoutGNBEvent,
  searchGNBEvent,
  toggleGNBEvent,
} from "/js/components/header/components/headerEventHandlers.js";
import { getHeaderGNB } from "/js/components/header/components/headerRender.js";
import { getTokenStatus } from "/js/core/config.js";
export function initHeader() {
  //로그인 토큰 가져오기
  const loginStatus = getTokenStatus();
  //GNB 랜딩
  getHeaderGNB(loginStatus);
  // 검색기능
  searchGNBEvent();
  if (loginStatus.hasAccessToken) {
    //GNB 토글기능
    toggleGNBEvent();
    //로그아웃
    logoutGNBEvent();
  }
}
