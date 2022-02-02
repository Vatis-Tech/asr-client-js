"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var API_URL = "http://localhost:8080/api/v1/asr-client/auth?service=<service>&model=<model>&language=<language>";
var SOCKET_IO_CLIENT_NAMESPACE = "/asr_stream";
var SOCKET_IO_CLIENT_TRANSPORTS = ["polling", "websocket"];
var SOCKET_IO_CLIENT_PATH = "/asr/v1/live/transcribe/socket.io";
var SOCKET_IO_CLIENT_RESULT_PATH = "/asr_result";
var SOCKET_IO_CLIENT_REQUEST_PATH = "/asr_request";
var SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET = "SplitPacket";
var SOCKET_IO_CLIENT_RESPONSE_FINAL_SPLIT_PACKET = "FinalSplitPacket";
var MICROPHONE_BIT_RATE_SAMPLES = 8000;
var MICROPHONE_TIMESLICE = 500;
var projectConstants = {
  API_URL: API_URL,
  SOCKET_IO_CLIENT_NAMESPACE: SOCKET_IO_CLIENT_NAMESPACE,
  SOCKET_IO_CLIENT_TRANSPORTS: SOCKET_IO_CLIENT_TRANSPORTS,
  SOCKET_IO_CLIENT_PATH: SOCKET_IO_CLIENT_PATH,
  SOCKET_IO_CLIENT_RESULT_PATH: SOCKET_IO_CLIENT_RESULT_PATH,
  SOCKET_IO_CLIENT_REQUEST_PATH: SOCKET_IO_CLIENT_REQUEST_PATH,
  MICROPHONE_BIT_RATE_SAMPLES: MICROPHONE_BIT_RATE_SAMPLES,
  MICROPHONE_TIMESLICE: MICROPHONE_TIMESLICE
};
var _default = projectConstants;
exports["default"] = _default;