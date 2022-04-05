import type { Action, State } from './actions';

import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('ownFacilitiesReducer');

export const ownFacilitiesReducer = (state: State, action: Action): State => {
  const type = action.type;

  try {
    switch (type) {
      case 'SET_OWN_FACILITIES':
        return {
          ...state,
          ownFacilities: action.payload,
          ownFacilitiesLoading: false,
          ownFacilitiesBootstrapped: true
        };
      case 'SET_OWN_FACILITIES_LOADING':
        return {
          ...state,
          ownFacilitiesLoading: action.payload
        };
      case 'RESET_OWN_FACILITIES':
        return {
          ...state,
          ownFacilities: [],
          ownFacilitiesLoading: false,
          ownFacilitiesBootstrapped: false,
        };
      default:
        return state;
    }
  } catch(error) {
    logger.error((error as Error).message || 'Unknown state reducer error');
    return state;
  }
};
