"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lodgingFacilitySchema = exports.SpacesReference = exports.spaceSchema = void 0;
const org_json_schema_1 = require("@windingtree/org.json-schema");
exports.spaceSchema = {
    '$id': 'spaceSchema.json',
    title: 'Space Schema',
    allOf: [
        {
            '$ref': '#/definitions/OrganizationalUnitReference'
        }
    ],
    definitions: Object.assign({}, org_json_schema_1.org.definitions)
};
exports.SpacesReference = {
    description: 'Spaces',
    type: 'object',
    required: [
        'spaces'
    ],
    properties: {
        spaces: {
            description: 'List of ledger facility spaces',
            type: 'array',
            items: {
                allOf: exports.spaceSchema.allOf
            }
        }
    }
};
exports.lodgingFacilitySchema = {
    '$id': 'lodgingFacilitySchema.json',
    title: 'Lodging Facility Schema',
    allOf: [
        {
            '$ref': '#/definitions/LegalEntityReference'
        },
        {
            '$ref': '#/definitions/SpacesReference'
        }
    ],
    definitions: Object.assign(Object.assign({}, org_json_schema_1.org.definitions), { SpacesReference: exports.SpacesReference })
};
//# sourceMappingURL=schemas.js.map