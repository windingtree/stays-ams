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
exports.getLodgingFacility = void 0;
const luxon_1 = require("luxon");
const dataUri_1 = require("../utils/dataUri");
// Get facility by Id
const getLodgingFacility = (contract, ipfsNode, lodgingFacilityId) => __awaiter(void 0, void 0, void 0, function* () {
    const [exists, owner, active, dataURI] = yield contract.getLodgingFacilityById(lodgingFacilityId);
    if (!exists) {
        return null;
    }
    const data = yield (0, dataUri_1.fetchDataUri)(ipfsNode, dataURI);
    return Object.assign(Object.assign({}, data), { lodgingFacilityId,
        owner,
        active,
        dataURI, spaces: [], updated: luxon_1.DateTime.now().toISO() });
});
exports.getLodgingFacility = getLodgingFacility;
//# sourceMappingURL=getLodgingFacility.js.map