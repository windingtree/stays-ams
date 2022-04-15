import { useState, useEffect } from 'react';
import Logger from '../utils/logger';
import { useAppDispatch, useAppState } from '../store';
import { LodgingFacility, Space } from 'stays-data-models';
import { useSpaceAvailability } from './useSpaceAvailability';
import { SpaceRecord } from '../store/actions';

// Initialize logger
const logger = Logger('useSpaceSearch');

export type UseSpaceSearchHook = [
  isLoading: boolean,
  isNoResults: boolean,
  error: string | undefined
];

// useSpaceSearch react hook
export const useSpaceSearch = (
  startDay: number,
  numberOfDays: number,
  roomsNumber: number
): UseSpaceSearchHook => {
  console.log("useSpaceSearch :: start")

  const dispatch = useAppDispatch();
  const { lodgingFacilities, searchTimestamp, searchParams } = useAppState();
  const [cb, isReady] = useSpaceAvailability();
  const [loading, setLoading] = useState<boolean>(false);
  const [isNoResults, setIsNoResults] = useState(false);
  const [error, setError] = useState<string | undefined>();

  console.log("useSpaceSearch :: before useEffect")

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    setIsNoResults(false);

    if (!isReady) {
      return;
    }

    if (!!searchParams && searchParams.roomsNumber !== roomsNumber) {
      dispatch({
        type: 'SET_SEARCH_PARAMS',
        payload: {
          ...searchParams,
          roomsNumber
        }
      });
    }

    if (
      searchParams !== undefined &&
      searchTimestamp !== undefined &&
      searchTimestamp + 5 * 60 > Date.now() / 1000 &&
      searchParams.numberOfDays === numberOfDays &&
      searchParams.startDay === startDay
    ) {
      setLoading(false);
      return;
    }

    if (startDay < 0) {
      setLoading(false);
      setError('Not valid date')
      return;
    }

    dispatch({
      type: 'RESET_RECORD',
      payload: {
        name: 'searchSpaces'
      }
    });

    const getSpacesAvailability = async () => {
      try {
        const facilities: LodgingFacility[] = JSON.parse(JSON.stringify(lodgingFacilities))
        const spaces = facilities.reduce(
          (previousValue, currentValue) => [...previousValue, ...currentValue.spaces as Space[]],
          [] as Space[]
        );
        let newSpaces = await Promise.all(
          spaces.map(
            async space => {
              try {
                logger.debug('Fetch availability for:', space.contractData.spaceId);
                const availability = await cb(space.contractData.spaceId, startDay, numberOfDays)
                logger.debug('Availability for:', space.contractData.spaceId, availability);
                return {
                  ...space,
                  available: availability === null ? availability : Math.min(...availability)
                }
              } catch (err) {
                logger.error(err);
                logger.debug('Failed to get availability for:', space.contractData.spaceId);
                return null;
              }
            }
          )
        );
        newSpaces = newSpaces.filter(s => s !== null);

        if (newSpaces.length === 0) {
          setIsNoResults(true);
        }

        // Add all obtained records to state
        for (const record of newSpaces as SpaceRecord[]) {
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
          payload: Date.now() / 1000
        });
        dispatch({
          type: 'SET_SEARCH_PARAMS',
          payload: {
            startDay,
            numberOfDays,
            roomsNumber
          }
        });

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

    getSpacesAvailability();
  }, [lodgingFacilities, isReady, cb, dispatch, numberOfDays, startDay, searchParams, searchTimestamp, roomsNumber]);

  console.log("useSpaceSearch :: end")

  return [
    loading,
    isNoResults,
    error
  ];
};
