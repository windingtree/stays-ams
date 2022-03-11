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
exports.book = void 0;
const ethers_1 = require("ethers");
const sendHelper_1 = require("../utils/sendHelper");
// Book a space
const book = (contract, spaceId, startDay, numberOfDays, quantity, overrides, transactionHashCb, confirmations = 1) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    overrides = overrides ? overrides : {};
    const owner = contract.provider.getSigner();
    const space = yield contract.getSpaceById(spaceId);
    // value = pricePerNightWei * numberOfDays * quantity
    const value = space
        .pricePerNightWei
        .mul(ethers_1.BigNumber.from(numberOfDays))
        .mul(ethers_1.BigNumber.from(quantity));
    const receipt = yield (0, sendHelper_1.sendHelper)(contract, 'newStay', [
        spaceId,
        startDay,
        numberOfDays,
        quantity
    ], owner, Object.assign(Object.assign({}, overrides), { value }), transactionHashCb, confirmations);
    const event = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a.find(e => e.event == 'NewStay');
    const tokenId = (_b = event === null || event === void 0 ? void 0 : event.args) === null || _b === void 0 ? void 0 : _b.tokenId;
    if (!spaceId) {
        throw new Error(`Unable to find "tokenId" in the transaction receipt`);
    }
    return tokenId;
});
exports.book = book;
//# sourceMappingURL=book.js.map