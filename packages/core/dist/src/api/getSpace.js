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
exports.getSpace = void 0;
const luxon_1 = require("luxon");
const dataUri_1 = require("../utils/dataUri");
// Get space by Id
const getSpace = (contract, ipfsNode, spaceId) => __awaiter(void 0, void 0, void 0, function* () {
    const [exists, lodgingFacilityId, capacity, pricePerNightWei, active, dataURI] = yield contract.getSpaceById(spaceId);
    if (!exists) {
        return null;
    }
    const data = yield (0, dataUri_1.fetchDataUri)(ipfsNode, dataURI);
    return Object.assign(Object.assign({}, data), { active,
        lodgingFacilityId,
        capacity,
        pricePerNightWei,
        dataURI, updated: luxon_1.DateTime.now().toISO() });
});
exports.getSpace = getSpace;
//# sourceMappingURL=getSpace.js.map