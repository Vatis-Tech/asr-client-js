"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _index = _interopRequireDefault(require("../helpers/functions/index.js"));

var generateReservationUrl = _index["default"].generateReservationUrl;

var InstanceReservation = /*#__PURE__*/function () {
  function InstanceReservation(_ref) {
    var responseCallback = _ref.responseCallback,
        logger = _ref.logger,
        errorHandler = _ref.errorHandler;
    (0, _classCallCheck2["default"])(this, InstanceReservation);
    (0, _defineProperty2["default"])(this, "serviceHost", void 0);
    (0, _defineProperty2["default"])(this, "responseCallback", void 0);
    (0, _defineProperty2["default"])(this, "authToken", void 0);
    (0, _defineProperty2["default"])(this, "streamUrl", void 0);
    (0, _defineProperty2["default"])(this, "reservationToken", void 0);
    (0, _defineProperty2["default"])(this, "xmlHttp", void 0);
    (0, _defineProperty2["default"])(this, "logger", void 0);
    (0, _defineProperty2["default"])(this, "errorHandler", void 0);
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.logger({
      currentState: "@vatis-tech/asr-client-js: Instantianting the \"InstanceReservation\" plugin.",
      description: "@vatis-tech/asr-client-js: This is the constructor of InstanceReservation class. This class, when it will be initialized, will call the ASR SERVICE to reserve a live asr instance."
    });
    this.responseCallback = responseCallback;
    this.xmlHttp = new XMLHttpRequest();
    this.xmlHttp.onload = this.onLoad.bind(this);
    this.xmlHttp.onerror = this.onError.bind(this);
  }

  (0, _createClass2["default"])(InstanceReservation, [{
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
      this.logger({
        currentState: "@vatis-tech/asr-client-js: Could not initilize the \"InstanceReservation\" plugin.",
        description: "@vatis-tech/asr-client-js: " + e
      });
      this.errorHandler(e);
    }
  }, {
    key: "onLoad",
    value: function onLoad() {
      if (this.xmlHttp.status !== 200) {
        this.onError(JSON.parse(this.xmlHttp.responseText));
        return;
      }

      this.logger({
        currentState: "@vatis-tech/asr-client-js: Initialized the \"InstanceReservation\" plugin.",
        description: "@vatis-tech/asr-client-js: A live asr instance has been reserved."
      });
      var response = JSON.parse(this.xmlHttp.responseText);
      this.streamUrl = response.stream_url;
      this.reservationToken = response.token;
      this.streamHost = response.stream_host;
      this.responseCallback({
        streamHost: this.streamHost,
        streamUrl: this.streamUrl,
        reservationToken: this.reservationToken,
        authToken: this.authToken
      });
    }
  }]);
  return InstanceReservation;
}();

var _default = InstanceReservation;
exports["default"] = _default;