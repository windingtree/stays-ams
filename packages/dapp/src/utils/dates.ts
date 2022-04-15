import { DateTime } from 'luxon';
import { getDayZero } from '../config';

const dayZero = getDayZero();

export const getDate = (days: number) => DateTime.fromMillis(
  DateTime.fromMillis(dayZero * 1000)
    .set({ hour: 1 })
    .toMillis() + days * 86400 * 1000
);
