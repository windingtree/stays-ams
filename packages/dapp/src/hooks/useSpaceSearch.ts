import { useState, useEffect } from 'react';
import Logger from '../utils/logger';
import { useAppState } from '../store';
import { LodgingFacility, Space } from 'stays-data-models';
import { useSpaceAvailability } from './useSpaceAvailability';
import { json } from 'stream/consumers';

// Initialize logger
const logger = Logger('useSpaceSearch');

export type UseSpaceSearchHook = [
  spaces: Space[],
  isLoading: boolean,
  error: string | undefined
];

// useSpaceSearch react hook
export const useSpaceSearch = (
  startDay: number,
  numberOfDays: number
): UseSpaceSearchHook => {
  const { lodgingFacilities } = useAppState();
  const [cb, isReady] = useSpaceAvailability();

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    if (!isReady) {
      return
    }

    const getSpacesAvelability = async () => {
      try {
        const facilies: LodgingFacility[] = JSON.parse(JSON.stringify(lodgingFacilities))
        const spaces = facilies.reduce(
          (previousValue, currentValue) => [...previousValue, ...currentValue.spaces as Space[]],
          [] as Space[]
        );
        const newSpaces = await Promise.all(
          spaces.map(
            async space => {
              const availability = await cb(space.spaceId, startDay, numberOfDays)
              return {
                ...space,
                available: Math.min(...availability)
              }
            }
          )
        );
        setSpaces(newSpaces)
        setLoading(false);

      } catch (error) {
        setLoading(false);
        if (error) {
          logger.error(error);
          setError((error as Error).message);
        } else {
          logger.error('Unknown error');
        }
      }
    };

    getSpacesAvelability();
  }, [lodgingFacilities, isReady]);

  return [
    spaces,
    loading,
    error
  ];
};
