import type { Stays } from 'stays-smart-contracts';
import { BigNumber } from "ethers";
export declare const getNewBookingsTokenIds: (contract: Stays, fromBlock: number) => Promise<BigNumber[]>;
