import type { Stays } from 'stays-smart-contracts';

// Get facilities Ids
export const getLodgingFacilityIds = (
  contract: Stays,
  active = true
): Promise<string[]> => active
  ? contract.getActiveLodgingFacilityIds()
  : contract.getAllLodgingFacilityIds();
