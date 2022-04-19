export declare class Web3StorageApi {
    private w3Api;
    constructor(token: string);
    add(file: File): Promise<string>;
    get(cid: string): Promise<string>;
}
//# sourceMappingURL=web3Storage.d.ts.map