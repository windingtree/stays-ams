import type { IPFS, Options } from 'ipfs-core';
import { File } from '@web-std/file';
export declare const startIpfsGateway: (options?: import("ipfs-core/src/types").Options | undefined) => Promise<IPFS>;
export declare const obj2File: (obj: unknown, fileName: string) => File;
export declare const getIpfsChunks: (asyncIterator: AsyncIterable<Uint8Array>) => Promise<string>;
export { IPFS, Options };
//# sourceMappingURL=index.d.ts.map