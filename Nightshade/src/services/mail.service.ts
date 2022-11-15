import Mailgun from 'mailgun.js';
import Client from 'mailgun.js/client';
import formData from 'form-data';
import {
  MailgunMessageData,
  MessagesSendResult,
} from 'mailgun.js/interfaces/Messages';
import { injectable } from 'tsyringe';

@injectable()
export class MailService {
  private readonly _client: Client;

  constructor() {
    const mg = new Mailgun(formData);
    this._client = mg.client({
      key: process.env.MG_APIKEY as string,
      username: 'api',
    });
  }

  async send(data: MailgunMessageData): Promise<MessagesSendResult> {
    const result = await this._client.messages.create(
      process.env.MG_DOMAIN as string,
      data
    );
    return result;
  }
}
