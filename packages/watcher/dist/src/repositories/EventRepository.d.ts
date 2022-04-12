import { RepositoryInterface } from "./interfaces/RepositoryInterface";
export default class implements RepositoryInterface {
    get(): Array<{}>;
    getOne(): Object;
    store(): boolean;
}
