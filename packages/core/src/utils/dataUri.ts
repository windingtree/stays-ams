import type { IPFS } from '@windingtree/ipfs-apis';
import type { TokenData } from '../types';
import { utils } from 'ethers';
import { regexp, http }  from '@windingtree/org.id-utils';
import { ipfsCidResolver } from '../utils/ipfs';
import { repeater } from '../utils/repeater';

export type TokenUriType =
  | 'http'
  | 'ipfs';

export const fetchDataUri = async <DT>(ipfsNode: IPFS, uri: string): Promise<DT> => {
  let tokenUriType: TokenUriType | undefined;

  if (regexp.ipfs.exec(uri)) {
    tokenUriType = 'ipfs';
  } else if (regexp.uriHttp.exec(uri)) {
    tokenUriType = 'http';
  }

  let data: DT;

  switch (tokenUriType) {
    case 'ipfs':
      data = await repeater(
        () => ipfsCidResolver(ipfsNode)(uri.replace('ipfs://', '')),
        3
      );
      break;

    case 'http':
      const response = await http.request(
        uri,
        'GET'
      ) as string;
      try {
        data = JSON.parse(response) as DT;
      } catch (error) {
        throw new Error(`Unable to parse data from the ${uri}`);
      }
      break;

    default:
      throw new Error('Unknown dataURI type');
  }

  return data;
}

export const decodeDataUri = (
  dataUri: string,
  parse = false
): TokenData | string => {
  const decodedData = new TextDecoder().decode(
    utils.base64.decode(
      dataUri.replace(/^data:\w+\/\w+;base64,/, '')
    )
  );
  return parse ? JSON.parse(decodedData) : decodedData;
};
