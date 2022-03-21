import { useContract } from './useContract';
import { useAppState } from '../store';
import { useCallback, useState, useEffect } from 'react';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useSpaceAvailability');

export type UseSpaceAvailabilityHook = [
  cb: (
    spaceId: string,
    startDay: number,
    numberOfDays: number
  ) => Promise<number[] | null>,
  isReady: boolean
];

// This hook provides a callback function for getting a space availability
export const useSpaceAvailability = (): UseSpaceAvailabilityHook => {
  const { rpcProvider, ipfsNode } = useAppState();
  const [contract] = useContract(rpcProvider, ipfsNode);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(!!contract);
  }, [contract]);

  const cb = useCallback(async (
    spaceId: string,
    startDay: number,
    numberOfDays: number
  ): Promise<number[] | null> => {
    try {
      if (!contract) {
        throw new Error('Contract is not connected');
      }
      return contract.getAvailability(spaceId, startDay, numberOfDays);

    } catch (error) {
      logger.error(error);
      return null;
    }
  }, [contract]);

  return [cb, isReady];
};
