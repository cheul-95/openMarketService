import { getTokenStatus } from "../../core/config.js";
import { getHeaderGNB } from "../components/headerRender.js";
import {
  logoutGNBEvent,
  searchGNBEvent,
  toggleGNBEvent,
} from "./components/headerEventHandlers.js";
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
