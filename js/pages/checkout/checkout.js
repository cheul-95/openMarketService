import { initPostcodeSearch } from "/js/pages/checkout/components/addressSearch.js";
import {
  confirmInfoAgreement,
  orderEvent,
} from "/js/pages/checkout/components/checkoutEventHandlers.js";
import {
  checkoutRender,
  chkCartItem,
} from "/js/pages/checkout/components/checkoutRenderer.js";
checkoutRender();
chkCartItem();
initPostcodeSearch();
confirmInfoAgreement();
orderEvent();
