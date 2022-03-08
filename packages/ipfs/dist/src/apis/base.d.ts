export interface IpfsApiAddResponse {
    cid: string;
}
export interface IpfsStorageApi {
    add(file: File): Promise<IpfsApiAddResponse>;
    get(cid: string): Promise<unknown>;
    delete(cid: string): Promise<void>;
}
export declare abstract class BaseIpfsStorageApi implements IpfsStorageApi {
    abstract add(file: File): Promise<IpfsApiAddResponse>;
    abstract get(cid: string): Promise<unknown>;
    abstract delete(cid: string): Promise<void>;
}
//# sourceMappingURL=base.d.ts.map