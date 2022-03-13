import type { BigNumber } from 'ethers';
import type { EthRioStays } from 'stays-smart-contracts';
import type { StayToken, TokenData } from '../types';
import { decodeDataUri } from '../utils/dataUri';

// Get NFT of the owner
export const getTokensOfOwner = async (
  contract: EthRioStays,
  owner: string
): Promise<BigNumber[]> => {
  const balance = await contract.balanceOf(owner);

  let tokens: BigNumber[] = [];

  for (let i = 0; i < balance.toNumber(); i++) {
    const token = await contract.tokenOfOwnerByIndex(owner, i);
    tokens.push(token);
  }

  return tokens;
};

export const getToken = async (
  contract: EthRioStays,
  tokenId: BigNumber
): Promise<StayToken> => {
  const owner = await contract.ownerOf(tokenId);
  const tokenUri = await contract.tokenURI(tokenId);
  const data = decodeDataUri(tokenUri) as TokenData;

  return {
    tokenId,
    owner,
    tokenUri,
    data
  };
};