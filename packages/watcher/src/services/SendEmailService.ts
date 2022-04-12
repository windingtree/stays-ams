import {Sender} from "./intefaces/SenderInterface";

export default class implements Sender {
  static check(): boolean {
    return true;
  }

  send(): boolean {
    return true;
  }
}
