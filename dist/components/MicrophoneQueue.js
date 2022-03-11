"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MicrophoneQueue = /*#__PURE__*/function () {
  function MicrophoneQueue(_ref) {
    var logger = _ref.logger;

    _classCallCheck(this, MicrophoneQueue);

    _defineProperty(this, "queue", void 0);

    _defineProperty(this, "logger", void 0);

    this.logger = logger;
    this.logger({
      currentState: "@vatis-tech/asr-client-js: Instantianting and initializing the \"MicrophoneQueue\" plugin.",
      description: "@vatis-tech/asr-client-js: The data from user's microphone is stored here. When the SocketIOClientGenerator gets a response for the previous sent data, it takes from here the next data that was recored by the MicrophoneGenerator and sends it to the LIVE ASR service."
    });
    this.queue = [];
  }

  _createClass(MicrophoneQueue, [{
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