import {Sender} from "./intefaces/SenderInterface";

export default class {
  protected sender: Sender;

  constructor(sender: Sender) {
    this.sender = sender;
  }

  public getNewEvents(): Array<{}> { //todo Type Event instead of empty object
    return [];
  }

  public send() {
    return this.sender.send();
  }
}
