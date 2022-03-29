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
exports.getTokenStatus = void 0;
const nft_1 = require("./nft");
// Check in
const getTokenStatus = (contract, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = yield (0, nft_1.getToken)(contract, tokenId);
    const spaceId = (_a = token.data.attributes) === null || _a === void 0 ? void 0 : _a.find(a => a.trait_type === 'spaceId');
    if (!spaceId) {
        throw new Error('Unable to get space Id from the token metadata');
    }
    const statuses = [
        'booked',
        'checked-in',
        'checked-out'
    ];
    const status = yield contract.depositState(token.owner, spaceId.value, tokenId);
    return statuses[status];
});
exports.getTokenStatus = getTokenStatus;
//# sourceMappingURL=getTokenStatus.js.map