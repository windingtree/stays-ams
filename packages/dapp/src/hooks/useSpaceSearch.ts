import { useState, useEffect } from 'react';
import Logger from '../utils/logger';
import { useAppDispatch, useAppState } from '../store';
import { LodgingFacility, Space } from 'stays-data-models';
import { useSpaceAvailability } from './useSpaceAvailability';

// Initialize logger
const logger = Logger('useSpaceSearch');

export type UseSpaceSearchHook = [
  isLoading: boolean,
  error: string | undefined
];

// useSpaceSearch react hook
export const useSpaceSearch = (
  startDay: number,
  numberOfDays: number
): UseSpaceSearchHook => {
  const dispatch = useAppDispatch();
  const { lodgingFacilities } = useAppState();
  const [cb, isReady] = useSpaceAvailability();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    if (!isReady) {
      return
    }

    dispatch({
      type: 'RESET_RECORD',
      payload: {
        name: 'spaces'
      }
    });

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
                available: availability === null ? availability : Math.min(...availability)
              }
            }
          )
        );
        setLoading(false);
        // Add all obtained records to state
        for (const record of newSpaces) {
          dispatch({
            type: 'SET_RECORD',
            payload: {
              name: 'spaces',
              record: {
                ...record,
                id: record.spaceId
              }
            }
          });
        }
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
  }, [lodgingFacilities, isReady, cb, dispatch, numberOfDays, startDay]);

  return [
    loading,
    error
  ];
};
