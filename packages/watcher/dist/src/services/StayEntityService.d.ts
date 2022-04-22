import { Contract } from "stays-core";
import { TokenEntity } from "../types";
export default class StayEntityService {
    protected contract: any;
    protected dayZero: Date;
    private tokens;
    private tokenEntities;
    constructor(contract: Contract);
    process(): Promise<void>;
    getTokens(): Promise<void>;
    makeTokenEntities(): Promise<void>;
    private fillNeededFacilitiesAndSpaces;
    private addDaysAndParse;
    getTokenEntities(): TokenEntity[];
    private setLastBlockNumber;
}
