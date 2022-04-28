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
exports.getNewBookingsTokenIds = void 0;
const getNewBookingsTokenIds = (contract, fromBlock) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = new Set();
    const staysCreatedFilter = contract.filters.NewStay();
    const stayCreated = yield contract.queryFilter(staysCreatedFilter, fromBlock, 'latest');
    stayCreated.map(s => {
        var _a;
        tokens.add((_a = s === null || s === void 0 ? void 0 : s.args) === null || _a === void 0 ? void 0 : _a.tokenId);
    });
    return Array.from(tokens);
});
exports.getNewBookingsTokenIds = getNewBookingsTokenIds;
//# sourceMappingURL=getNewBookingsTokenIds.js.map