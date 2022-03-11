import type { Action, State, GenericStateRecord } from './actions';

import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('recordsReducer');

export const recordsReducer = (state: State, action: Action): State => {
  let records: GenericStateRecord[];
  const type = action.type;

  try {
    switch (type) {
      case 'SET_RECORD':
        if (!action.payload.name) {
          throw new Error(`State record name must be provided with a payload`);
        }
        if (typeof action.payload.record !== 'object') {
          throw new Error(`State record name must be provided with a payload`);
        }
        if (!action.payload.record.id) {
          throw new Error(`State record name must have Id property defined`);
        }
        // Add or update a record
        records = state[action.payload.name] as GenericStateRecord[];
        const knownRecord = records.filter(
          (r: GenericStateRecord) => r.id === action.payload.record.id
        )[0] || {};
        const restRecords = records.filter(
          (r: GenericStateRecord) => r.id !== action.payload.record.id
        );
        return {
          ...state,
          [action.payload.name]: [
            ...restRecords,
            ...[
              {
                ...knownRecord,
                ...action.payload.record
              }
            ]
          ]
        };
      case 'REMOVE_RECORD':
        if (!action.payload.name) {
          throw new Error(`State record name must be provided with a payload`);
        }
        if (!action.payload.id) {
          throw new Error(`State record Id must be provided with a payload`);
        }
        // Remove record
        records = state[action.payload.name] as GenericStateRecord[];
        return {
          ...state,
          [action.payload.name]: records.filter(
            (r: GenericStateRecord) => r.id !== action.payload.id
          )
        };
      case 'RESET_RECORD':
        if (!action.payload.name) {
          throw new Error(`State record name must be provided with a payload`);
        }
        return {
          ...state,
          [action.payload.name]: []
        };
      default:
        return state;
    }
  } catch(error) {
    logger.error((error as Error).message || 'Unknown state reducer error');
    return state;
  }
};