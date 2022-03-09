import type { EthRioStays } from 'stays-smart-contracts';

// Get space availability
export const getAvailability = (
  contract: EthRioStays,
  spaceId: string,
  startDay: number,
  numberOfDays: number
): Promise<number[]> =>
  contract.getAvailability(
    spaceId,
    startDay,
    numberOfDays
  );