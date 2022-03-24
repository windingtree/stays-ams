import type { Stays } from 'stays-smart-contracts';
export declare const getAvailability: (contract: Stays, spaceId: string, startDay: number, numberOfDays: number) => Promise<number[]>;
