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
    MICROPHONE_TIMESLICE = _index["default"].MICROPHONE_TIMESLICE;

var SocketIOClientGenerator = /*#__PURE__*/function () {
  function SocketIOClientGenerator(_ref) {
    var onConnectCallback = _ref.onConnectCallback,
        onAsrResultCallback = _ref.onAsrResultCallback,
        logger = _ref.logger,
        destroy = _ref.destroy;

    _classCallCheck(this, SocketIOClientGenerator);

    _defineProperty(this, "socketRef", void 0);

    _defineProperty(this, "serviceHost", void 0);

    _defineProperty(this, "authToken", void 0);

    _defineProperty(this, "onConnectCallback", void 0);

    _defineProperty(this, "onAsrResultCallback", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "destroy", void 0);

    this.logger = logger;
    this.logger({
      currentState: "@vatis-tech/asr-client-js: Instantianting the \"SocketIOClientGenerator\" plugin.",
      description: "@vatis-tech/asr-client-js: In this plugin, the connection between @vatis-tech/asr-client-js plugin and Vatis Tech LIVE ASR service is established. This plugin will send the data that is stored inside the MicrophoneQueue to the LIVE ASR service, and will receive the transcript for that data. And on the \"onData\" callback, will send the received transcript."
    });
    this.destroy = destroy;
    this.onConnectCallback = onConnectCallback;
    this.onAsrResultCallback = onAsrResultCallback;
  }

  _createClass(SocketIOClientGenerator, [{
    key: "init",
    value: function init(_ref2) {
      var _this = this;

      var serviceHost = _ref2.serviceHost,
          authToken = _ref2.authToken;
      this.logger({
        currentState: "@vatis-tech/asr-client-js: Initializing the \"SocketIOClientGenerator\" plugin.",
        description: "@vatis-tech/asr-client-js: Here, the socket.io-client gets instantianted and initialized."
      });
      this.serviceHost = serviceHost;
      this.authToken = authToken;
      var serviceHostStream = "".concat(serviceHost).concat(SOCKET_IO_CLIENT_NAMESPACE);
      this.socketRef = (0, _socket["default"])(serviceHostStream, {
        path: SOCKET_IO_CLIENT_PATH,
        transports: SOCKET_IO_CLIENT_TRANSPORTS,
        namespace: SOCKET_IO_CLIENT_NAMESPACE,
        extraHeaders: {
          Authorization: authToken,
          FrameLength: MICROPHONE_TIMESLICE / 1000,
          FrameOverlap: 0.5,
          BufferOffset: 0.5
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

        _this.destroy();
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
  }]);

  return SocketIOClientGenerator;
}();

var _default = SocketIOClientGenerator;
exports["default"] = _default;