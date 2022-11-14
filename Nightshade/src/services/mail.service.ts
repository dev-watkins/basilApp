import Mailgun from 'mailgun.js';
import Client from 'mailgun.js/client';
import {
  MailgunMessageData,
  MessagesSendResult,
} from 'mailgun.js/interfaces/Messages';
import { container, injectable } from 'tsyringe';

@injectable()
export class MailService {
  private readonly _client: Client;

  constructor() {
    const mg = container.resolve<Mailgun>('Mailgun');
    this._client = mg.client({
      key: process.env.MG_API_KEY as string,
      username: 'api',
    });
  }

  async send(data: MailgunMessageData): Promise<MessagesSendResult> {
    const result = await this._client.messages.create('', data);
    return result;
  }
}
