import type { Stays } from 'stays-smart-contracts';

// Get facilities Ids by owner
export const getLodgingFacilityIdsByOwner = (
  contract: Stays,
  owner: string
): Promise<string[]> =>
  contract.getLodgingFacilityIdsByOwner(owner);
