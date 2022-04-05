"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLodgingFacilityData = exports.validateSpaceData = void 0;
const org_id_utils_1 = require("@windingtree/org.id-utils");
const schemas_1 = require("./schemas");
const validateSpaceData = (spaceData) => {
    const validationResult = org_id_utils_1.object.validateWithSchemaOrRef(schemas_1.spaceSchema, '', spaceData);
    if (validationResult !== null) {
        throw new Error(`Validation error: ${validationResult}`);
    }
};
exports.validateSpaceData = validateSpaceData;
const validateLodgingFacilityData = (lodgingFacility) => {
    const validationResult = org_id_utils_1.object.validateWithSchemaOrRef(schemas_1.lodgingFacilitySchema, '#/definitions/LodgingFacilityReference', lodgingFacility);
    if (validationResult !== null) {
        throw new Error(`Validation error: ${validationResult}`);
    }
};
exports.validateLodgingFacilityData = validateLodgingFacilityData;
//# sourceMappingURL=validators.js.map