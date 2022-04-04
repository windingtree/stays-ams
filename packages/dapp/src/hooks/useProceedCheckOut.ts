import type { providers } from 'ethers';
import type { IPFS } from '@windingtree/ipfs-apis';
import { useState, useEffect, useCallback } from 'react';
import { useContract } from './useContract';
import Logger from '../utils/logger';
import { TxHashCallbackFn } from 'stays-core/dist/src/utils/sendHelper';
import { DateTime } from 'luxon';

// Initialize logger
const logger = Logger('useProceedCheckOut');

export type UseProceedCheckOut = [
  checkOut: (
    tokenId: string,
    checkOutDate: DateTime,
    transactionHashCb?: TxHashCallbackFn
  ) => void,
  isReady: boolean,
  loading: boolean,
  error: string | undefined,
];

// useProceedCheckOut react hook
export const useProceedCheckOut = (
  account: string | undefined,
  provider: providers.JsonRpcProvider | undefined,
  ipfsNode: IPFS | undefined,
): UseProceedCheckOut => {
  const [contract, , contractError] = useContract(provider, ipfsNode);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (contractError) {
      setError(contractError);
    }
  }, [contractError]);

  useEffect(() => {
    if (!!contract) {
      setIsReady(true);
    }
  }, [contract]);

  const checkOut = useCallback(
    async (tokenId: string, checkOutDate: DateTime, transactionHashCb?: TxHashCallbackFn) => {
      setLoading(true)
      // console.log(contract, account)
      if (!contract || !account || !tokenId) {
        return;
      }
      const now = DateTime.now()
      if (now.toMillis() < checkOutDate.toMillis()) {
        throw new Error(`Checkout not available yet (check out date: ${checkOutDate.toLocaleString()} )`)
      }
      setError(undefined);

      try {
        await contract.checkOut(tokenId, undefined, transactionHashCb);
        setLoading(false)
      } catch (error) {
        logger.error(error);
        const message = (error as Error).message || 'Unknown useProceedCheckOut out error'
        setError(message);
        setLoading(false)
      }
    },
    [contract, account]
  );

  return [checkOut, isReady, loading, error];
};
