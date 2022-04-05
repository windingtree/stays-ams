"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lodgingFacilitySchema = exports.SpacesReference = exports.spaceSchema = void 0;
const org_json_schema_1 = require("@windingtree/org.json-schema");
const enum_1 = require("./enum");
exports.spaceSchema = {
    '$id': 'spaceSchema.json',
    title: 'Space Schema',
    allOf: [
        {
            '$ref': '#/definitions/SpaceReference'
        }
    ],
    definitions: Object.assign(Object.assign({}, org_json_schema_1.org.definitions), { SpaceReference: {
            description: 'Space',
            type: 'object',
            required: [
                'name',
                'description',
                'type',
                'capacity',
                'guestsNumber',
                'bedsNumber',
                'price',
                'media',
            ],
            properties: {
                name: {
                    description: 'A space name',
                    example: 'Two bed room',
                    type: 'string'
                },
                description: {
                    description: 'A detailed space description',
                    type: 'string'
                },
                type: {
                    description: 'A space type',
                    example: 'room',
                    type: 'string',
                    enum: enum_1.allowedSpaceTypes
                },
                capacity: {
                    description: 'A number of rooms of this type in the Lodging Facility',
                    example: 3,
                    type: 'number'
                },
                guestsNumber: {
                    description: 'Max Number of guests',
                    example: 2,
                    type: 'number'
                },
                beds: {
                    description: 'Number of beds',
                    example: 1,
                    type: 'number'
                },
                price: {
                    description: 'Price per Night',
                    example: 100,
                    type: 'string'
                },
                media: {
                    $ref: '#/definitions/MediaListReference'
                }
            }
        } })
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
            '$ref': '#/definitions/LodgingFacilityReference'
        },
        {
            '$ref': '#/definitions/SpacesReference'
        }
    ],
    definitions: Object.assign(Object.assign(Object.assign({}, org_json_schema_1.org.definitions), exports.spaceSchema.definitions), { SpacesReference: exports.SpacesReference, OperatorReference: {
            description: 'Lodging Facility operator',
            type: 'object',
            required: [
                'name',
                'address',
            ],
            properties: {
                name: {
                    description: 'A lodging facility name',
                    example: 'Brave hostel',
                    type: 'string'
                },
                address: {
                    $ref: '#/definitions/AddressReference'
                }
            }
        }, LodgingFacilityReference: {
            description: 'Lodging Facility',
            type: 'object',
            required: [
                'name',
                'description',
                'type',
                'tier',
                'address',
                'operator',
                'media'
            ],
            properties: {
                name: {
                    description: 'A lodging facility name',
                    example: 'Brave hostel',
                    type: 'string'
                },
                description: {
                    description: 'A detailed lodging facility description',
                    type: 'string'
                },
                type: {
                    description: 'A lodging facility type',
                    example: 'hostel',
                    type: 'string',
                    enum: enum_1.allowedLodgingFacilityTypes
                },
                tier: {
                    description: 'A lodging facility tier',
                    example: 'decent',
                    type: 'string',
                    enum: enum_1.allowedLodgingFacilityTiers
                },
                address: {
                    $ref: '#/definitions/AddressReference'
                },
                what3words: {
                    description: 'https://what3words.com',
                    example: 'sprinters.packers.importers',
                    type: 'string'
                },
                operator: {
                    $ref: '#/definitions/OperatorReference'
                },
                media: {
                    $ref: '#/definitions/MediaListReference'
                },
            }
        } })
};
//# sourceMappingURL=schemas.js.map