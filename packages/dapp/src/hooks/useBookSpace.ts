import { useContract } from './useContract';
import { useAppState } from '../store';
import { useCallback, useState, useEffect } from 'react';
import Logger from '../utils/logger';
import { BigNumber } from 'ethers';
import { MethodOverrides, TxHashCallbackFn } from 'stays-core/dist/src/utils/sendHelper';

// Initialize logger
const logger = Logger('useBookSpace');

export type UseBookSpaceHook = [
  cb: (
    spaceId: string,
    startDay: number,
    numberOfDays: number,
    quantity: number,
    overrides?: MethodOverrides,
    transactionHashCb?: TxHashCallbackFn,
    confirmations?: number
  ) => Promise<BigNumber | null>,
  isReady: boolean
];

// This hook provides a callback function for booking space
export const useBookSpace = (): UseBookSpaceHook => {
  const { rpcProvider, ipfsNode } = useAppState();
  const [contract] = useContract(rpcProvider, ipfsNode);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(!!contract);
  }, [contract]);

  const cb = useCallback(async (
    spaceId: string,
    startDay: number,
    numberOfDays: number,
    quantity: number,
    overrides?: MethodOverrides,
    transactionHashCb?: TxHashCallbackFn,
    confirmations?: number
  ): Promise<BigNumber | null> => {
    try {

      if (!contract) {
        throw new Error('Contract is not connected');
      }
      // const order = {
      //   spaceId,
      //   startDay,
      //   numberOfDays,
      //   quantity,
      //   overrides: undefined,
      //   transactionHashCb: undefined,
      //   confirmations: undefined
      // }
      console.log( spaceId,
        startDay,
        numberOfDays,
        quantity)
      return contract.book(
        spaceId,
        startDay,
        numberOfDays,
        quantity,
        undefined,
        undefined,
        undefined
      );
    } catch (error) {
      logger.error(error);
      return null
    }
  }, [contract]);

  return [cb, isReady];
};
