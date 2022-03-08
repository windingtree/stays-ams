import { useEffect } from 'react';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('usePoller');

export type PollerContextFunction = () => void | Promise<void>;

// usePoller react hook
export const usePoller = (
  fn: PollerContextFunction,
  enabled = true,
  interval = 5000,
  pollerName?: string
) => {
  if (typeof fn !== 'function') {
    throw new TypeError('Can\'t poll without a callback function');
  }

  return useEffect(
    () => {
      let disabled = false;
      let failures = 0;

      const poll = async () => {
        if (disabled) {
          return;
        }

        try {
          await fn();
        } catch (error) {
          failures++;
          logger.error(error);
        }

        if (failures < 100) {
          setTimeout(poll, interval);
        } else {
          logger.debug(`Too much errors in poller ${pollerName}. Disabled`);
        }
      }

      poll();
      logger.debug(`Poller ${pollerName} started`);

      return () => {
        disabled = true;
        failures = 0;
        logger.debug(`Poller ${pollerName} stopped`);
      };
    },
    [fn, enabled, interval, pollerName]
  );
};
