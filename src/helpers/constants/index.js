const API_URL =
  "https://vatis.tech/api/v1/asr-client/auth?service=<service>&model=<model>&language=<language>";

const RESERVATION_URL = "http://<service_host>/asr/v1/registry/stream/reserve";

const SOCKET_IO_CLIENT_NAMESPACE = "/asr_stream";
const SOCKET_IO_CLIENT_TRANSPORTS = ["websocket"];
// const SOCKET_IO_CLIENT_PATH = "/asr/v1/live/transcribe/socket.io";
const SOCKET_IO_CLIENT_PATH = "/asr/v1/service/live/transcribe/socket.io";
const SOCKET_IO_CLIENT_RESULT_PATH = "/asr_result";
const SOCKET_IO_CLIENT_REQUEST_PATH = "/asr_request";
const SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET = "SplitPacket";
const SOCKET_IO_CLIENT_RESPONSE_FINAL_SPLIT_PACKET = "FinalSplitPacket";
const SOCKET_IO_CLIENT_FRAME_OVERLAP = 0.5;
const SOCKET_IO_CLIENT_BUFFER_OFFSET = 0.5;
const SOCKET_IO_CLIENT_AUDIO_FORMAT = "webm";
const SOCKET_IO_CLIENT_SENDING_HEADERS = "True";
const SOCKET_IO_CLIENT_ACCESS_CONTROL_ALLOW_ORIGIN = "*";
const SOCKET_IO_CLIENT_ACCESS_CONTROL_ALLOW_METHODS = "GET,POST";

const MICROPHONE_BIT_RATE_SAMPLES = 8000;
const MICROPHONE_TIMESLICE = 1000;

const projectConstants = {
  API_URL,
  RESERVATION_URL,

  SOCKET_IO_CLIENT_NAMESPACE,
  SOCKET_IO_CLIENT_TRANSPORTS,
  SOCKET_IO_CLIENT_PATH,
  SOCKET_IO_CLIENT_RESULT_PATH,
  SOCKET_IO_CLIENT_REQUEST_PATH,
  SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET,
  SOCKET_IO_CLIENT_RESPONSE_FINAL_SPLIT_PACKET,
  SOCKET_IO_CLIENT_FRAME_OVERLAP,
  SOCKET_IO_CLIENT_BUFFER_OFFSET,
  SOCKET_IO_CLIENT_AUDIO_FORMAT,
  SOCKET_IO_CLIENT_SENDING_HEADERS,
  SOCKET_IO_CLIENT_ACCESS_CONTROL_ALLOW_ORIGIN,
  SOCKET_IO_CLIENT_ACCESS_CONTROL_ALLOW_METHODS,

  MICROPHONE_BIT_RATE_SAMPLES,
  MICROPHONE_TIMESLICE,
};

export default projectConstants;
