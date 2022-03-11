import type { Action, State } from './actions';

import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('facilityManagerReducer');

export const facilityManagerReducer = (state: State, action: Action): State => {
  const type = action.type;

  try {
    switch (type) {
      // case '<ACTION>':
      //   return {
      //     ...state,
      //     <STATE_PROP>: action.payload
      //   };
      default:
        return state;
    }
  } catch(error) {
    logger.error((error as Error).message || 'Unknown state reducer error');
    return state;
  }
};