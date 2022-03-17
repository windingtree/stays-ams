import type {
  LodgingFacilityRaw,
  SpaceRaw
} from './types';
import { object } from '@windingtree/org.id-utils';
import { spaceSchema, lodgingFacilitySchema } from './schemas';

export const validateSpaceData = (spaceData: SpaceRaw) => {
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

export const validateLodgingFacilityData = (lodgingFacility: LodgingFacilityRaw) => {
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
