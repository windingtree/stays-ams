import type { Reducer } from 'react';
import type { Action, State } from './actions';
import { useReducer } from 'react';
import { ThemeMode } from '../components/SwitchThemeMode';
import { recordsReducer } from './recordsReducer';
import { facilityManagerReducer } from './facilityManagerReducer';
import { getState, storageReducer } from './localStorage';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('Reducer');

export const mainReducer = (state: State, action: Action): State => {
  logger.debug('Dispatch', action);
  const type = action.type;

  try {
    switch (type) {
      case 'SET_CONNECTING':
        return {
          ...state,
          isConnecting: action.payload
        };
      case 'SET_ACCOUNT':
        return {
          ...state,
          account: action.payload
        };
      case 'SET_IS_RIGHT_NETWORK':
        return {
          ...state,
          isRightNetwork: action.payload
        };
      case 'SET_THEME_MODE':
        return {
          ...state,
          themeMode: action.payload
        };
      case 'SET_NETWORK_ID':
        return {
          ...state,
          networkId: action.payload
        };
      case 'SET_PROVIDER':
        return {
          ...state,
          provider: action.payload
        };
      case 'SET_INJECTED_PROVIDER':
        return {
          ...state,
          injectedProvider: action.payload
        };
      case 'SET_RPC_PROVIDER':
        return {
          ...state,
          rpcProvider: action.payload
        };
      case 'SET_WEB3MODAL_FUNCTIONS':
        return {
          ...state,
          signIn: action.payload.signIn,
          signOut: action.payload.signOut
        };
      case 'SET_BOOTSTRAP_LOADING':
        return {
          ...state,
          isBootstrapLoading: action.payload
        };
      case 'SET_BOOTSTRAPPED':
        return {
          ...state,
          bootstrapped: action.payload
        };
      case 'SET_IPFS_NODE_CONNECTING':
        return {
          ...state,
          isIpfsNodeConnecting: action.payload
        };
      case 'SET_IPFS_NODE':
        return {
          ...state,
          ipfsNode: action.payload.ipfsNode,
          startIpfsNode: action.payload.startIpfsNode,
          stopIpfsNode: action.payload.stopIpfsNode
        };
      case 'ERROR_ADD':
        return {
          ...state,
          errors: [
            ...state.errors,
            action.payload
          ]
        };
      case 'ERROR_REMOVE':
        return {
          ...state,
          errors: state.errors.filter((e, i) => i !== action.payload)
        };
      case 'ERROR_REMOVE_ALL':
        return {
          ...state,
          errors: []
        };
      default:
        return state;
    }
  } catch(error) {
    logger.error((error as Error).message || 'Unknown state reducer error');
    return state;
  }
};

const initialState: State = {
  isConnecting: false,
  isRightNetwork: true,
  isIpfsNodeConnecting: false,
  signIn: () => {},
  signOut: () => {},
  errors: [],
  themeMode:ThemeMode.light,
  startIpfsNode: () => {},
  stopIpfsNode: () => {},
  isBootstrapLoading: false,
  lodgingFacilities: []
};

export const combineReducers = (
  reducers: Reducer<State, Action>[]
): Reducer<State, Action> =>
  (state: State, action: Action): State => {
    let updatedState = state;

    for (const reducer of reducers) {
      updatedState = reducer(updatedState, action);
    }

    return updatedState;
  };

export const useAppReducer = () => {
  const storedState = getState(); // Restoration of the Dapp state

  return useReducer(
    combineReducers(
      [
        mainReducer,
        recordsReducer,
        facilityManagerReducer,
        storageReducer() // Always must be the last
      ]
    ),
    {
      ...initialState,
      ...storedState
    }
  );
};
