import type { Stays } from 'stays-smart-contracts';
import type { StayTokenState } from '../types';
export declare const getTokensBySpaceId: (contract: Stays, spaceId: string, state: StayTokenState) => Promise<string[]>;
