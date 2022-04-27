import type { Stays } from 'stays-smart-contracts';
import {BigNumber} from "ethers";

export const getNewBookingsTokenIds = async (
  contract: Stays,
  fromBlock: number
) => {
  const tokens = new Set<BigNumber>();
  const staysCreatedFilter = contract.filters.NewStay();

  const stayCreated = await contract.queryFilter(
    staysCreatedFilter,
    fromBlock,
    'latest'
  );

  stayCreated.map(
    s => {
      tokens.add(s.args.tokenId);
    }
  );

  return Array.from(tokens);
};
