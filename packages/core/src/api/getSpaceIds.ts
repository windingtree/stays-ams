import type { Stays } from 'stays-smart-contracts';

// Get spaces Ids
export const getSpaceIds = (
  contract: Stays,
  lodgingFacilityId: string,
  active = true
): Promise<string[]> => active
  ? contract.getActiveSpaceIdsByFacilityId(lodgingFacilityId)
  : contract.getSpaceIdsByFacilityId(lodgingFacilityId);
