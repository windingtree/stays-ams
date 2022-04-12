import type { providers } from 'ethers';
import type { IPFS } from '@windingtree/ipfs-apis';
import { useState, useCallback, useEffect } from 'react';
import { DateTime } from 'luxon';
import { useContract } from './useContract';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useDayZeroDate');

export type UseDayZeroHook = [
  getDate: ((days: number) => DateTime) | undefined,
  error: string | undefined
];

export const useDayZeroDate = (
  provider: providers.JsonRpcProvider | undefined,
  ipfsNode: IPFS | undefined
): UseDayZeroHook => {
  const [contract,,] = useContract(provider, ipfsNode);
  const [getDate, setGetDate] = useState<((days: number) => DateTime) | undefined>();
  const [error, setError] = useState<string | undefined>();

  const getDayZero = useCallback(
    async () => {
      if (!contract) {
        setGetDate(undefined);
        setError(undefined);
        return;
      }
      try {
        setError(undefined);
        logger.debug('getDayZero start');
        const dz = await contract.getDayZero();
        logger.debug('getDayZero', dz);
        setGetDate(() => (days: number) => {
          const cleanZero = DateTime.fromMillis(dz * 1000).set({ hour: 1 })
          logger.debug('getDate params', cleanZero, days);
          return DateTime.fromMillis(
            cleanZero.toMillis() + days * 86400 * 1000
          )
        });
      } catch (err) {
        logger.error(err);
        const message = (err as Error).message || 'Unknown useDayZeroDate error';
        setGetDate(undefined);
        setError(message);
      }
    },
    [contract]
  );

  useEffect(
    () => {
      getDayZero();
      return () => {
        setGetDate(undefined);
      }
    },
    [getDayZero]
  );

  return [
    getDate,
    error
  ];
};
