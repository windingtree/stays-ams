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
  numberOfDays: number,
  timestamp: number
): UseSpaceSearchHook => {
  const dispatch = useAppDispatch();
  const { lodgingFacilities, searchTimestamp } = useAppState();
  const [cb, isReady] = useSpaceAvailability();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    // @todo fix timestamp currently not connected
    // if (searchTimestamp === timestamp && (timestamp ?? 0) + 5 * 60 * 60 > Date.now()) {
    //   setLoading(false);
    //   return
    // }

    dispatch({
      type: 'RESET_RECORD',
      payload: {
        name: 'searchSpaces'
      }
    });

    if (!isReady) {
      return
    }

    const getSpacesAvailability = async () => {
      try {
        const facilities: LodgingFacility[] = JSON.parse(JSON.stringify(lodgingFacilities))
        const spaces = facilities.reduce(
          (previousValue, currentValue) => [...previousValue, ...currentValue.spaces as Space[]],
          [] as Space[]
        );
        const newSpaces = await Promise.all(
          spaces.map(
            async space => {
              const availability = await cb(space.contractData.spaceId, startDay, numberOfDays)
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
              name: 'searchSpaces',
              record: {
                ...record,
                id: record.contractData.spaceId
              }
            }
          });
        }
        //Set timestamp to storage
        dispatch({
          type: 'SET_AVAILABILITY_TIMESTAMP',
          payload: Date.now() / 1000 | 0
        });

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

    getSpacesAvailability();
  }, [lodgingFacilities, isReady, cb, dispatch, numberOfDays, startDay]);

  return [
    loading,
    error
  ];
};
