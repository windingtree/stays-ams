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
Object.defineProperty(exports, "__esModule", { value: true });
exports.repeater = void 0;
// Makes at least maxTries calls of a callback
const repeater = (callback, maxTries = 3, tries = 0) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield callback();
    }
    catch (error) {
        if (tries > maxTries) {
            throw error;
        }
        return (0, exports.repeater)(callback, maxTries, tries + 1);
    }
});
exports.repeater = repeater;
//# sourceMappingURL=repeater.js.map