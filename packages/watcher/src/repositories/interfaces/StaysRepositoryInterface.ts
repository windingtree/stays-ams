import {TokenEntity} from "../../types";
import {StayInit} from "../../../models/stay";

export interface StaysRepositoryInterface {
  getUnprocessed(): Promise<Array<typeof StayInit>>

  store(entities: TokenEntity[])
}
