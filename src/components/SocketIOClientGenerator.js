import io from "socket.io-client";

class SocketIOClientGenerator {
  socketRef;
  constructor({
    serviceHost,
    authToken,
    onConnectCallback,
    onAsrResultCallback,
  }) {
    const serviceHost = `${serviceHost}/asr_stream`;
    this.socketRef = io(serviceHost, {
      path: "/live/ro_RO/transcribe/socket.io",
      transports: ["polling", "websocket"],
      namespace: "/asr_stream",
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
    this.socketRef.on("connect_error", (error) => {
      const errorMessage =
        'Could not initilize the "socket.io-client" with error: ' + error;
      console.error(errorMessage);
      throw errorMessage;
    });
    this.socketRef.on("/asr_result", (args) => {
      this.onAsrResultCallback(args);
    });
  }
}

export default SocketIOClientGenerator;
