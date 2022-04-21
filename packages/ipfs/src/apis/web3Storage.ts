import type { Web3Storage } from 'web3.storage';
import { Web3Storage as w3s } from 'web3.storage';

export class Web3StorageApi {
  private w3Api: Web3Storage;

  constructor(token: string) {
    if (!token) {
      throw new Error('Web3Storage Authorization API token must be provided');
    }

    this.w3Api = new w3s({ token });
  }

  add(file: File): Promise<string> {
    return this.w3Api.put(
      [
        file
      ],
      {
        wrapWithDirectory: false
      }
    );
  }

  async get(cid: string): Promise<string> {
    const res = await this.w3Api.get(cid);

    if (!res || !res.ok) {
      throw new Error(`Failed to get ${cid}`);
    }

    const files = await res.files();

    return files[0].text();
  }
}
