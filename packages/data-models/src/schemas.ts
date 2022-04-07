import type { AnySchema } from '@windingtree/org.id-utils/dist/object';
import { org } from '@windingtree/org.json-schema';
import {
  allowedLodgingFacilityTypes,
  allowedLodgingFacilityTiers,
  allowedSpaceTypes
} from './enum';

export const AmenityReference: AnySchema = {
  description: 'Amenity',
  type: 'string'
};

export const spaceSchema: AnySchema = {
  '$id': 'spaceSchema.json',
  title: 'Space Schema',
  allOf: [
    {
      '$ref': '#/definitions/SpaceReference'
    }
  ],
  definitions: {
    ...org.definitions,
    AmenityReference,
    SpaceReference: {
      description: 'Space',
      type: 'object',
      required: [
        'name',
        'description',
        'type',
        'capacity',
        'guestsNumber',
        'beds',
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
          enum: allowedSpaceTypes
        },
        amenities: {
          description: 'Short list of room amenities',
          type: 'array',
          items: {
            'allOf': [
              {
                  '$ref': '#/definitions/AmenityReference'
              }
            ]
          }
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
    }
  }
};

export const SpacesReference: AnySchema = {
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
        allOf: spaceSchema.allOf
      }
    }
  }
};

const FacilityContactReference: AnySchema = {
  description: 'Facility Contact',
  type: 'object',
  required: [
    'name',
    'phone',
    'email',
    'website'
  ],
  properties: {
    name: {
      description: 'Contact person or department name',
      type: 'string'
    },
    phone: {
      description: 'Phone number',
      type: 'string'
    },
    email: {
      description: 'Email',
      type: 'string',
      format: 'email'
    },
    website: {
      description: 'Contact website',
      type: 'string'
    },
    messengers: {
      description: 'Messenger accounts',
      type: 'array',
      items: {
        'allOf': [
          {
              '$ref': '#/definitions/MessengerReference'
          }
        ]
      }
    }
  }
};

export const lodgingFacilitySchema: AnySchema = {
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
  definitions: {
    ...org.definitions,
    ...spaceSchema.definitions,
    AmenityReference,
    SpacesReference,
    FacilityContactReference,
    OperatorReference: {
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
    },
    LodgingFacilityReference: {
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
          enum: allowedLodgingFacilityTypes
        },
        tier: {
          description: 'A lodging facility tier',
          example: 'decent',
          type: 'string',
          enum: allowedLodgingFacilityTiers
        },
        amenities: {
          description: 'Short list of a facility amenities',
          type: 'array',
          items: {
            'allOf': [
              {
                  '$ref': '#/definitions/AmenityReference'
              }
            ]
          }
        },
        contact: {
          $ref: '#/definitions/FacilityContactReference'
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
    }
  }
};
