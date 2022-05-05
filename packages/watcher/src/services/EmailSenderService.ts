import client from "@sendgrid/mail"
import { StayInit } from '../../models/stay';

export default class EmailSenderService {
  private fromEmail: string;
  private message;
  private stayModel: typeof StayInit;

  constructor() {
    client.setApiKey(process.env.SENDGRID_API_KEY || '');
    this.fromEmail = process.env.SENDRID_EMAIL_FROM || '';
  }

  public setMessage(stayModel: typeof StayInit) {
    this.stayModel = stayModel;
    const start_date = (new Date(stayModel.start_date)).toLocaleString("en-US", { timeZone: "UTC" });
    const end_date = (new Date(stayModel.end_date)).toLocaleString("en-US", { timeZone: "UTC" });


    this.message = {
      from: process.env.SENDRID_EMAIL_FROM || '',
      personalizations: [{
        to: [
          {
            email: process.env.SENDRID_EMAIL_TO || stayModel.email,
            name: stayModel.name
          }
        ],
        dynamic_template_data: {
          name: stayModel.data.name,
          token_id: stayModel.token_id,
          price: stayModel.data.price,
          guests: stayModel.quantity,
          start_date,
          end_date,
          policy: '-',
          address: stayModel.data.address,
          contact: stayModel.data.contact
        },
      }],
      template_id: process.env.SENDRID_EMAIL_TEMPLATE_ID || ''
    };
  }

  public async sendEmail() {
    await client
      .send(this.message)
      .then(async () => await this.updateStayStatus())
      .catch(error => {
        throw error;
      });
  }

  private async updateStayStatus() {
    this.stayModel.update({ status: 1 });
  }
}
