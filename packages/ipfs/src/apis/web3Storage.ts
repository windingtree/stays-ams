import type { IpfsApiAddResponse } from './base';
import type { IPFS } from '../utils';
import { BaseIpfsStorageApi } from './base';
import { getIpfsChunks } from '../utils';
import { http } from '@windingtree/org.id-utils';

const web3StorageApiPath = 'https://api.web3.storage';

export class Web3StorageApi extends BaseIpfsStorageApi {
  private authToken: string;
  private ipfsGateway: IPFS;

  constructor(token: string, gateway: IPFS) {
    super();

    if (!token) {
      throw new Error('Web3Storage Authorization API token must be provided');
    }

    if (!gateway) {
      throw new Error('IPFS gateway must be provided');
    }

    this.authToken = token;
    this.ipfsGateway = gateway;
  }

  authHeader() {
    return {
      'Authorization': `Bearer ${this.authToken}`,
      'X-Client': 'web3.storage/js'
    };
  }

  async add(
    file: File
  ): Promise<IpfsApiAddResponse> {
    return http.request(
      `${web3StorageApiPath}/upload`,
      'POST',
      await file.arrayBuffer(),
      {
        ...this.authHeader(),
        'X-NAME': file.name
      }
    ) as Promise<IpfsApiAddResponse>;
  }

  async get(cid: string): Promise<unknown> {
    return getIpfsChunks(this.ipfsGateway.cat(cid));
  }

  // Faked until Web3.storage not implemented /user/uploads/{cid}
  // https://github.com/web3-storage/web3.storage/issues/314
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(cid: string): Promise<void> {
    return Promise.resolve();
  }

  async _delete(cid: string): Promise<void> {
    await http.request(
      `${web3StorageApiPath}/user/uploads/${cid}`,
      'DELETE',
      undefined,
      {
        ...this.authHeader()
      }
    );
  }
}
