"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _constants = _interopRequireDefault(require("../helpers/constants"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var SOCKET_IO_CLIENT_MESSAGE_TYPE_CONFIG = _constants["default"].SOCKET_IO_CLIENT_MESSAGE_TYPE_CONFIG;
var MicrophoneQueue = /*#__PURE__*/function () {
  function MicrophoneQueue(_ref) {
    var logger = _ref.logger,
      config = _ref.config;
    (0, _classCallCheck2["default"])(this, MicrophoneQueue);
    (0, _defineProperty2["default"])(this, "queue", void 0);
    (0, _defineProperty2["default"])(this, "logger", void 0);
    (0, _defineProperty2["default"])(this, "config", void 0);
    this.logger = logger;
    this.config = config;
    this.logger({
      currentState: "@vatis-tech/asr-client-js: Instantianting and initializing the \"MicrophoneQueue\" plugin.",
      description: "@vatis-tech/asr-client-js: The data from user's microphone is stored here. When the SocketIOClientGenerator gets a response for the previous sent data, it takes from here the next data that was recored by the MicrophoneGenerator and sends it to the LIVE ASR service."
    });
    if (config) {
      this.queue = [_objectSpread({
        type: SOCKET_IO_CLIENT_MESSAGE_TYPE_CONFIG
      }, config)];
    } else {
      this.queue = [];
    }
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