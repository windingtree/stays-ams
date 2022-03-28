import type { Stays } from 'stays-smart-contracts';
import type { ContractReceipt, Signer, CallOverrides, PayableOverrides } from 'ethers';
import { providers } from 'ethers';
export declare type MethodOverrides = CallOverrides | PayableOverrides;
export declare type TxHashCallbackFn = (txHash: string) => void;
export declare const sendHelper: (contract: Stays, method: string, args: unknown[], sender?: Signer | providers.JsonRpcSigner | undefined, overrides?: MethodOverrides | undefined, transactionHashCb?: TxHashCallbackFn | undefined, confirmations?: number) => Promise<ContractReceipt>;
