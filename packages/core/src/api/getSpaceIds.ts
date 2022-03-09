import type { EthRioStays } from 'stays-smart-contracts';

// Get spaces Ids
export const getSpaceIds = (
  contract: EthRioStays,
  lodgingFacilityId: string,
  active = true
): Promise<string[]> => active
  ? contract.getActiveSpaceIdsByFacilityId(lodgingFacilityId)
  : contract.getSpaceIdsByFacilityId(lodgingFacilityId);