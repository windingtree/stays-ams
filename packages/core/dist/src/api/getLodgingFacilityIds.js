"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLodgingFacilityIds = void 0;
// Get facilities Ids
const getLodgingFacilityIds = (contract, active = true) => active
    ? contract.getActiveLodgingFacilityIds()
    : contract.getAllLodgingFacilityIds();
exports.getLodgingFacilityIds = getLodgingFacilityIds;
//# sourceMappingURL=getLodgingFacilityIds.js.map