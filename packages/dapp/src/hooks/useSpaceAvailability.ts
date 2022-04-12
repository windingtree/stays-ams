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
  console.log("useSpaceAvailability :: start")

  const { rpcProvider, ipfsNode } = useAppState();
  const [contract] = useContract(rpcProvider, ipfsNode, false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (contract && contract.address) {
      setIsReady(true);
      console.log("useSpaceAvailability :: isReady === true")
    }
  }, [contract]);

  const cb = useCallback(async (
    spaceId: string,
    startDay: number,
    numberOfDays: number
  ): Promise<number[] | null> => {
    try {
      if (!isReady || !contract) {
        console.log("useSpaceAvailability :: contract not connected")
        throw new Error('Contract is not connected');
      }

      console.log("useSpaceAvailability :: trying to get availability")
      return contract.getAvailability(spaceId, startDay, numberOfDays);
    } catch (error) {
      console.log("useSpaceAvailability :: some error")
      logger.error(error);

      return null;
    }
  }, [contract, isReady]);

  console.log("useSpaceAvailability :: end")

  return [cb, isReady];
};
