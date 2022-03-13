import { useContract } from './useContract';
import { useAppState } from '../store';
import { useCallback, useState, useEffect } from 'react';

export type UseSpaceAvailabilityHook = [
  cb: (
    spaceId: string,
    startDay: number,
    numberOfDays: number
  ) => Promise<number[]>,
  isReady: boolean
];

// This hook provides a callback function for getting a space availability
export const useSpaceAvailability = (): UseSpaceAvailabilityHook => {
  const { provider, ipfsNode, networkId } = useAppState();
  const [contract] = useContract(provider, ipfsNode, networkId);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(!!contract);
  }, [contract]);

  const cb = useCallback(async (
    spaceId: string,
    startDay: number,
    numberOfDays: number
  ): Promise<number[]> => {
    if (!contract) {
      return [];
    }

    return contract.getAvailability(spaceId, startDay, numberOfDays);
  }, [contract]);

  return [cb, isReady];
};
