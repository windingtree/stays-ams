"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIpfsChunks = exports.obj2File = exports.startIpfsGateway = void 0;
var blob_1 = require("@web-std/blob");
var file_1 = require("@web-std/file");
var ipfs_core_1 = require("ipfs-core");
var startIpfsGateway = function (options) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2, (0, ipfs_core_1.create)(options)];
}); }); };
exports.startIpfsGateway = startIpfsGateway;
var obj2File = function (obj, fileName) {
    var blob = new blob_1.Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    return new file_1.File([blob], fileName);
};
exports.obj2File = obj2File;
var getIpfsChunks = function (asyncIterator) { var asyncIterator_1, asyncIterator_1_1; return __awaiter(void 0, void 0, void 0, function () {
    var data, chunk, e_1_1, length, concatenatedData, offset, _i, data_1, arr, decoder;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = [];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 12]);
                asyncIterator_1 = __asyncValues(asyncIterator);
                _b.label = 2;
            case 2: return [4, asyncIterator_1.next()];
            case 3:
                if (!(asyncIterator_1_1 = _b.sent(), !asyncIterator_1_1.done)) return [3, 5];
                chunk = asyncIterator_1_1.value;
                data.push(chunk);
                _b.label = 4;
            case 4: return [3, 2];
            case 5: return [3, 12];
            case 6:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3, 12];
            case 7:
                _b.trys.push([7, , 10, 11]);
                if (!(asyncIterator_1_1 && !asyncIterator_1_1.done && (_a = asyncIterator_1.return))) return [3, 9];
                return [4, _a.call(asyncIterator_1)];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9: return [3, 11];
            case 10:
                if (e_1) throw e_1.error;
                return [7];
            case 11: return [7];
            case 12:
                length = data.reduce(function (acc, curr) { return acc + curr.length; }, 0);
                concatenatedData = new Uint8Array(length);
                offset = 0;
                for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                    arr = data_1[_i];
                    concatenatedData.set(arr, offset);
                    offset += arr.length;
                }
                decoder = new blob_1.TextDecoder();
                return [2, decoder.decode(concatenatedData)];
        }
    });
}); };
exports.getIpfsChunks = getIpfsChunks;
//# sourceMappingURL=index.js.map