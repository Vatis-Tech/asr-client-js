"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var API_URL = "http://localhost:8080/api/v1/asr-client/auth?service=<service>&model=<model>&language=<language>";
var RESERVATION_URL = "<service_host>/asr/v1/registry/stream/reserve";
var SOCKET_IO_CLIENT_NAMESPACE = "/asr_stream";
var SOCKET_IO_CLIENT_TRANSPORTS = ["websocket"];
var SOCKET_IO_CLIENT_PATH = "/live/transcribe/socket.io";
var SOCKET_IO_CLIENT_RESULT_PATH = "/asr_result";
var SOCKET_IO_CLIENT_REQUEST_PATH = "/asr_request";
var SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET = "SplitPacket";
var SOCKET_IO_CLIENT_RESPONSE_FINAL_SPLIT_PACKET = "FinalSplitPacket";
var SOCKET_IO_CLIENT_FRAME_OVERLAP = 0.25;
var SOCKET_IO_CLIENT_BUFFER_OFFSET = 0.25;
var SOCKET_IO_CLIENT_AUDIO_FORMAT = "webm";
var SOCKET_IO_CLIENT_SENDING_HEADERS = "True";
var SOCKET_IO_CLIENT_ACCESS_CONTROL_ALLOW_ORIGIN = "*";
var SOCKET_IO_CLIENT_ACCESS_CONTROL_ALLOW_METHODS = "GET,POST";
var MICROPHONE_BIT_RATE_SAMPLES = 8000;
var MICROPHONE_TIMESLICE = 250;
var projectConstants = {
  API_URL: API_URL,
  RESERVATION_URL: RESERVATION_URL,
  SOCKET_IO_CLIENT_NAMESPACE: SOCKET_IO_CLIENT_NAMESPACE,
  SOCKET_IO_CLIENT_TRANSPORTS: SOCKET_IO_CLIENT_TRANSPORTS,
  SOCKET_IO_CLIENT_PATH: SOCKET_IO_CLIENT_PATH,
  SOCKET_IO_CLIENT_RESULT_PATH: SOCKET_IO_CLIENT_RESULT_PATH,
  SOCKET_IO_CLIENT_REQUEST_PATH: SOCKET_IO_CLIENT_REQUEST_PATH,
  SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET: SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET,
  SOCKET_IO_CLIENT_RESPONSE_FINAL_SPLIT_PACKET: SOCKET_IO_CLIENT_RESPONSE_FINAL_SPLIT_PACKET,
  SOCKET_IO_CLIENT_FRAME_OVERLAP: SOCKET_IO_CLIENT_FRAME_OVERLAP,
  SOCKET_IO_CLIENT_BUFFER_OFFSET: SOCKET_IO_CLIENT_BUFFER_OFFSET,
  SOCKET_IO_CLIENT_AUDIO_FORMAT: SOCKET_IO_CLIENT_AUDIO_FORMAT,
  SOCKET_IO_CLIENT_SENDING_HEADERS: SOCKET_IO_CLIENT_SENDING_HEADERS,
  SOCKET_IO_CLIENT_ACCESS_CONTROL_ALLOW_ORIGIN: SOCKET_IO_CLIENT_ACCESS_CONTROL_ALLOW_ORIGIN,
  SOCKET_IO_CLIENT_ACCESS_CONTROL_ALLOW_METHODS: SOCKET_IO_CLIENT_ACCESS_CONTROL_ALLOW_METHODS,
  MICROPHONE_BIT_RATE_SAMPLES: MICROPHONE_BIT_RATE_SAMPLES,
  MICROPHONE_TIMESLICE: MICROPHONE_TIMESLICE
};
var _default = projectConstants;
exports["default"] = _default;