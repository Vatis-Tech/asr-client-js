"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("../constants/index.js"));

var RESERVATION_URL = _index["default"].RESERVATION_URL;

function generateReservationUrl(_ref) {
  var serviceHost = _ref.serviceHost;
  var reservationUrl = RESERVATION_URL;
  reservationUrl = reservationUrl.replace("<service_host>", serviceHost);
  return reservationUrl;
}

var _default = generateReservationUrl;
exports["default"] = _default;