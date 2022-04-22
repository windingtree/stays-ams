export interface BlockRepositoryInterface {
    getLastBlockNumber(): Promise<number>;
    store(id: number): any;
}
