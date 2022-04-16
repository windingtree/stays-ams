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
exports.updateSpace = void 0;
const org_id_utils_1 = require("@windingtree/org.id-utils");
const ipfs_apis_1 = require("@windingtree/ipfs-apis");
const sendHelper_1 = require("../utils/sendHelper");
const updateSpace = (contract, web3Storage, spaceId, profileData, overrides, transactionHashCb, confirmations = 1) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const profileDataFile = ipfs_apis_1.utils.obj2File(profileData, `space${spaceId}_${org_id_utils_1.uid.simpleUid(5)}.json`);
    const capacity = profileData.capacity;
    const pricePerNightWei = profileData.price;
    const ipfsCid = yield web3Storage.add(profileDataFile);
    const dataURI = `ipfs://${ipfsCid}`;
    overrides = overrides ? overrides : {};
    const receipt = yield (0, sendHelper_1.sendHelper)(contract, 'updateSpace', [
        spaceId,
        capacity,
        pricePerNightWei,
        dataURI
    ], undefined, // use already connected signer,
    overrides, transactionHashCb, confirmations);
    const event = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a.find(e => e.event == 'SpaceUpdated');
    const updatedSpaceId = (_b = event === null || event === void 0 ? void 0 : event.args) === null || _b === void 0 ? void 0 : _b.spaceId;
    if (!updatedSpaceId) {
        throw new Error(`Unable to find "updatedSpaceId" in the transaction receipt`);
    }
    return updatedSpaceId;
});
exports.updateSpace = updateSpace;
//# sourceMappingURL=updateSpace.js.map