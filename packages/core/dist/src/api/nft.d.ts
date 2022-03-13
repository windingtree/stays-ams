import type { BigNumber } from 'ethers';
import type { EthRioStays } from 'stays-smart-contracts';
import type { StayToken } from '../types';
export declare const getTokensOfOwner: (contract: EthRioStays, owner: string) => Promise<BigNumber[]>;
export declare const getToken: (contract: EthRioStays, tokenId: BigNumber) => Promise<StayToken>;
