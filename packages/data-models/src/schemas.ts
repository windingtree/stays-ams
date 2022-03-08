import type { AnySchema } from '@windingtree/org.id-utils/dist/object';
import { org } from '@windingtree/org.json-schema';

export const spaceSchema: AnySchema = {
  '$id': 'spaceSchema.json',
  title: 'Space Schema',
  allOf: [
    {
      '$ref': '#/definitions/OrganizationalUnitReference'
    }
  ],
  definitions: {
    ...org.definitions
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

export const lodgingFacilitySchema: AnySchema = {
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
  definitions: {
    ...org.definitions,
    SpacesReference
  }
};
