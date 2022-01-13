const API_URL =
  "https://vatis.tech/api/v1/asr-client/auth?service=<service>&model=<model>&language=<language>";

const SOCKET_IO_CLIENT_NAMESPACE = "/asr_stream";
const SOCKET_IO_CLIENT_TRANSPORTS = ["polling", "websocket"];
const SOCKET_IO_CLIENT_PATH = "/asr/v1/live/transcribe/socket.io";
const SOCKET_IO_CLIENT_RESULT_PATH = "/asr_result";
const SOCKET_IO_CLIENT_REQUEST_PATH = "/asr_request";
const SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET = "SplitPacket";
const SOCKET_IO_CLIENT_RESPONSE_FINAL_SPLIT_PACKET = "FinalSplitPacket";

const projectConstants = {
  API_URL,
  SOCKET_IO_CLIENT_NAMESPACE,
  SOCKET_IO_CLIENT_TRANSPORTS,
  SOCKET_IO_CLIENT_PATH,
  SOCKET_IO_CLIENT_RESULT_PATH,
  SOCKET_IO_CLIENT_REQUEST_PATH,
};

export default projectConstants;
