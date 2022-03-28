import type { Stays } from 'stays-smart-contracts';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
export declare const book: (contract: Stays, spaceId: string, startDay: number, numberOfDays: number, quantity: number, overrides?: MethodOverrides | undefined, transactionHashCb?: TxHashCallbackFn | undefined, confirmations?: number) => Promise<string>;
