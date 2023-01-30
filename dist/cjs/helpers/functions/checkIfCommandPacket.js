"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _index = _interopRequireDefault(require("../constants/index.js"));
var SOCKET_IO_CLIENT_RESPONSE_COMMAND_PACKET = _index["default"].SOCKET_IO_CLIENT_RESPONSE_COMMAND_PACKET;
var checkIfCommandPacket = function checkIfCommandPacket(data) {
  return data.headers.hasOwnProperty(SOCKET_IO_CLIENT_RESPONSE_COMMAND_PACKET);
};
var _default = checkIfCommandPacket;
exports["default"] = _default;