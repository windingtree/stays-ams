import type { IpfsApiAddResponse } from './base';
import type { IPFS } from '../utils';
import { BaseIpfsStorageApi } from './base';
export declare class Web3StorageApi extends BaseIpfsStorageApi {
    private authToken;
    private ipfsGateway;
    constructor(token: string, gateway: IPFS);
    authHeader(): {
        Authorization: string;
        'X-Client': string;
    };
    add(file: File): Promise<IpfsApiAddResponse>;
    get(cid: string): Promise<unknown>;
    delete(cid: string): Promise<void>;
    _delete(cid: string): Promise<void>;
}
//# sourceMappingURL=web3Storage.d.ts.map