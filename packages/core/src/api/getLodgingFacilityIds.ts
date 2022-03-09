import type { EthRioStays } from 'stays-smart-contracts';

// Get facilities Ids
export const getLodgingFacilityIds = (
  contract: EthRioStays,
  active = true
): Promise<string[]> => active
  ? contract.getActiveLodgingFacilityIds()
  : contract.getAllLodgingFacilityIds();