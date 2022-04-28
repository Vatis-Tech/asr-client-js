"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var ApiKeyGenerator = /*#__PURE__*/function () {
  function ApiKeyGenerator(_ref) {
    var apiUrl = _ref.apiUrl,
        responseCallback = _ref.responseCallback,
        apiKey = _ref.apiKey,
        logger = _ref.logger,
        errorHandler = _ref.errorHandler;
    (0, _classCallCheck2["default"])(this, ApiKeyGenerator);
    (0, _defineProperty2["default"])(this, "apiUrl", void 0);
    (0, _defineProperty2["default"])(this, "responseCallback", void 0);
    (0, _defineProperty2["default"])(this, "apiKey", void 0);
    (0, _defineProperty2["default"])(this, "serviceHost", void 0);
    (0, _defineProperty2["default"])(this, "authToken", void 0);
    (0, _defineProperty2["default"])(this, "xmlHttp", void 0);
    (0, _defineProperty2["default"])(this, "logger", void 0);
    (0, _defineProperty2["default"])(this, "errorHandler", void 0);
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.logger({
      currentState: "@vatis-tech/asr-client-js: Instantianting the \"ApiKeyGenerator\" plugin.",
      description: "@vatis-tech/asr-client-js: This is the constructor of ApiKeyGenerator class. This class, when it will be initialized, will get from the Vatis Tech API, a key for the LIVE ASR service."
    });
    this.apiUrl = apiUrl;
    this.responseCallback = responseCallback;
    this.apiKey = apiKey;
    this.xmlHttp = new XMLHttpRequest();
    this.xmlHttp.onload = this.onLoad.bind(this);
    this.xmlHttp.onerror = this.onError.bind(this);
  }

  (0, _createClass2["default"])(ApiKeyGenerator, [{
    key: "init",
    value: function init() {
      this.logger({
        currentState: "@vatis-tech/asr-client-js: Initializing the \"ApiKeyGenerator\" plugin.",
        description: "@vatis-tech/asr-client-js: Here it is where the XMLHttpRequest happens to get a valid key for the LIVE ASR  service."
      });
      this.xmlHttp.open("GET", this.apiUrl);
      this.xmlHttp.setRequestHeader("Authorization", "Bearer " + this.apiKey);
      this.xmlHttp.send();
    }
  }, {
    key: "onError",
    value: function onError(e) {
      this.logger({
        currentState: "@vatis-tech/asr-client-js: Could not initilize the \"ApiKeyGenerator\" plugin.",
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
        currentState: "@vatis-tech/asr-client-js: Initialized the \"ApiKeyGenerator\" plugin.",
        description: "@vatis-tech/asr-client-js: A valid key was received from the Vatis Tech API, in order to use the LIVE ASR service."
      });
      var credentials = JSON.parse(this.xmlHttp.responseText);
      this.serviceHost = credentials.service_host;
      this.authToken = credentials.auth_token;
      this.responseCallback({
        serviceHost: credentials.service_host,
        authToken: credentials.auth_token
      });
    }
  }]);
  return ApiKeyGenerator;
}();

var _default = ApiKeyGenerator;
exports["default"] = _default;