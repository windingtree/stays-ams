import {useContract} from "./useContract";
import {useAppState} from "../store";
import {useCallback, useState, useEffect} from "react";

export const useSpaceAvailability = () => {
  const {provider, ipfsNode, networkId} = useAppState();
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
