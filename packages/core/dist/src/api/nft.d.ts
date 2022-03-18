import type { EthRioStays } from 'stays-smart-contracts';
import type { StayToken } from '../types';
export declare const getTokensOfOwner: (contract: EthRioStays, owner: string) => Promise<string[]>;
export declare const getToken: (contract: EthRioStays, tokenId: string) => Promise<StayToken>;
