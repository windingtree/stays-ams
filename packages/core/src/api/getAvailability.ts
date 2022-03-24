import type { BigNumber } from 'ethers';
import type { Stays } from 'stays-smart-contracts';

// Get space availability
export const getAvailability = async (
  contract: Stays,
  spaceId: string,
  startDay: number,
  numberOfDays: number
): Promise<number[]> => {
  const availability = await contract.getAvailability(
    spaceId,
    startDay,
    numberOfDays
  );

  return availability.map(a => a.toNumber());
}
