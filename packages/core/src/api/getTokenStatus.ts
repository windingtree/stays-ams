import type { Stays } from 'stays-smart-contracts';
import { getToken } from './nft';

// Check in
export const getTokenStatus = async (
  contract: Stays,
  tokenId: string
): Promise<string> => {
  const token = await getToken(contract, tokenId);
  const spaceId = token.data.attributes?.find(
    a => a.trait_type === 'spaceId'
  );

  if (!spaceId) {
    throw new Error(
      'Unable to get space Id from the token metadata'
    );
  }

  const statuses = [
    'booked',
    'checked-in',
    'checked-out'
  ];

  const status = await contract.depositState(
    token.owner,
    spaceId.value,
    tokenId
  );

  return statuses[status];
};
