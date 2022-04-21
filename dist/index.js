"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiKeyGenerator = _interopRequireDefault(require("./components/ApiKeyGenerator.js"));

var _InstanceReservation = _interopRequireDefault(require("./components/InstanceReservation.js"));

var _SocketIOClientGenerator = _interopRequireDefault(require("./components/SocketIOClientGenerator.js"));

var _MicrophoneGenerator = _interopRequireDefault(require("./components/MicrophoneGenerator.js"));

var _MicrophoneQueue = _interopRequireDefault(require("./components/MicrophoneQueue.js"));

var _index = _interopRequireDefault(require("./helpers/constants/index.js"));

var _index2 = _interopRequireDefault(require("./helpers/functions/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var WAIT_AFTER_MESSAGES = _index["default"].WAIT_AFTER_MESSAGES;
var generateApiUrl = _index2["default"].generateApiUrl,
    checkIfFinalPacket = _index2["default"].checkIfFinalPacket;

var VatisTechClient = /*#__PURE__*/function () {
  function VatisTechClient(_ref) {
    var service = _ref.service,
        model = _ref.model,
        language = _ref.language,
        apiKey = _ref.apiKey,
        onData = _ref.onData,
        log = _ref.log,
        logger = _ref.logger,
        onDestroyCallback = _ref.onDestroyCallback,
        host = _ref.host,
        microphoneTimeslice = _ref.microphoneTimeslice,
        frameLength = _ref.frameLength,
        frameOverlap = _ref.frameOverlap,
        bufferOffset = _ref.bufferOffset,
        errorHandler = _ref.errorHandler,
        waitingAfterMessages = _ref.waitingAfterMessages;

    _classCallCheck(this, VatisTechClient);

    _defineProperty(this, "microphoneGenerator", void 0);

    _defineProperty(this, "instanceReservation", void 0);

    _defineProperty(this, "apiKeyGenerator", void 0);

    _defineProperty(this, "socketIOClientGenerator", void 0);

    _defineProperty(this, "microphoneQueue", void 0);

    _defineProperty(this, "onData", void 0);

    _defineProperty(this, "waitingForFinalPacket", void 0);

    _defineProperty(this, "waitingAfterMessages", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "shouldDestroy", void 0);

    _defineProperty(this, "onDestroyCallback", void 0);

    _defineProperty(this, "errorHandler", void 0);

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
    } // this is a flag that says if the whole response for the previous packet was received or not


    this.waitingForFinalPacket = 0; // this is a flag that says if the user wants to destroy the VTC client
    // but since there might be data to be received by the socket, or to be sent by the socket
    // the VTC client will wait for that to finis

    this.shouldDestroy = false; // callback when successfully destroyed

    if (onDestroyCallback === undefined) {
      this.onDestroyCallback = function () {};
    } else {
      this.onDestroyCallback = onDestroyCallback;
    } // callback for sending to the user the data that comes as a result from ASR SERVICE through the SocketIOClientGenerator


    if (onData === undefined) {
      this.onData = function () {};
    } else {
      this.onData = onData;
    } // instantiante MicrophoneQueue - this will keep all the microphone buffers until they can be sent to the ASR SERVICE through the SocketIOClientGenerator


    this.microphoneQueue = new _MicrophoneQueue["default"]({
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler
    }); // instantiante ApiKeyGenerator - this will return on the responseCallback the serviceHost and the authToken for the InstanceReservation to reserve a live asr instance based on the apiUrl and apiKey

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
      errorHandler: this.errorHandler
    }); // instantiante InstanceReservation - this will return on the responseCallback the streamUrl, reservationToken, and podName for the SocketIOClientGenerator to connect based on the serviceHost and authToken

    this.instanceReservation = new _InstanceReservation["default"]({
      responseCallback: this.initSocketIOClient.bind(this),
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler
    }); // instantiante SocketIOClientGenerator - this will return on the onAsrResultCallback the results that it gets back from the ASR SERVICE and when it connects to the ASR SERVICE it will initilize the MicrophoneGenerator through the onConnectCallback

    this.socketIOClientGenerator = new _SocketIOClientGenerator["default"]({
      onConnectCallback: this.initMicrophone.bind(this),
      onAsrResultCallback: this.onSocketIOClientGeneratorOnAsrResultCallback.bind(this),
      logger: this.logger.bind(this),
      destroyVTC: this.destroy.bind(this),
      errorHandler: this.errorHandler,
      frameLength: frameLength,
      frameOverlap: frameOverlap,
      bufferOffset: bufferOffset
    }); // instantiante MicrophoneGenerator - this will return on the this.onMicrophoneGeneratorDataCallback the data that it captures from the user's microphone

    this.microphoneGenerator = new _MicrophoneGenerator["default"]({
      onDataCallback: this.onMicrophoneGeneratorDataCallback.bind(this),
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler,
      microphoneTimeslice: microphoneTimeslice
    }); // initilize ApiKeyGenerator (if successful it will initilize SocketIOClientGenerator (if successful it will initilize the MicrophoneGenerator))

    this.initApiKey();
  } // this will make everything undefined on the this instance - i.e. this instance will not be of any use anymore


  _createClass(VatisTechClient, [{
    key: "destroy",
    value: function destroy() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        hard: false
      },
          hard = _ref2.hard;

      // check if there is still data to be received or to be sent
      if ((this.waitingForFinalPacket > 0 || !this.microphoneQueue.isEmpty) && hard !== true) {
        // let the messaging know that we want the client to be destroyed
        this.shouldDestroy = true; // pause the microphone so it won't record anymore

        this.microphoneGenerator.pause();
      } else {
        // notify destruction
        this.onDestroyCallback(); // stop the microphone - i.e. stop data being recorded by the MediaRecorder

        this.microphoneGenerator.destroy(); // destroy the socket

        this.socketIOClientGenerator.destroy(); // delete data members

        this.microphoneGenerator = undefined;
        this.apiKeyGenerator = undefined;
        this.instanceReservation = undefined;
        this.socketIOClientGenerator = undefined;
        this.microphoneQueue = undefined;
        this.onData = undefined;
        this.waitingForFinalPacket = undefined;
        this.logger = undefined;
        this.log = undefined;
        this.shouldDestroy = undefined; // delete methods

        this.initApiKey = false;
        this.initSocketIOClient = false;
        this.initMicrophone = false;
        this.onMicrophoneGeneratorDataCallback = false;
        this.onSocketIOClientGeneratorOnAsrResultCallback = false;
        this.onDestroyCallback = false;
      }
    } // lets the user pause recording

  }, {
    key: "pause",
    value: function pause() {
      this.microphoneGenerator.pause();
    } // lets the user resume recording

  }, {
    key: "resume",
    value: function resume() {
      this.microphoneGenerator.resume();
    } // initilize ApiKeyGenerator
    // this is called after the instantiantion of all Generators

  }, {
    key: "initApiKey",
    value: function initApiKey() {
      this.apiKeyGenerator.init();
    } // initilize InstanceReservation
    // get a reserved link for socket.io-client

  }, {
    key: "initInstanceReservation",
    value: function initInstanceReservation(_ref3) {
      var serviceHost = _ref3.serviceHost,
          authToken = _ref3.authToken;
      this.instanceReservation.init({
        serviceHost: serviceHost,
        authToken: authToken
      });
    } // initilize SocketIOClientGenerator
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
    } // initilize MicrophoneGenerator
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
    } // get data from MicrophoneGenerator and add it to the queue
    // if the SocketIOClientGenerator is not waiting for a packet response then it should emit a new pachet with the data that is waiting in the queue

  }, {
    key: "onMicrophoneGeneratorDataCallback",
    value: function onMicrophoneGeneratorDataCallback(data) {
      if (this.microphoneQueue === undefined) return;
      this.microphoneQueue.enqueue(data);

      if (this.waitingForFinalPacket < this.waitingAfterMessages && this.microphoneQueue.peek()) {
        this.waitingForFinalPacket = this.waitingForFinalPacket + 1;
        this.socketIOClientGenerator.emitData(this.microphoneQueue.dequeue());
      }
    } // get data from SocketIOClientGenerator from the SOCKET_IO_CLIENT_RESULT_PATH and send it to user's callback function
    // if the data was final, and the MicrophoneQueue was not empty, send a new data to the ASR SERVICE through the SocketIOClientGenerator
    // if the data was final, and the MicrophoneQueue was empty, let the MicrophoneGenerator know that, when it gets new data, it can send it to the ASR SERVICE through the SocketIOClientGenerator

  }, {
    key: "onSocketIOClientGeneratorOnAsrResultCallback",
    value: function onSocketIOClientGeneratorOnAsrResultCallback(data) {
      this.onData(JSON.parse(data));

      if (checkIfFinalPacket(JSON.parse(data))) {
        this.waitingForFinalPacket = this.waitingForFinalPacket - 1;

        if (this.microphoneQueue.peek() && this.waitingForFinalPacket < this.waitingAfterMessages) {
          this.waitingForFinalPacket = this.waitingForFinalPacket + 1;
          this.socketIOClientGenerator.emitData(this.microphoneQueue.dequeue());
        }
      } // check if the user tried to destroy the VTC client


      if (this.waitingForFinalPacket === 0 && this.microphoneQueue.isEmpty && this.shouldDestroy) {
        this.destroy();
      }
    }
  }]);

  return VatisTechClient;
}();

var _default = VatisTechClient;
exports["default"] = _default;