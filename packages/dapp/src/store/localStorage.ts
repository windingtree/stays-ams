import type { Action, State } from './actions';
import { getDappMode } from '../config';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('localStorage connector');

// Constants
export const UNKNOWN_LOCAL_STORAGE_ERROR = 'Unknown localStorage error';
export const storagePropertyName = 'dappStore';

export interface LocalStorageConnectorConfig {
  properties: string[];
}

export const storageConnectorConfig: LocalStorageConnectorConfig = {
  properties: [
    'themeMode',
    'bootstrapped',
    'lodgingFacilities',
    'searchSpaces',
    'searchTimestamp',
  ]
};

export type StoredStateProps = typeof storageConnectorConfig.properties[number];

export type StoredState = Pick<State, StoredStateProps>;

export type TransformCallback = <T extends unknown>(serializedState: string) => T;

// Stringifies objects with circular dependencies
// @todo Move this helper to the SDK
export const safeObjectStringify = (obj: {}, indent?: number): string => {
  let cache = new Set();

  return JSON.stringify(
    obj,
    (_, value: unknown) => {

      if (value instanceof Error) {
        return Object
          .getOwnPropertyNames(value)
          .reduce<Record<string, unknown>>(
            (a, v) => ({
              ...a,
              [v]: (value as any)[v]
            }),
            {}
          );
      }

      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return;
        }
        cache.add(value);
      }

      return value;
    },
    indent ? indent : undefined
  );
};

// Transformation function template
export const defaultTransform = (serializedState: string) => serializedState;

// Extracts selected properties into a new object
export const selectedState = (state: State): StoredState =>
  storageConnectorConfig
    .properties
    .reduce<StoredState>(
      (a, v) => ({
        ...a,
        [v]: state[v]
      }),
      {}
    );

// Return stored sate
export const getState = (transform?: TransformCallback): StoredState => {
  const storage = getDappMode() === 'development'
    ? sessionStorage
    : localStorage;
  try {
    let serializedState = storage.getItem(storagePropertyName);

    if (serializedState === null) {
      // storage not initialized yet
      const emptyStorage = safeObjectStringify({});
      storage.setItem(storagePropertyName, emptyStorage);
      serializedState = emptyStorage;
    }

    serializedState = transform
      ? transform<string>(serializedState)
      : serializedState;

    return JSON.parse(serializedState);
  } catch (error) {
    logger.error(error);
    throw new Error(
      `Unable to get stored state due to error: ${(error as Error).message || UNKNOWN_LOCAL_STORAGE_ERROR}`
    );
  }
};

// Saves state to localStorage
export const setState = (
  state: StoredState,
  transform?: TransformCallback
): void => {
  try {
    const serializedState = safeObjectStringify(state);
    localStorage.setItem(
      storagePropertyName,
      transform ? transform<string>(serializedState) : serializedState
    );
  } catch (error) {
    logger.error(error);
    throw new Error(
      `Unable to store state due to error: ${(error as Error).message || UNKNOWN_LOCAL_STORAGE_ERROR}`
    );
  }
};

// Returns combined reducer
export const storageReducer = (transform?: TransformCallback) =>
  (state: State, _: Action): State => {
    const stateToStore = selectedState(state);
    setState(stateToStore, transform);
    return state;
  };
