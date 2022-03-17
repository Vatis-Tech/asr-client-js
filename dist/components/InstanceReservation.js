"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("../helpers/functions/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var generateReservationUrl = _index["default"].generateReservationUrl;

var InstanceReservation = /*#__PURE__*/function () {
  function InstanceReservation(_ref) {
    var responseCallback = _ref.responseCallback,
        logger = _ref.logger;

    _classCallCheck(this, InstanceReservation);

    _defineProperty(this, "serviceHost", void 0);

    _defineProperty(this, "responseCallback", void 0);

    _defineProperty(this, "authToken", void 0);

    _defineProperty(this, "streamUrl", void 0);

    _defineProperty(this, "reservationToken", void 0);

    _defineProperty(this, "xmlHttp", void 0);

    _defineProperty(this, "logger", void 0);

    this.logger = logger;
    this.logger({
      currentState: "@vatis-tech/asr-client-js: Instantianting the \"InstanceReservation\" plugin.",
      description: "@vatis-tech/asr-client-js: This is the constructor of InstanceReservation class. This class, when it will be initialized, will call the ASR SERVICE to reserve a live asr instance."
    });
    this.responseCallback = responseCallback;
    this.xmlHttp = new XMLHttpRequest();
    this.xmlHttp.onload = this.onLoad.bind(this);
    this.xmlHttp.onerror = this.onError;
  }

  _createClass(InstanceReservation, [{
    key: "init",
    value: function init(_ref2) {
      var serviceHost = _ref2.serviceHost,
          authToken = _ref2.authToken;
      this.serviceHost = serviceHost;
      this.authToken = authToken;
      this.logger({
        currentState: "@vatis-tech/asr-client-js: Initializing the \"InstanceReservation\" plugin.",
        description: "@vatis-tech/asr-client-js: Here it is where the XMLHttpRequest happens to reserve a live asr instance."
      });
      this.xmlHttp.open("GET", generateReservationUrl({
        serviceHost: this.serviceHost
      }));
      this.xmlHttp.setRequestHeader("Authorization", this.authToken);
      this.xmlHttp.send();
    }
  }, {
    key: "onError",
    value: function onError(e) {
      var errorMessage = "Could not reserve a live asr instance.";
      console.error(errorMessage);
      throw errorMessage;
    }
  }, {
    key: "onLoad",
    value: function onLoad() {
      this.logger({
        currentState: "@vatis-tech/asr-client-js: Initialized the \"InstanceReservation\" plugin.",
        description: "@vatis-tech/asr-client-js: A live asr instance has been reserved."
      });
      var response = JSON.parse(this.xmlHttp.responseText);
      this.streamUrl = credentials.stream_url;
      this.reservationToken = credentials.token;
      this.podName = credentials.pod_name;
      this.responseCallback({
        serviceHost: this.serviceHost,
        authToken: this.authToken,
        streamUrl: this.streamUrl,
        reservationToken: this.reservationToken,
        podName: this.podName
      });
    }
  }]);

  return InstanceReservation;
}();

var _default = InstanceReservation;
exports["default"] = _default;