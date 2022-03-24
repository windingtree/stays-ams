import type { Stays } from 'stays-smart-contracts';

// Get facilities Ids
export const getDayZero = (
  contract: Stays
): Promise<number> => contract.dayZero();
