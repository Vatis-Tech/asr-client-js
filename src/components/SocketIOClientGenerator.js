import io from "socket.io-client";

import constants from "../helpers/constants/index.js";

const {
  SOCKET_IO_CLIENT_NAMESPACE,
  SOCKET_IO_CLIENT_PATH,
  SOCKET_IO_CLIENT_TRANSPORTS,
  SOCKET_IO_CLIENT_RESULT_PATH,
  SOCKET_IO_CLIENT_REQUEST_PATH,
  SOCKET_IO_CLIENT_FRAME_OVERLAP,
  SOCKET_IO_CLIENT_BUFFER_OFFSET,
  SOCKET_IO_CLIENT_AUDIO_FORMAT,
  SOCKET_IO_CLIENT_SENDING_HEADERS,

  MICROPHONE_FRAME_LENGTH,
  MICROPHONE_TIMESLICE,
} = constants;

class SocketIOClientGenerator {
  socketRef;
  streamHost;
  authToken;
  onConnectCallback;
  onAsrResultCallback;
  logger;
  destroyVTC;
  frameLength;
  frameOverlap;
  bufferOffset;
  errorHandler;
  constructor({
    onConnectCallback,
    onAsrResultCallback,
    logger,
    destroyVTC,
    frameLength,
    frameOverlap,
    bufferOffset,
    errorHandler,
  }) {
    this.errorHandler = errorHandler;

    this.logger = logger;

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Instantianting the "SocketIOClientGenerator" plugin.`,
      description: `@vatis-tech/asr-client-js: In this plugin, the connection between @vatis-tech/asr-client-js plugin and Vatis Tech LIVE ASR service is established. This plugin will send the data that is stored inside the MicrophoneQueue to the LIVE ASR service, and will receive the transcript for that data. And on the "onData" callback, will send the received transcript.`,
    });

    this.destroyVTC = destroyVTC;

    this.onConnectCallback = onConnectCallback;
    this.onAsrResultCallback = onAsrResultCallback;

    this.frameLength = frameLength;
    this.frameOverlap = frameOverlap;
    this.bufferOffset = bufferOffset;
  }
  init({ streamHost, authToken, streamUrl, reservationToken }) {
    this.logger({
      currentState: `@vatis-tech/asr-client-js: Initializing the "SocketIOClientGenerator" plugin.`,
      description: `@vatis-tech/asr-client-js: Here, the socket.io-client gets instantianted and initialized.`,
    });

    this.streamHost = streamHost;
    this.authToken = authToken;
    const streamHostStream = `${streamHost}${SOCKET_IO_CLIENT_NAMESPACE}`;
    this.socketRef = io(streamHostStream, {
      path: `${streamUrl}${SOCKET_IO_CLIENT_PATH}`,
      transports: SOCKET_IO_CLIENT_TRANSPORTS,
      namespace: SOCKET_IO_CLIENT_NAMESPACE,
      query: {
        Authorization: authToken,
        ReservationKey: reservationToken,
        FrameLength: this.frameLength
          ? this.frameLength
          : MICROPHONE_FRAME_LENGTH,
        FrameOverlap: this.frameOverlap
          ? this.frameOverlap
          : SOCKET_IO_CLIENT_FRAME_OVERLAP,
        BufferOffset: this.bufferOffset
          ? this.bufferOffset
          : SOCKET_IO_CLIENT_BUFFER_OFFSET,
        AudioFormat: SOCKET_IO_CLIENT_AUDIO_FORMAT,
        SendingHeaders: SOCKET_IO_CLIENT_SENDING_HEADERS,
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

      this.destroyVTC({ hard: true });
    });
    this.socketRef.on("connect_error", (error) => {
      this.logger({
        currentState: `@vatis-tech/asr-client-js: Could not initilize the "SocketIOClientGenerator" plugin.`,
        description: `@vatis-tech/asr-client-js: ` + error,
      });
      this.errorHandler(error);
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
  destroy() {
    this.socketRef.off("disconnect");
    this.socketRef.emit(SOCKET_IO_CLIENT_REQUEST_PATH, {
      close: "True",
      data: "",
    });
    this.socketRef.disconnect();
  }
}

export default SocketIOClientGenerator;
