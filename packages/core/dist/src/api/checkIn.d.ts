import type { Stays, StaysVoucher } from 'stays-smart-contracts';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
export declare const checkIn: (contract: Stays, tokenId: string, voucher: StaysVoucher, overrides?: MethodOverrides | undefined, transactionHashCb?: TxHashCallbackFn | undefined, confirmations?: number) => Promise<void>;
