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
exports.ipfsCidResolver = void 0;
const ipfsCidResolver = (web3Storage) => (cid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawResource = yield Promise.race([
            web3Storage.get(cid),
            new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout occurred during getting cid: ${cid}`)), 70000 // @todo Move timeout value to the Dapp configuration
            ))
        ]);
        try {
            return JSON.parse(rawResource);
        }
        catch (error) {
            throw new Error(`Unable to parse ORGiD VC from the CID: ${cid}`);
        }
    }
    catch (error) {
        throw error;
    }
});
exports.ipfsCidResolver = ipfsCidResolver;
//# sourceMappingURL=ipfs.js.map