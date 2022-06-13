"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _socket = _interopRequireDefault(require("socket.io-client"));

var _index = _interopRequireDefault(require("../helpers/constants/index.js"));

var SOCKET_IO_CLIENT_NAMESPACE = _index["default"].SOCKET_IO_CLIENT_NAMESPACE,
    SOCKET_IO_CLIENT_PATH = _index["default"].SOCKET_IO_CLIENT_PATH,
    SOCKET_IO_CLIENT_TRANSPORTS = _index["default"].SOCKET_IO_CLIENT_TRANSPORTS,
    SOCKET_IO_CLIENT_RESULT_PATH = _index["default"].SOCKET_IO_CLIENT_RESULT_PATH,
    SOCKET_IO_CLIENT_REQUEST_PATH = _index["default"].SOCKET_IO_CLIENT_REQUEST_PATH,
    SOCKET_IO_CLIENT_FRAME_OVERLAP = _index["default"].SOCKET_IO_CLIENT_FRAME_OVERLAP,
    SOCKET_IO_CLIENT_BUFFER_OFFSET = _index["default"].SOCKET_IO_CLIENT_BUFFER_OFFSET,
    SOCKET_IO_CLIENT_AUDIO_FORMAT = _index["default"].SOCKET_IO_CLIENT_AUDIO_FORMAT,
    SOCKET_IO_CLIENT_SENDING_HEADERS = _index["default"].SOCKET_IO_CLIENT_SENDING_HEADERS,
    SOCKET_IO_CLIENT_DISABLE_DISFLUENCIES = _index["default"].SOCKET_IO_CLIENT_DISABLE_DISFLUENCIES,
    SOCKET_IO_CLIENT_ENABLE_PUNCTUATION_CAPITALIZATION = _index["default"].SOCKET_IO_CLIENT_ENABLE_PUNCTUATION_CAPITALIZATION,
    SOCKET_IO_CLIENT_ENABLE_ENTITIES_RECOGNITION = _index["default"].SOCKET_IO_CLIENT_ENABLE_ENTITIES_RECOGNITION,
    SOCKET_IO_CLIENT_ENABLE_NUMERALS_CONVERSION = _index["default"].SOCKET_IO_CLIENT_ENABLE_NUMERALS_CONVERSION,
    MICROPHONE_FRAME_LENGTH = _index["default"].MICROPHONE_FRAME_LENGTH,
    MICROPHONE_TIMESLICE = _index["default"].MICROPHONE_TIMESLICE;

var SocketIOClientGenerator = /*#__PURE__*/function () {
  function SocketIOClientGenerator(_ref) {
    var onConnectCallback = _ref.onConnectCallback,
        onAsrResultCallback = _ref.onAsrResultCallback,
        logger = _ref.logger,
        destroyVTC = _ref.destroyVTC,
        frameLength = _ref.frameLength,
        frameOverlap = _ref.frameOverlap,
        bufferOffset = _ref.bufferOffset,
        errorHandler = _ref.errorHandler;
    (0, _classCallCheck2["default"])(this, SocketIOClientGenerator);
    (0, _defineProperty2["default"])(this, "socketRef", void 0);
    (0, _defineProperty2["default"])(this, "streamHost", void 0);
    (0, _defineProperty2["default"])(this, "authToken", void 0);
    (0, _defineProperty2["default"])(this, "onConnectCallback", void 0);
    (0, _defineProperty2["default"])(this, "onAsrResultCallback", void 0);
    (0, _defineProperty2["default"])(this, "logger", void 0);
    (0, _defineProperty2["default"])(this, "destroyVTC", void 0);
    (0, _defineProperty2["default"])(this, "frameLength", void 0);
    (0, _defineProperty2["default"])(this, "frameOverlap", void 0);
    (0, _defineProperty2["default"])(this, "bufferOffset", void 0);
    (0, _defineProperty2["default"])(this, "errorHandler", void 0);
    (0, _defineProperty2["default"])(this, "sendClosePacket", void 0);
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.logger({
      currentState: "@vatis-tech/asr-client-js: Instantianting the \"SocketIOClientGenerator\" plugin.",
      description: "@vatis-tech/asr-client-js: In this plugin, the connection between @vatis-tech/asr-client-js plugin and Vatis Tech LIVE ASR service is established. This plugin will send the data that is stored inside the MicrophoneQueue to the LIVE ASR service, and will receive the transcript for that data. And on the \"onData\" callback, will send the received transcript."
    });
    this.destroyVTC = destroyVTC;
    this.onConnectCallback = onConnectCallback;
    this.onAsrResultCallback = onAsrResultCallback;
    this.frameLength = frameLength;
    this.frameOverlap = frameOverlap;
    this.bufferOffset = bufferOffset;
    this.sendClosePacket = true;
  }

  (0, _createClass2["default"])(SocketIOClientGenerator, [{
    key: "init",
    value: function init(_ref2) {
      var _this = this;

      var streamHost = _ref2.streamHost,
          authToken = _ref2.authToken,
          streamUrl = _ref2.streamUrl,
          reservationToken = _ref2.reservationToken;
      this.logger({
        currentState: "@vatis-tech/asr-client-js: Initializing the \"SocketIOClientGenerator\" plugin.",
        description: "@vatis-tech/asr-client-js: Here, the socket.io-client gets instantianted and initialized."
      });
      this.streamHost = streamHost;
      this.authToken = authToken;
      var streamHostStream = "".concat(streamHost).concat(SOCKET_IO_CLIENT_NAMESPACE);
      this.socketRef = (0, _socket["default"])(streamHostStream, {
        path: "".concat(streamUrl).concat(SOCKET_IO_CLIENT_PATH),
        transports: SOCKET_IO_CLIENT_TRANSPORTS,
        namespace: SOCKET_IO_CLIENT_NAMESPACE,
        query: {
          Authorization: authToken,
          ReservationKey: reservationToken,
          FrameLength: this.frameLength ? this.frameLength : MICROPHONE_FRAME_LENGTH,
          FrameOverlap: this.frameOverlap ? this.frameOverlap : SOCKET_IO_CLIENT_FRAME_OVERLAP,
          BufferOffset: this.bufferOffset ? this.bufferOffset : SOCKET_IO_CLIENT_BUFFER_OFFSET,
          AudioFormat: SOCKET_IO_CLIENT_AUDIO_FORMAT,
          SendingHeaders: SOCKET_IO_CLIENT_SENDING_HEADERS,
          DisableDisfluencies: SOCKET_IO_CLIENT_DISABLE_DISFLUENCIES,
          EnablePunctuationCapitalization: SOCKET_IO_CLIENT_ENABLE_PUNCTUATION_CAPITALIZATION,
          EnableEntitiesRecognition: SOCKET_IO_CLIENT_ENABLE_ENTITIES_RECOGNITION,
          EnableNumeralsConversion: SOCKET_IO_CLIENT_ENABLE_NUMERALS_CONVERSION
        }
      });
      this.socketRef.on("connect", function () {
        _this.logger({
          currentState: "@vatis-tech/asr-client-js: Initialized the \"SocketIOClientGenerator\" plugin.",
          description: "@vatis-tech/asr-client-js: A successful connection between @vatis-tech/asr-client-js and Vatis Tech LIVE ASR service has been established."
        });

        _this.onConnectCallback();
      });
      this.socketRef.on("disconnect", function () {
        _this.logger({
          currentState: "@vatis-tech/asr-client-js: Destroy the \"SocketIOClientGenerator\" plugin.",
          description: "@vatis-tech/asr-client-js: The connection between @vatis-tech/asr-client-js and Vatis Tech LIVE ASR service has been closed by the Vatis Tech LIVE ASR service."
        });

        _this.destroyVTC({
          hard: true
        });
      });
      this.socketRef.on("connect_error", function (error) {
        _this.logger({
          currentState: "@vatis-tech/asr-client-js: Could not initilize the \"SocketIOClientGenerator\" plugin.",
          description: "@vatis-tech/asr-client-js: " + error
        });

        _this.errorHandler(error);
      });
      this.socketRef.on(SOCKET_IO_CLIENT_RESULT_PATH, function (args) {
        _this.onAsrResultCallback(args);
      }); // TODO: add some callbacks for all states
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
  }, {
    key: "emitData",
    value: function emitData(data) {
      if (data.close === "True" || data.flush === "True") {
        this.sendClosePacket = false;
      }

      this.socketRef.emit(SOCKET_IO_CLIENT_REQUEST_PATH, data);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.socketRef.off("disconnect");

      if (this.sendClosePacket) {
        this.socketRef.emit(SOCKET_IO_CLIENT_REQUEST_PATH, {
          close: "True",
          data: ""
        });
      }

      this.socketRef.disconnect();
    }
  }]);
  return SocketIOClientGenerator;
}();

var _default = SocketIOClientGenerator;
exports["default"] = _default;