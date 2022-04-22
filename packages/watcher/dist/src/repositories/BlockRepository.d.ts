import { BlockRepositoryInterface } from "./interfaces/BlockRepositoryInterface";
export default class implements BlockRepositoryInterface {
    private model;
    constructor();
    getLastBlockNumber(): Promise<number>;
    store(id: number): void;
}
