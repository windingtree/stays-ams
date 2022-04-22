import { TokenEntity } from "../../types";
export interface StaysRepositoryInterface {
    getUnprocessed(): Object;
    store(entities: TokenEntity[]): any;
}
