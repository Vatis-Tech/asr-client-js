"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _ApiKeyGenerator = _interopRequireDefault(require("./components/ApiKeyGenerator.js"));
var _InstanceReservation = _interopRequireDefault(require("./components/InstanceReservation.js"));
var _SocketIOClientGenerator = _interopRequireDefault(require("./components/SocketIOClientGenerator.js"));
var _MicrophoneGenerator = _interopRequireDefault(require("./components/MicrophoneGenerator.js"));
var _MicrophoneQueue = _interopRequireDefault(require("./components/MicrophoneQueue.js"));
var _index = _interopRequireDefault(require("./helpers/constants/index.js"));
var _index2 = _interopRequireDefault(require("./helpers/functions/index.js"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var WAIT_AFTER_MESSAGES = _index["default"].WAIT_AFTER_MESSAGES,
  SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA = _index["default"].SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA,
  SOCKET_IO_SERVER_MESSAGE_TYPE_CONFIG_APPLIED = _index["default"].SOCKET_IO_SERVER_MESSAGE_TYPE_CONFIG_APPLIED,
  SOCKET_IO_CLIENT_RESPONSE_FINAL_FRAME = _index["default"].SOCKET_IO_CLIENT_RESPONSE_FINAL_FRAME,
  MICROPHONE_TIMESLICE = _index["default"].MICROPHONE_TIMESLICE;
var generateApiUrl = _index2["default"].generateApiUrl,
  checkIfFinalPacket = _index2["default"].checkIfFinalPacket,
  checkIfCommandPacket = _index2["default"].checkIfCommandPacket;
var VatisTechClient = /*#__PURE__*/function () {
  function VatisTechClient(_ref) {
    var service = _ref.service,
      model = _ref.model,
      language = _ref.language,
      apiKey = _ref.apiKey,
      onData = _ref.onData,
      onCommandData = _ref.onCommandData,
      log = _ref.log,
      logger = _ref.logger,
      onDestroyCallback = _ref.onDestroyCallback,
      host = _ref.host,
      microphoneTimeslice = _ref.microphoneTimeslice,
      frameLength = _ref.frameLength,
      frameOverlap = _ref.frameOverlap,
      bufferOffset = _ref.bufferOffset,
      errorHandler = _ref.errorHandler,
      waitingAfterMessages = _ref.waitingAfterMessages,
      config = _ref.config,
      onConfig = _ref.onConfig,
      onPartialData = _ref.onPartialData,
      onFinalData = _ref.onFinalData,
      EnableOnCommandFinalFrame = _ref.EnableOnCommandFinalFrame,
      connectionConfig = _ref.connectionConfig,
      microphoneDeviceId = _ref.microphoneDeviceId;
    (0, _classCallCheck2["default"])(this, VatisTechClient);
    (0, _defineProperty2["default"])(this, "blobCollectorChunks", void 0);
    (0, _defineProperty2["default"])(this, "microphoneGenerator", void 0);
    (0, _defineProperty2["default"])(this, "instanceReservation", void 0);
    (0, _defineProperty2["default"])(this, "apiKeyGenerator", void 0);
    (0, _defineProperty2["default"])(this, "socketIOClientGenerator", void 0);
    (0, _defineProperty2["default"])(this, "microphoneQueue", void 0);
    (0, _defineProperty2["default"])(this, "onData", void 0);
    (0, _defineProperty2["default"])(this, "onCommandData", void 0);
    (0, _defineProperty2["default"])(this, "waitingForFinalPacket", void 0);
    (0, _defineProperty2["default"])(this, "waitingAfterMessages", void 0);
    (0, _defineProperty2["default"])(this, "logger", void 0);
    (0, _defineProperty2["default"])(this, "log", void 0);
    (0, _defineProperty2["default"])(this, "shouldDestroy", void 0);
    (0, _defineProperty2["default"])(this, "onDestroyCallback", void 0);
    (0, _defineProperty2["default"])(this, "errorHandler", void 0);
    (0, _defineProperty2["default"])(this, "config", void 0);
    (0, _defineProperty2["default"])(this, "onConfig", void 0);
    (0, _defineProperty2["default"])(this, "onPartialData", void 0);
    (0, _defineProperty2["default"])(this, "onFinalData", void 0);
    (0, _defineProperty2["default"])(this, "EnableOnCommandFinalFrame", void 0);
    (0, _defineProperty2["default"])(this, "flushPacketWasSent", void 0);
    (0, _defineProperty2["default"])(this, "connectionConfig", void 0);
    (0, _defineProperty2["default"])(this, "microphoneTimeslice", void 0);
    (0, _defineProperty2["default"])(this, "microphoneDeviceId", void 0);
    this.blobCollectorChunks = [];
    this.microphoneDeviceId = microphoneDeviceId;
    if (microphoneTimeslice) {
      this.microphoneTimeslice = microphoneTimeslice;
    } else {
      this.microphoneTimeslice = MICROPHONE_TIMESLICE;
    }
    this.flushPacketWasSent = false;
    if (EnableOnCommandFinalFrame === true) {
      this.EnableOnCommandFinalFrame = true;
    } else {
      this.EnableOnCommandFinalFrame = false;
    }
    if (config) {
      this.config = config;
    } else {
      this.config = undefined;
    }
    if (errorHandler) {
      this.errorHandler = errorHandler;
    } else {
      this.errorHandler = function (e) {};
    }
    this.log = log;
    if (this.log === true && typeof logger === "function") {
      this.logger = logger;
    } else if (this.log === true) {
      this.logger = console.log;
    } else {
      this.logger = function () {};
    }
    this.logger({
      currentState: "@vatis-tech/asr-client-js: Initilizing plugin.",
      description: "@vatis-tech/asr-client-js: This is the base constructor which initilizez everything for the LIVE ASR service of Vatis Tech."
    });
    if (waitingAfterMessages && waitingAfterMessages > 0) {
      this.waitingAfterMessages = waitingAfterMessages;
    } else {
      this.waitingAfterMessages = WAIT_AFTER_MESSAGES;
    }

    // this is a flag that says if the whole response for the previous packet was received or not
    this.waitingForFinalPacket = 0;

    // this is a flag that says if the user wants to destroy the VTC client
    // but since there might be data to be received by the socket, or to be sent by the socket
    // the VTC client will wait for that to finis
    this.shouldDestroy = false;

    // callback when successfully destroyed
    if (onDestroyCallback === undefined) {
      this.onDestroyCallback = function () {};
    } else {
      this.onDestroyCallback = onDestroyCallback;
    }

    // callback for sending to the user the data that comes as a result from ASR SERVICE through the SocketIOClientGenerator
    if (onData === undefined) {
      this.onData = function () {};
    } else {
      this.onData = onData;
    }

    // callback for sending to the user the partial data that comes as a result from ASR SERVICE through the SocketIOClientGenerator
    if (onPartialData === undefined) {
      this.onPartialData = function () {};
    } else {
      this.onPartialData = onPartialData;
    }

    // callback for sending to the user the final data that comes as a result from ASR SERVICE through the SocketIOClientGenerator
    if (onFinalData === undefined) {
      this.onFinalData = function () {};
    } else {
      this.onFinalData = onFinalData;
    }

    // callback for sending to the user the data that comes as a result for a command from ASR SERVICE through the SocketIOClientGenerator
    // e.g. data.headers.SpokenCommand === 'NEW_PARAGRAPHS'
    if (onCommandData === undefined) {
      this.onCommandData = function () {};
    } else {
      this.onCommandData = onCommandData;
    }

    // callback for sending to the user the data that comes as a result for appling a config from ASR SERVICE through the SocketIOClientGenerator
    if (onConfig === undefined) {
      this.onConfig = function () {};
    } else {
      this.onConfig = onConfig;
    }

    // instantiante MicrophoneQueue - this will keep all the microphone buffers until they can be sent to the ASR SERVICE through the SocketIOClientGenerator
    this.microphoneQueue = new _MicrophoneQueue["default"]({
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler
    });

    // instantiante ApiKeyGenerator - this will return on the responseCallback the serviceHost and the authToken for the InstanceReservation to reserve a live asr instance based on the apiUrl and apiKey
    this.apiKeyGenerator = new _ApiKeyGenerator["default"]({
      apiUrl: generateApiUrl({
        service: service,
        model: model,
        language: language,
        host: host
      }),
      responseCallback: this.initInstanceReservation.bind(this),
      apiKey: apiKey,
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler,
      connectionConfig: connectionConfig
    });

    // instantiante InstanceReservation - this will return on the responseCallback the streamUrl, reservationToken, and podName for the SocketIOClientGenerator to connect based on the serviceHost and authToken
    this.instanceReservation = new _InstanceReservation["default"]({
      responseCallback: this.initSocketIOClient.bind(this),
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler
    });

    // instantiante SocketIOClientGenerator - this will return on the onAsrResultCallback the results that it gets back from the ASR SERVICE and when it connects to the ASR SERVICE it will initilize the MicrophoneGenerator through the onConnectCallback
    this.socketIOClientGenerator = new _SocketIOClientGenerator["default"]({
      onConnectCallback: this.initMicrophone.bind(this),
      onAsrResultCallback: this.onSocketIOClientGeneratorOnAsrResultCallback.bind(this),
      logger: this.logger.bind(this),
      destroyVTC: this.destroy.bind(this),
      errorHandler: this.errorHandler,
      config: this.config,
      frameLength: frameLength,
      frameOverlap: frameOverlap,
      bufferOffset: bufferOffset,
      EnableOnCommandFinalFrame: EnableOnCommandFinalFrame
    });

    // instantiante MicrophoneGenerator - this will return on the this.onMicrophoneGeneratorDataCallback the data that it captures from the user's microphone
    this.microphoneGenerator = new _MicrophoneGenerator["default"]({
      onDataCallback: this.onMicrophoneGeneratorDataCallback.bind(this),
      onBlobDataCallback: this.onBlobDataCallback.bind(this),
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler,
      microphoneTimeslice: microphoneTimeslice,
      microphoneDeviceId: microphoneDeviceId
    });

    // initilize ApiKeyGenerator (if successful it will initilize SocketIOClientGenerator (if successful it will initilize the MicrophoneGenerator))
    this.initApiKey();
  }

  // this will make everything undefined on the this instance - i.e. this instance will not be of any use anymore
  (0, _createClass2["default"])(VatisTechClient, [{
    key: "destroy",
    value: function destroy() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
          hard: false
        },
        hard = _ref2.hard;
      // stop the microphone - i.e. stop data being recorded by the MediaRecorder
      this.microphoneGenerator.destroy();
      if (hard) {
        // notify destruction
        this.onDestroyCallback();

        // destroy the socket
        this.socketIOClientGenerator.destroy();

        // delete data members
        this.microphoneGenerator = undefined;
        this.apiKeyGenerator = undefined;
        this.instanceReservation = undefined;
        this.socketIOClientGenerator = undefined;
        this.microphoneQueue = undefined;
        this.onData = undefined;
        this.onCommandData = undefined;
        this.waitingForFinalPacket = undefined;
        this.logger = undefined;
        this.log = undefined;
        this.shouldDestroy = undefined;

        // delete methods
        this.initApiKey = false;
        this.initSocketIOClient = false;
        this.initMicrophone = false;
        this.onMicrophoneGeneratorDataCallback = false;
        this.onSocketIOClientGeneratorOnAsrResultCallback = false;
        this.onDestroyCallback = false;
      } else {
        // let the messaging know that we want the client to be destroyed
        this.shouldDestroy = true;
        setTimeout(function () {
          this.socketIOClientGenerator.emitData({
            type: SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA,
            data: "",
            flush: "True",
            close: "True"
          });
          this.flushPacketWasSent = true;
          if (this.waitingForFinalPacket < 0) {
            this.waitingForFinalPacket = 1;
          } else {
            this.waitingForFinalPacket = this.waitingForFinalPacket + 1;
          }
        }.bind(this), this.microphoneTimeslice + 100);
      }
    }

    // lets the user pause recording
  }, {
    key: "pause",
    value: function pause() {
      this.microphoneGenerator.pause();
    }

    // lets the user resume recording
  }, {
    key: "resume",
    value: function resume() {
      this.microphoneGenerator.resume();
    }

    // initilize ApiKeyGenerator
    // this is called after the instantiantion of all Generators
  }, {
    key: "initApiKey",
    value: function initApiKey() {
      this.apiKeyGenerator.init();
    }

    // initilize InstanceReservation
    // get a reserved link for socket.io-client
  }, {
    key: "initInstanceReservation",
    value: function initInstanceReservation(_ref3) {
      var serviceHost = _ref3.serviceHost,
        authToken = _ref3.authToken,
        useSameServiceHostOnWsConnection = _ref3.useSameServiceHostOnWsConnection;
      this.instanceReservation.init({
        serviceHost: serviceHost,
        authToken: authToken,
        useSameServiceHostOnWsConnection: useSameServiceHostOnWsConnection
      });
    }

    // initilize SocketIOClientGenerator
    // connect to the ASR SERVICE based on the serviceHost and authToken of ApiKeyGenerator
    // this is called as a callback after the successful initialization of the ApiKeyGenerator
  }, {
    key: "initSocketIOClient",
    value: function initSocketIOClient(_ref4) {
      var streamHost = _ref4.streamHost,
        streamUrl = _ref4.streamUrl,
        reservationToken = _ref4.reservationToken,
        authToken = _ref4.authToken;
      this.socketIOClientGenerator.init({
        streamHost: streamHost,
        streamUrl: streamUrl,
        reservationToken: reservationToken,
        authToken: authToken
      });
    }

    // initilize MicrophoneGenerator
    // it will ask for user's microphone, and when the user gives permission for the microphone usage, it will start sending the data that it records using the this.onMicrophoneGeneratorDataCallback
    // this is called as a callback after the successful initialization of the SocketIOClientGenerator
  }, {
    key: "initMicrophone",
    value: function initMicrophone() {
      var _this = this;
      this.microphoneGenerator.init().then(function () {})["catch"](function (err) {
        _this.logger({
          currentState: "@vatis-tech/asr-client-js: Could not initilize the \"MicrophoneGenerator\" plugin.",
          description: "@vatis-tech/asr-client-js: " + err
        });
        _this.errorHandler(err);
      });
    }

    // get data from MicrophoneGenerator and add it to the queue
    // if the SocketIOClientGenerator is not waiting for a packet response then it should emit a new pachet with the data that is waiting in the queue
  }, {
    key: "onMicrophoneGeneratorDataCallback",
    value: function onMicrophoneGeneratorDataCallback(data) {
      if (this.microphoneQueue === undefined) return;
      this.microphoneQueue.enqueue(data);
      if (this.waitingForFinalPacket < this.waitingAfterMessages && this.microphoneQueue.peek()) {
        if (this.microphoneQueue.peek().type === SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA) {
          this.waitingForFinalPacket = this.waitingForFinalPacket + 1;
        }
        this.socketIOClientGenerator.emitData(this.microphoneQueue.dequeue());
      }
    }

    // get data from SocketIOClientGenerator from the SOCKET_IO_CLIENT_RESULT_PATH and send it to user's callback function
    // if the data was final, and the MicrophoneQueue was not empty, send a new data to the ASR SERVICE through the SocketIOClientGenerator
    // if the data was final, and the MicrophoneQueue was empty, let the MicrophoneGenerator know that, when it gets new data, it can send it to the ASR SERVICE through the SocketIOClientGenerator
  }, {
    key: "onSocketIOClientGeneratorOnAsrResultCallback",
    value: function onSocketIOClientGeneratorOnAsrResultCallback(data) {
      var parsedData = JSON.parse(data);
      if (parsedData.type === SOCKET_IO_SERVER_MESSAGE_TYPE_CONFIG_APPLIED) {
        this.onConfig(parsedData);
        return;
      }
      this.onData(parsedData);
      if (checkIfCommandPacket(parsedData)) {
        this.onCommandData(_objectSpread({
          spokenCommand: parsedData.headers.SpokenCommand
        }, parsedData));
      }
      if (parsedData.headers.hasOwnProperty(SOCKET_IO_CLIENT_RESPONSE_FINAL_FRAME) && parsedData.headers[SOCKET_IO_CLIENT_RESPONSE_FINAL_FRAME]) {
        if (parsedData.words && parsedData.words.length) {
          this.onFinalData(parsedData);
        }
      } else {
        this.onPartialData(parsedData);
      }
      if (checkIfFinalPacket(parsedData)) {
        this.waitingForFinalPacket = this.waitingForFinalPacket - 1;
        if (this.microphoneQueue.peek() && this.waitingForFinalPacket < this.waitingAfterMessages) {
          if (this.microphoneQueue.peek().type === SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA) {
            this.waitingForFinalPacket = this.waitingForFinalPacket + 1;
          }
          this.socketIOClientGenerator.emitData(this.microphoneQueue.dequeue());
        }
      }

      // check if the user tried to destroy the VTC client
      if (this.waitingForFinalPacket === 0 && this.microphoneQueue.isEmpty && this.shouldDestroy && this.flushPacketWasSent) {
        this.destroy({
          hard: true
        });
      }
    }

    // this function collects all blob recorded from user's microphone so you can download the recording
  }, {
    key: "onBlobDataCallback",
    value: function onBlobDataCallback(blobData) {
      this.blobCollectorChunks.push(blobData);
    }

    // this function actually downloads the recording
  }, {
    key: "onDownloadRecording",
    value: function onDownloadRecording() {
      try {
        var audioBlob = new Blob(this.blobCollectorChunks, {
          "type": "audio/webm"
        });
        var audioUrl = URL.createObjectURL(audioBlob);
        var anchor = document.createElement("a");
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.href = audioUrl;
        anchor.download = "audio.webm";
        anchor.click();
        window.URL.revokeObjectURL(audioUrl);
        anchor === null || anchor === void 0 ? void 0 : anchor.remove();
      } catch (error) {
        console.error(error);
      }
    }

    // this function returns for the user the recording as blob chunks
  }, {
    key: "getRecordingAsBlobChunks",
    value: function getRecordingAsBlobChunks() {
      return this.blobCollectorChunks;
    }
  }]);
  return VatisTechClient;
}();
var _default = exports["default"] = VatisTechClient;