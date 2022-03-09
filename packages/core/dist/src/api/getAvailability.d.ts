import type { EthRioStays } from 'stays-smart-contracts';
export declare const getAvailability: (contract: EthRioStays, spaceId: string, startDay: number, numberOfDays: number) => Promise<number[]>;
