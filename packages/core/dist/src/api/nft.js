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
exports.getToken = exports.getTokensOfOwner = void 0;
const dataUri_1 = require("../utils/dataUri");
// Get NFT of the owner
const getTokensOfOwner = (contract, owner) => __awaiter(void 0, void 0, void 0, function* () {
    const balance = yield contract.balanceOf(owner);
    let tokens = [];
    for (let i = 0; i < balance.toNumber(); i++) {
        const token = yield contract.tokenOfOwnerByIndex(owner, i);
        tokens.push(token);
    }
    return tokens.map(t => t.toString());
});
exports.getTokensOfOwner = getTokensOfOwner;
const getToken = (contract, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const owner = yield contract.ownerOf(tokenId);
    const tokenUri = yield contract.tokenURI(tokenId);
    const data = (0, dataUri_1.decodeDataUri)(tokenUri, true);
    const spaceId = (_a = data.attributes) === null || _a === void 0 ? void 0 : _a.find(a => a.trait_type === 'spaceId');
    if (!spaceId) {
        throw new Error('Unable to get space Id from the token metadata');
    }
    const statuses = [
        'booked',
        'checked-in',
        'checked-out'
    ];
    const status = yield contract.depositState(owner, spaceId.value, tokenId);
    return {
        tokenId,
        owner,
        tokenUri,
        status: statuses[status],
        data
    };
});
exports.getToken = getToken;
//# sourceMappingURL=nft.js.map