import type { Stays } from 'stays-smart-contracts';
import type { StayTokenState } from '../types';

// Get stay tokens Ids by spaceId Id and state
export const getTokensBySpaceId = async (
  contract: Stays,
  spaceId: string,
  state: StayTokenState
): Promise<string[]> => {
  const tokens = await contract.getTokensBySpaceId(spaceId, state);
  return tokens.map(t => t.toString());
};

