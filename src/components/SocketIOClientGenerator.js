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
  logger;
  destroy;
  constructor({ onConnectCallback, onAsrResultCallback, logger, destroy }) {
    this.logger = logger;

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Instantianting the "SocketIOClientGenerator" plugin.`,
      description: `@vatis-tech/asr-client-js: In this plugin, the connection between @vatis-tech/asr-client-js plugin and Vatis Tech LIVE ASR service is established. This plugin will send the data that is stored inside the MicrophoneQueue to the LIVE ASR service, and will receive the transcript for that data. And on the "onData" callback, will send the received transcript.`,
    });

    this.destroy = destroy;

    this.onConnectCallback = onConnectCallback;
    this.onAsrResultCallback = onAsrResultCallback;
  }
  init({ serviceHost, authToken }) {
    this.logger({
      currentState: `@vatis-tech/asr-client-js: Initializing the "SocketIOClientGenerator" plugin.`,
      description: `@vatis-tech/asr-client-js: Here, the socket.io-client gets instantianted and initialized.`,
    });

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
      this.logger({
        currentState: `@vatis-tech/asr-client-js: Initialized the "SocketIOClientGenerator" plugin.`,
        description: `@vatis-tech/asr-client-js: A successful connection between @vatis-tech/asr-client-js and Vatis Tech LIVE ASR service has been established.`,
      });

      this.onConnectCallback();
    });
    this.socketRef.on("disconnect", () => {
      this.logger({
        currentState: `@vatis-tech/asr-client-js: Destroy the "SocketIOClientGenerator" plugin.`,
        description: `@vatis-tech/asr-client-js: The connection between @vatis-tech/asr-client-js and Vatis Tech LIVE ASR service has been closed by the Vatis Tech LIVE ASR service.`,
      });

      this.destroy();
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
