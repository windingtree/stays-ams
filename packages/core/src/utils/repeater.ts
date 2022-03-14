// Makes at least maxTries calls of a callback
export const repeater = async <T>(
  callback: Function,
  maxTries = 3,
  tries = 0
): Promise<T> => {
  try {
    return await callback();
  } catch (error) {
    if (tries > maxTries) {
      throw error;
    }
    return repeater(callback, maxTries, tries + 1);
  }
}
