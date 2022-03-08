import type { IPFS, Options } from './utils';
import { Web3StorageApi } from './apis/web3Storage';
declare const utils: {
    startIpfsGateway: (options?: import("ipfs-core/src/types").Options | undefined) => Promise<import("ipfs-core-types/src/").IPFS<{}>>;
    obj2File: (obj: unknown, fileName: string) => File;
    getIpfsChunks: (asyncIterator: AsyncIterable<Uint8Array>) => Promise<string>;
};
export { IPFS, Options, Web3StorageApi, utils };
//# sourceMappingURL=index.d.ts.map