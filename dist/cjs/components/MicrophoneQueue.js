"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var MicrophoneQueue = /*#__PURE__*/function () {
  function MicrophoneQueue(_ref) {
    var logger = _ref.logger;
    (0, _classCallCheck2["default"])(this, MicrophoneQueue);
    (0, _defineProperty2["default"])(this, "queue", void 0);
    (0, _defineProperty2["default"])(this, "logger", void 0);
    this.logger = logger;
    this.logger({
      currentState: "@vatis-tech/asr-client-js: Instantianting and initializing the \"MicrophoneQueue\" plugin.",
      description: "@vatis-tech/asr-client-js: The data from user's microphone is stored here. When the SocketIOClientGenerator gets a response for the previous sent data, it takes from here the next data that was recored by the MicrophoneGenerator and sends it to the LIVE ASR service."
    });
    this.queue = [];
  }

  (0, _createClass2["default"])(MicrophoneQueue, [{
    key: "dequeue",
    value: function dequeue() {
      return this.queue.shift(0, 1);
    }
  }, {
    key: "enqueue",
    value: function enqueue(element) {
      return this.queue.push(element);
    }
  }, {
    key: "peek",
    value: function peek() {
      return this.queue.at(0);
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.queue.length > 0 ? false : true;
    }
  }]);
  return MicrophoneQueue;
}();

var _default = MicrophoneQueue;
exports["default"] = _default;