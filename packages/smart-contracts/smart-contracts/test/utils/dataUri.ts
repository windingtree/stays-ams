/* eslint-disable prettier/prettier */
import { utils } from 'ethers';

export const decodeDataUri = (
  dataUri: string,
  parse = false
): string | { [k: string]: unknown } => {
  const decodedData = new TextDecoder().decode(
    utils.base64.decode(
      dataUri.replace(/^data:\w+\/\w+;base64,/, '')
    )
  );
  return parse ? JSON.parse(decodedData) : decodedData;
};
