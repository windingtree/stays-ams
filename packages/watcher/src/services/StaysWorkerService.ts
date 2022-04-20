import StaysRepository from "../repositories/StaysRepository";
import EmailSenderService from "./EmailSenderService";
const Stay = require('../../models/stay');

export default class StaysWorkerService {
  private elements: Array<typeof Stay>;

  constructor() {
    this.process()
  }

  private async process() {
    await this.getUnprocessedStays()
    await this.sendEmails()
  }

  private async getUnprocessedStays() {
    const repo = new StaysRepository()
    this.elements = await repo.getUnprocessed();
  }

  private async sendEmails() {
    const elements = await Promise.all(this.elements);
    for (const item of elements) {
      const sender = new EmailSenderService();
      await sender.setMessage(item);
      await sender.sendEmail();
    }
  }
}



