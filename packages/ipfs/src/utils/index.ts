import type { IPFS, Options } from 'ipfs-core';
import { TextDecoder, Blob } from '@web-std/blob';
import { File } from '@web-std/file';
import { create } from 'ipfs-core';

export const startIpfsGateway = async (options?: Options): Promise<IPFS> =>
  create(options);

export const obj2File = (obj: unknown, fileName: string): File => {
  const blob = new Blob(
    [JSON.stringify(obj, null, 2)],
    { type : 'application/json' }
  );
  return new File([blob], fileName);
}

export const getIpfsChunks = async (asyncIterator: AsyncIterable<Uint8Array>): Promise<string> => {
  const data: Uint8Array[] = [];
  for await (const chunk of asyncIterator) {
    data.push(chunk);
  }
  const length = data.reduce((acc, curr) => acc + curr.length, 0);
  const concatenatedData = new Uint8Array(length);
  let offset = 0;
  for (const arr of data) {
    concatenatedData.set(arr, offset);
    offset += arr.length;
  }
  const decoder = new TextDecoder();
  return decoder.decode(concatenatedData);
}

export { IPFS, Options };
