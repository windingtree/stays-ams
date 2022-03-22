import type { EthRioStays } from 'stays-smart-contracts';

// Get facilities Ids
export const getDayZero = (
  contract: EthRioStays
): Promise<number> => contract.dayZero();
