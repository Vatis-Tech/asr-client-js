"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _index = _interopRequireDefault(require("../helpers/constants/index.js"));
var _index2 = _interopRequireDefault(require("../helpers/functions/index.js"));
var MICROPHONE_BIT_RATE_SAMPLES = _index["default"].MICROPHONE_BIT_RATE_SAMPLES,
  MICROPHONE_TIMESLICE = _index["default"].MICROPHONE_TIMESLICE,
  SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA = _index["default"].SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA;
var base64ArrayBuffer = _index2["default"].base64ArrayBuffer;
var MicrophoneGenerator = /*#__PURE__*/function () {
  function MicrophoneGenerator(_ref) {
    var onDataCallback = _ref.onDataCallback,
      onBlobDataCallback = _ref.onBlobDataCallback,
      logger = _ref.logger,
      microphoneTimeslice = _ref.microphoneTimeslice,
      errorHandler = _ref.errorHandler,
      microphoneDeviceId = _ref.microphoneDeviceId;
    (0, _classCallCheck2["default"])(this, MicrophoneGenerator);
    (0, _defineProperty2["default"])(this, "stream", void 0);
    (0, _defineProperty2["default"])(this, "onDataCallback", void 0);
    (0, _defineProperty2["default"])(this, "logger", void 0);
    (0, _defineProperty2["default"])(this, "blobState", void 0);
    (0, _defineProperty2["default"])(this, "mediaRecorder", void 0);
    (0, _defineProperty2["default"])(this, "microphoneTimeslice", void 0);
    (0, _defineProperty2["default"])(this, "microphoneDeviceId", void 0);
    (0, _defineProperty2["default"])(this, "errorHandler", void 0);
    this.microphoneDeviceId = microphoneDeviceId;
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.logger({
      currentState: "@vatis-tech/asr-client-js: Instantianting the \"MicrophoneGenerator\" plugin.",
      description: "@vatis-tech/asr-client-js: This is the constructor of MicrophoneGenerator class. This class, when it will be initialized, will ask user's permission for microphone usage. If accepted, the data from the microphone will be sent to the LIVE ASR service, using the SocketIOClientGenerator instance."
    });
    this.onDataCallback = onDataCallback;
    this.onBlobDataCallback = onBlobDataCallback;
    if (microphoneTimeslice) {
      this.microphoneTimeslice = microphoneTimeslice;
    } else {
      this.microphoneTimeslice = MICROPHONE_TIMESLICE;
    }
  }

  // on destroy we want to stop the MediaRecorder from recording
  (0, _createClass2["default"])(MicrophoneGenerator, [{
    key: "destroy",
    value: function destroy() {
      if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
        this.mediaRecorder.stop();
      }
      if (this.stream) {
        this.stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }
    }

    // lets the user pause recording
  }, {
    key: "pause",
    value: function pause() {
      this.mediaRecorder.pause();
    }

    // lets the user resume recording
  }, {
    key: "resume",
    value: function resume() {
      this.mediaRecorder.resume();
    }
  }, {
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var _this = this;
        var mediaDevicesOptions;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              this.logger({
                currentState: "@vatis-tech/asr-client-js: Initializing the \"MicrophoneGenerator\" plugin.",
                description: "@vatis-tech/asr-client-js: The MicrophoneGenerator will request for the user's microphone."
              });
              mediaDevicesOptions = {
                video: false,
                audio: true
              };
              if (!(this.microphoneDeviceId && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)) {
                _context.next = 5;
                break;
              }
              _context.next = 5;
              return navigator.mediaDevices.enumerateDevices().then(function (devices) {
                var availableDevices = devices.filter(function (device) {
                  return device.deviceId === _this.microphoneDeviceId;
                });
                if (availableDevices.length) {
                  mediaDevicesOptions.audio = {
                    deviceId: {
                      exact: _this.microphoneDeviceId
                    }
                  };
                }
              })["catch"](function (err) {
                console.error("".concat(err.name, ": ").concat(err.message));
              });
            case 5:
              _context.next = 7;
              return navigator.mediaDevices.getUserMedia(mediaDevicesOptions).then(function (stream) {
                _this.stream = stream;
                var options = {
                  mimeType: "audio/webm",
                  bitsPerSecond: 128000,
                  audioBitrateMode: "constant"
                };
                _this.mediaRecorder = new MediaRecorder(stream, options);
                _this.mediaRecorder.addEventListener("dataavailable", function (e) {
                  var _this2 = this;
                  // Converting audio blob to base64
                  var reader = new FileReader();
                  reader.onloadend = function () {
                    // You can upload the base64 to server here.
                    _this2.onDataCallback({
                      type: SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA,
                      data: reader.result.replace("data:audio/webm;codecs=opus;base64,", "").replace("data:audio/webm; codecs=opus;base64,", "").replace("data:audio/webm; codecs=opus; base64,", "")
                    });
                  };
                  this.onBlobDataCallback(e.data);
                  reader.readAsDataURL(e.data);
                  // if (e.data.size > 0) {
                  //   if (this.blobState) {
                  //     this.blobState = new Blob([this.blobState, e.data]);
                  //   } else {
                  //     this.blobState = e.data;
                  //   }
                  //   if (this.blobState.size > MICROPHONE_BIT_RATE_SAMPLES) {
                  //     this.blobState.arrayBuffer().then((buffer) => {
                  //       for (
                  //         var i = 0;
                  //         i <
                  //         Math.trunc(
                  //           this.blobState.size / MICROPHONE_BIT_RATE_SAMPLES
                  //         );
                  //         i++
                  //       ) {
                  //         let dataSamples = buffer.slice(
                  //           i * MICROPHONE_BIT_RATE_SAMPLES,
                  //           MICROPHONE_BIT_RATE_SAMPLES +
                  //             i * MICROPHONE_BIT_RATE_SAMPLES
                  //         );
                  //         // this.onDataCallback(new Int32Array(dataSamples));
                  //         this.onDataCallback(base64ArrayBuffer(dataSamples));
                  //       }
                  //       this.blobState = this.blobState.slice(
                  //         i * MICROPHONE_BIT_RATE_SAMPLES,
                  //         this.blobState.size
                  //       );
                  //     });
                  //   }
                  // }
                }.bind(_this));
                _this.mediaRecorder.start(_this.microphoneTimeslice);
                _this.logger({
                  currentState: "@vatis-tech/asr-client-js: Initialized the \"MicrophoneGenerator\" plugin.",
                  description: "@vatis-tech/asr-client-js: The MicrophoneGenerator was successful into getting user's microphone, and will start sending data each ".concat(_this.microphoneTimeslice, " miliseconds.")
                });
              })["catch"](function (err) {
                _this.logger({
                  currentState: "@vatis-tech/asr-client-js: Could not initilize the \"MicrophoneGenerator\" plugin.",
                  description: "@vatis-tech/asr-client-js: " + err
                });
                _this.errorHandler(err);
              });
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
  }, {
    key: "getStream",
    value: function getStream() {
      return this.stream;
    }
  }]);
  return MicrophoneGenerator;
}();
var _default = exports["default"] = MicrophoneGenerator;