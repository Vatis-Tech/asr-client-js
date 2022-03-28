"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var blobToBase64 = function blobToBase64(blob) {
  var reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise(function (resolve) {
    reader.onloadend = function () {
      resolve(reader.result);
    };
  });
};

var _default = blobToBase64;
exports["default"] = _default;