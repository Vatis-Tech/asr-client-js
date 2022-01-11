import io from "socket.io-client";

import constants from "../helpers/constants/index.js";

const {
  SOCKET_IO_CLIENT_NAMESPACE,
  SOCKET_IO_CLIENT_PATH,
  SOCKET_IO_CLIENT_TRANSPORTS,
  SOCKET_IO_CLIENT_RESULT_PATH,
  SOCKET_IO_CLIENT_REQUEST_PATH,
} = constants;

class SocketIOClientGenerator {
  socketRef;
  serviceHost;
  authToken;
  onConnectCallback;
  onAsrResultCallback;
  constructor({ onConnectCallback, onAsrResultCallback }) {
    this.onConnectCallback = onConnectCallback;
    this.onAsrResultCallback = onAsrResultCallback;
  }
  init({ serviceHost, authToken }) {
    this.serviceHost = serviceHost;
    this.authToken = authToken;
    const serviceHostStream = `${serviceHost}${SOCKET_IO_CLIENT_NAMESPACE}`;
    this.socketRef = io(serviceHostStream, {
      path: SOCKET_IO_CLIENT_PATH,
      transports: SOCKET_IO_CLIENT_TRANSPORTS,
      namespace: SOCKET_IO_CLIENT_NAMESPACE,
      extraHeaders: {
        Authorization: authToken,
        FrameLength: 1,
        FrameOverlap: 0.5,
        BufferOffset: 0.5,
      },
    });
    this.socketRef.on("connect", () => {
      this.onConnectCallback();
    });
    this.socketRef.on("connect_error", (error) => {
      const errorMessage =
        'Could not initilize the "socket.io-client" with error: ' + error;
      console.error(errorMessage);
      throw errorMessage;
    });
    this.socketRef.on(SOCKET_IO_CLIENT_RESULT_PATH, (args) => {
      this.onAsrResultCallback(args);
    });
    // TODO: add some callbacks for all states
    // NOTE: this would be usefull for end users to know the state of
    // NOTE: the Vatis Tech Client plugin
    // NOTE: Something like, states of the key, then states of the socket
    // NOTE: then states of the microphone
    // this.socketRef.on("reconnect_attempt", () => {
    //   console.log("reconnect_attempt");
    // });
    // this.socketRef.on("reconnect", () => {
    //   console.log("reconnect");
    // });
  }
  emitData(data) {
    this.socketRef.emit(SOCKET_IO_CLIENT_REQUEST_PATH, {
      data,
    });
  }
}

export default SocketIOClientGenerator;
