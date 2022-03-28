"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("../constants/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET = _index["default"].SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET,
    SOCKET_IO_CLIENT_RESPONSE_FINAL_SPLIT_PACKET = _index["default"].SOCKET_IO_CLIENT_RESPONSE_FINAL_SPLIT_PACKET;

var checkIfFinalPacket = function checkIfFinalPacket(data) {
  return !data.headers.hasOwnProperty(SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET) || data.headers.hasOwnProperty(SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET) && data.headers.hasOwnProperty(SOCKET_IO_CLIENT_RESPONSE_FINAL_SPLIT_PACKET) && data.headers.SplitPacket === true && data.headers.FinalSplitPacket === true;
};

var _default = checkIfFinalPacket;
exports["default"] = _default;