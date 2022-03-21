"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("../helpers/constants/index.js"));

var _index2 = _interopRequireDefault(require("../helpers/functions/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MICROPHONE_BIT_RATE_SAMPLES = _index["default"].MICROPHONE_BIT_RATE_SAMPLES,
    MICROPHONE_TIMESLICE = _index["default"].MICROPHONE_TIMESLICE;
var base64ArrayBuffer = _index2["default"].base64ArrayBuffer;

var MicrophoneGenerator = /*#__PURE__*/function () {
  function MicrophoneGenerator(_ref) {
    var onDataCallback = _ref.onDataCallback,
        logger = _ref.logger;

    _classCallCheck(this, MicrophoneGenerator);

    _defineProperty(this, "stream", void 0);

    _defineProperty(this, "onDataCallback", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "blobState", void 0);

    _defineProperty(this, "mediaRecorder", void 0);

    this.logger = logger;
    this.logger({
      currentState: "@vatis-tech/asr-client-js: Instantianting the \"MicrophoneGenerator\" plugin.",
      description: "@vatis-tech/asr-client-js: This is the constructor of MicrophoneGenerator class. This class, when it will be initialized, will ask user's permission for microphone usage. If accepted, the data from the microphone will be sent to the LIVE ASR service, using the SocketIOClientGenerator instance."
    });
    this.onDataCallback = onDataCallback;
  } // on destroy we want to stop the MediaRecorder from recording


  _createClass(MicrophoneGenerator, [{
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
    } // lets the user pause recording

  }, {
    key: "pause",
    value: function pause() {
      this.mediaRecorder.pause();
    } // lets the user resume recording

  }, {
    key: "resume",
    value: function resume() {
      this.mediaRecorder.resume();
    }
  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.logger({
                  currentState: "@vatis-tech/asr-client-js: Initializing the \"MicrophoneGenerator\" plugin.",
                  description: "@vatis-tech/asr-client-js: The MicrophoneGenerator will request for the user's microphone."
                });
                _context.next = 3;
                return navigator.mediaDevices.getUserMedia({
                  video: false,
                  audio: true
                }).then(function (stream) {
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
                      _this2.onDataCallback(reader.result.replace("data:audio/webm;codecs=opus;base64,", "").replace("data:audio/webm; codecs=opus; base64,", ""));
                    };

                    reader.readAsDataURL(e.data); // if (e.data.size > 0) {
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

                  _this.mediaRecorder.start(MICROPHONE_TIMESLICE);

                  _this.logger({
                    currentState: "@vatis-tech/asr-client-js: Initialized the \"MicrophoneGenerator\" plugin.",
                    description: "@vatis-tech/asr-client-js: The MicrophoneGenerator was successful into getting user's microphone, and will start sending data each ".concat(MICROPHONE_TIMESLICE, " miliseconds.")
                  });
                })["catch"](function (err) {
                  var errorMessage = "Could not initilize the microphone stream with error: " + err;
                  console.error(errorMessage);
                  throw errorMessage;
                });

              case 3:
              case "end":
                return _context.stop();
            }
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

var _default = MicrophoneGenerator;
exports["default"] = _default;