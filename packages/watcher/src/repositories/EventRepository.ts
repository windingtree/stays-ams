import {RepositoryInterface} from "./interfaces/RepositoryInterface";

export default class implements RepositoryInterface {
  get(): Array<{}> {
    return [{}];
  }

  getOne(): Object {
    return {};
  }

  store() {
    //todo store to DB
    return true;
  }
}
