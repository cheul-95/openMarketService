import { initPostcodeSearch } from "./components/addressSearch.js";
import {
  confirmInfoAgreement,
  orderEvent,
} from "./components/checkoutEventHandlers.js";
import {
  checkoutRender,
  chkCartItem,
} from "./components/checkoutRenderer.js";
checkoutRender();
chkCartItem();
initPostcodeSearch();
confirmInfoAgreement();
orderEvent();
