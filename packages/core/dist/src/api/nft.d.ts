import type { Stays } from 'stays-smart-contracts';
import type { StayToken } from '../types';
export declare const getTokensOfOwner: (contract: Stays, owner: string) => Promise<string[]>;
export declare const getToken: (contract: Stays, tokenId: string) => Promise<StayToken>;
