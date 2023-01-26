"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _index = _interopRequireDefault(require("../constants/index.js"));
var SOCKET_IO_CLIENT_RESPONSE_FINAL_PACKET = _index["default"].SOCKET_IO_CLIENT_RESPONSE_FINAL_PACKET;
var checkIfFinalPacket = function checkIfFinalPacket(data) {
  return data.headers.hasOwnProperty(SOCKET_IO_CLIENT_RESPONSE_FINAL_PACKET) && data.headers[SOCKET_IO_CLIENT_RESPONSE_FINAL_PACKET] === true;
};
var _default = checkIfFinalPacket;
exports["default"] = _default;