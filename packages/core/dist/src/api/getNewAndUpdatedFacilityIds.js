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
exports.getNewAndUpdatedFacilityIds = void 0;
const getNewAndUpdatedFacilityIds = (contract, fromBlock) => __awaiter(void 0, void 0, void 0, function* () {
    const facilitiesIds = new Set();
    const facilityCreatedFilter = contract.filters.LodgingFacilityCreated();
    const facilityUpdatedFilter = contract.filters.LodgingFacilityUpdated();
    const spaceCreatedFilter = contract.filters.SpaceAdded();
    const spaceUpdatedFilter = contract.filters.SpaceUpdated();
    const facilityCreated = yield contract.queryFilter(facilityCreatedFilter, fromBlock, 'latest');
    const facilityUpdated = yield contract.queryFilter(facilityUpdatedFilter, fromBlock, 'latest');
    const spaceCreated = yield contract.queryFilter(spaceCreatedFilter, fromBlock, 'latest');
    const spaceUpdated = yield contract.queryFilter(spaceUpdatedFilter, fromBlock, 'latest');
    [
        ...facilityCreated,
        ...facilityUpdated,
        ...spaceCreated,
        ...spaceUpdated
    ].forEach(event => facilitiesIds.add(event.args.facilityId));
    // @todo Process removal of facilities and spaces
    return Array.from(facilitiesIds);
});
exports.getNewAndUpdatedFacilityIds = getNewAndUpdatedFacilityIds;
//# sourceMappingURL=getNewAndUpdatedFacilityIds.js.map