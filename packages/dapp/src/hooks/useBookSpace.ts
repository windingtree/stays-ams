import type { MethodOverrides, TxHashCallbackFn } from 'stays-core/dist/src/utils/sendHelper';
import { useCallback, useState, useEffect } from 'react';
import { useContract } from './useContract';
import { useAppState } from '../store';
import Logger from '../utils/logger';

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
  ) => Promise<string | null>,
  isReady: boolean,
  error: string | undefined
];

// This hook provides a callback function for booking space
export const useBookSpace = (): UseBookSpaceHook => {
  const { provider, ipfsNode } = useAppState();
  const [contract,, errorContract] = useContract(provider, ipfsNode);
  const [error, setError] = useState<string | undefined>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setError(errorContract);
  }, [errorContract]);

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
  ): Promise<string | null> => {
    try {

      if (!contract) {
        throw new Error('Contract is not connected');
      }

      setError(undefined);

      console.log(
        spaceId,
        startDay,
        numberOfDays,
        quantity
      );

      // console.log('@@@@@@@@', (contract.provider as any).getSigner());

      return contract.book(
        spaceId,
        startDay,
        numberOfDays,
        quantity,
        overrides,
        transactionHashCb,
        confirmations
      );
    } catch (error) {
      logger.error(error);
      return null
    }
  }, [contract]);

  return [cb, isReady, error];
};
