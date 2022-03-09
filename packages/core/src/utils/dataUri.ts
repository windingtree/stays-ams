import type { IPFS } from '@windingtree/ipfs-apis';
import { regexp, http }  from '@windingtree/org.id-utils';
import { ipfsCidResolver } from '../utils/ipfs';

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
      data = await ipfsCidResolver(ipfsNode)(uri);
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