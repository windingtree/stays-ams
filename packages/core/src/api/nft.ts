import type { BigNumber } from 'ethers';
import type { Stays } from 'stays-smart-contracts';
import type { StayToken, TokenData } from '../types';
import { decodeDataUri } from '../utils/dataUri';

// Get NFT of the owner
export const getTokensOfOwner = async (
  contract: Stays,
  owner: string
): Promise<string[]> => {
  const balance = await contract.balanceOf(owner);

  let tokens: BigNumber[] = [];

  for (let i = 0; i < balance.toNumber(); i++) {
    const token = await contract.tokenOfOwnerByIndex(owner, i);
    tokens.push(token);
  }

  return tokens.map(t => t.toString());
};

export const getToken = async (
  contract: Stays,
  tokenId: string
): Promise<StayToken> => {
  const owner = await contract.ownerOf(tokenId);
  const tokenUri = await contract.tokenURI(tokenId);
  const data = decodeDataUri(tokenUri, true) as TokenData;

  return {
    tokenId,
    owner,
    tokenUri,
    data
  };
};
