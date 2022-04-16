"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obj2File = void 0;
var blob_1 = require("@web-std/blob");
var file_1 = require("@web-std/file");
var obj2File = function (obj, fileName) {
    var blob = new blob_1.Blob([JSON.stringify(obj)], { type: 'application/json' });
    return new file_1.File([blob], fileName);
};
exports.obj2File = obj2File;
//# sourceMappingURL=index.js.map