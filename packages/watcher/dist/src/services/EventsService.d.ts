import { Sender } from "./intefaces/SenderInterface";
export default class {
    protected sender: Sender;
    constructor(sender: Sender);
    getNewEvents(): Array<{}>;
    send(): boolean;
}
