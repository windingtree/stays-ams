import sgMail from "@sendgrid/mail";
import { StayInit } from '../../models/stay';

export default class EmailSenderService {
  private fromEmail: string;
  private message: { subject: string; from: string; html: string; to: string };
  private stayModel: typeof StayInit;

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
    this.fromEmail = process.env.SENDRID_EMAIL_FROM || '';
  }

  public setMessage(stayModel: typeof StayInit) {
    this.stayModel = stayModel;
    const quantity = stayModel.quantity;
    const startDate = (new Date(stayModel.start_date)).toLocaleDateString("en-US", { timeZone: "UTC" });
    const end_date = (new Date(stayModel.end_date)).toLocaleDateString("en-US", { timeZone: "UTC" });

    this.message = {
      to: stayModel.email,
      from: process.env.SENDRID_EMAIL_FROM || '',
      subject: 'You have new Stay',
      html:
        `Rooms quantity: <strong>${ quantity }</strong><br>` +
        `Start Date: <strong>${ startDate }</strong><br>` +
        `End Date: <strong>${ end_date }</strong><br>` +
        `Check your account`
      ,
    };
  }

  public async sendEmail() {
    await sgMail.send(this.message);
    this.updateStayStatus();
  }

  private updateStayStatus() {
    this.stayModel.update({ status: 1 });
  }
}
