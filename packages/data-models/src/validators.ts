import type {
  LegalEntityReference,
  OrganizationalUnitReference
} from '@windingtree/org.json-schema/types/org.json';
import { object } from '@windingtree/org.id-utils';
import { spaceSchema, lodgingFacilitySchema } from './schemas';

export const validateSpaceData = (spaceData: OrganizationalUnitReference) => {
  const validationResult = object.validateWithSchemaOrRef(
    spaceSchema,
    '',
    spaceData
  );

  if (validationResult !== null) {
    throw new Error(
      `Validation error: ${validationResult}`
    );
  }
};

export const validateLodgingFacilityData = (lodgingFacility: LegalEntityReference) => {
  const validationResult = object.validateWithSchemaOrRef(
    lodgingFacilitySchema,
    '',
    lodgingFacility
  );

  if (validationResult !== null) {
    throw new Error(
      `Validation error: ${validationResult}`
    );
  }
};
