import { TokenEntity } from "../types";
import { StaysRepositoryInterface } from "./interfaces/StaysRepositoryInterface";
declare const Stay: any;
export default class implements StaysRepositoryInterface {
    private stayModel;
    constructor();
    getUnprocessed(): Promise<Array<typeof Stay>>;
    store(entities: TokenEntity[]): Promise<boolean>;
    private mapEntity;
}
export {};
