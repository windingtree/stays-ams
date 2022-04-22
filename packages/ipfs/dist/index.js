/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/apis/web3Storage.ts":
/*!*********************************!*\
  !*** ./src/apis/web3Storage.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Web3StorageApi": () => (/* binding */ Web3StorageApi)
/* harmony export */ });
/* harmony import */ var web3_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! web3.storage */ "web3.storage");
/* harmony import */ var web3_storage__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(web3_storage__WEBPACK_IMPORTED_MODULE_0__);

class Web3StorageApi {
  constructor(token) {
    if (!token) {
      throw new Error('Web3Storage Authorization API token must be provided');
    }

    this.w3Api = new web3_storage__WEBPACK_IMPORTED_MODULE_0__.Web3Storage({
      token
    });
  }

  add(file) {
    return this.w3Api.put([file], {
      wrapWithDirectory: false
    });
  }

  async get(cid) {
    const res = await this.w3Api.get(cid);

    if (!res || !res.ok) {
      throw new Error(`Failed to get ${cid}`);
    }

    const files = await res.files();
    return files[0].text();
  }

}

/***/ }),

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "obj2File": () => (/* binding */ obj2File)
/* harmony export */ });
/* harmony import */ var _web_std_blob__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @web-std/blob */ "@web-std/blob");
/* harmony import */ var _web_std_blob__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_web_std_blob__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _web_std_file__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @web-std/file */ "@web-std/file");
/* harmony import */ var _web_std_file__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_web_std_file__WEBPACK_IMPORTED_MODULE_1__);


const obj2File = (obj, fileName) => {
  const blob = new _web_std_blob__WEBPACK_IMPORTED_MODULE_0__.Blob([JSON.stringify(obj)], {
    type: 'application/json'
  });
  return new _web_std_file__WEBPACK_IMPORTED_MODULE_1__.File([blob], fileName);
};

/***/ }),

/***/ "@web-std/blob":
/*!********************************!*\
  !*** external "@web-std/blob" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@web-std/blob");

/***/ }),

/***/ "@web-std/file":
/*!********************************!*\
  !*** external "@web-std/file" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@web-std/file");

/***/ }),

/***/ "web3.storage":
/*!*******************************!*\
  !*** external "web3.storage" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("web3.storage");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Web3StorageApi": () => (/* reexport safe */ _apis_web3Storage__WEBPACK_IMPORTED_MODULE_0__.Web3StorageApi),
/* harmony export */   "utils": () => (/* binding */ utils)
/* harmony export */ });
/* harmony import */ var _apis_web3Storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./apis/web3Storage */ "./src/apis/web3Storage.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils/index.ts");


const utils = {
  obj2File: _utils__WEBPACK_IMPORTED_MODULE_1__.obj2File
};

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=index.js.map