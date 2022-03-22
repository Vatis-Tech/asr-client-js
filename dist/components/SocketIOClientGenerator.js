"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _socket = _interopRequireDefault(require("socket.io-client"));

var _index = _interopRequireDefault(require("../helpers/constants/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SOCKET_IO_CLIENT_NAMESPACE = _index["default"].SOCKET_IO_CLIENT_NAMESPACE,
    SOCKET_IO_CLIENT_PATH = _index["default"].SOCKET_IO_CLIENT_PATH,
    SOCKET_IO_CLIENT_TRANSPORTS = _index["default"].SOCKET_IO_CLIENT_TRANSPORTS,
    SOCKET_IO_CLIENT_RESULT_PATH = _index["default"].SOCKET_IO_CLIENT_RESULT_PATH,
    SOCKET_IO_CLIENT_REQUEST_PATH = _index["default"].SOCKET_IO_CLIENT_REQUEST_PATH,
    SOCKET_IO_CLIENT_FRAME_OVERLAP = _index["default"].SOCKET_IO_CLIENT_FRAME_OVERLAP,
    SOCKET_IO_CLIENT_BUFFER_OFFSET = _index["default"].SOCKET_IO_CLIENT_BUFFER_OFFSET,
    SOCKET_IO_CLIENT_AUDIO_FORMAT = _index["default"].SOCKET_IO_CLIENT_AUDIO_FORMAT,
    SOCKET_IO_CLIENT_SENDING_HEADERS = _index["default"].SOCKET_IO_CLIENT_SENDING_HEADERS,
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
        bufferOffset = _ref.bufferOffset;

    _classCallCheck(this, SocketIOClientGenerator);

    _defineProperty(this, "socketRef", void 0);

    _defineProperty(this, "streamHost", void 0);

    _defineProperty(this, "authToken", void 0);

    _defineProperty(this, "onConnectCallback", void 0);

    _defineProperty(this, "onAsrResultCallback", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "destroyVTC", void 0);

    _defineProperty(this, "frameLength", void 0);

    _defineProperty(this, "frameOverlap", void 0);

    _defineProperty(this, "bufferOffset", void 0);

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
  }

  _createClass(SocketIOClientGenerator, [{
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
          SendingHeaders: SOCKET_IO_CLIENT_SENDING_HEADERS
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
        var errorMessage = 'Could not initilize the "socket.io-client" with error: ' + error;
        console.error(errorMessage);
        throw errorMessage;
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
      this.socketRef.emit(SOCKET_IO_CLIENT_REQUEST_PATH, {
        data: data
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.socketRef.off("disconnect");
      this.socketRef.disconnect();
    }
  }]);

  return SocketIOClientGenerator;
}();

var _default = SocketIOClientGenerator;
exports["default"] = _default;