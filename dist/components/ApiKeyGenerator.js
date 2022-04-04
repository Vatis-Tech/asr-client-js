"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ApiKeyGenerator = /*#__PURE__*/function () {
  function ApiKeyGenerator(_ref) {
    var apiUrl = _ref.apiUrl,
        responseCallback = _ref.responseCallback,
        apiKey = _ref.apiKey,
        logger = _ref.logger,
        errorHandler = _ref.errorHandler;

    _classCallCheck(this, ApiKeyGenerator);

    _defineProperty(this, "apiUrl", void 0);

    _defineProperty(this, "responseCallback", void 0);

    _defineProperty(this, "apiKey", void 0);

    _defineProperty(this, "serviceHost", void 0);

    _defineProperty(this, "authToken", void 0);

    _defineProperty(this, "xmlHttp", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "errorHandler", void 0);

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
    this.xmlHttp.onerror = this.onError;
  }

  _createClass(ApiKeyGenerator, [{
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