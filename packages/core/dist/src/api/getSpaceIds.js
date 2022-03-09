"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpaceIds = void 0;
// Get spaces Ids
const getSpaceIds = (contract, lodgingFacilityId, active = true) => active
    ? contract.getActiveSpaceIdsByFacilityId(lodgingFacilityId)
    : contract.getSpaceIdsByFacilityId(lodgingFacilityId);
exports.getSpaceIds = getSpaceIds;
//# sourceMappingURL=getSpaceIds.js.map