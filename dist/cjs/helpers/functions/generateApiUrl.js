"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _index = _interopRequireDefault(require("../constants/index.js"));
var API_URL = _index["default"].API_URL,
  API_URL_PATH = _index["default"].API_URL_PATH;
function generateApiUrl(_ref) {
  var service = _ref.service,
    model = _ref.model,
    language = _ref.language,
    host = _ref.host;
  var apiUrl = (host ? host : API_URL) + API_URL_PATH;
  if (service) {
    apiUrl = apiUrl.replace("<service>", service);
  } else {
    apiUrl = apiUrl.replace("?service=<service>", "?");
  }
  if (model) {
    apiUrl = apiUrl.replace("<model>", model);
  } else {
    apiUrl = apiUrl.replace("&model=<model>", "");
  }
  if (language) {
    apiUrl = apiUrl.replace("<language>", language);
  } else {
    apiUrl = apiUrl.replace("&language=<language>", "");
  }
  if (apiUrl.includes("?&")) {
    apiUrl = apiUrl.replace("?&", "?");
  }
  if (apiUrl.endsWith("?")) {
    apiUrl = apiUrl.replace("?", "");
  }
  return apiUrl;
}
var _default = generateApiUrl;
exports["default"] = _default;