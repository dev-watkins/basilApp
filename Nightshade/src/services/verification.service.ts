import { container } from 'tsyringe';
import { MailService } from './mail.service';
import { MessagesSendResult } from 'mailgun.js/interfaces/Messages';

export class VerificationService {
  private readonly _mailer: MailService;

  constructor() {
    this._mailer = container.resolve<MailService>('MailService');
  }

  createToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendVerificationEmail(
    token: string,
    email: string
  ): Promise<MessagesSendResult> {
    const response = await this._mailer.send({
      from: process.env.MG_FROM,
      to: [email],
      subject: 'New sign in request.',
      template: 'nightshade-verification',
      'h:X-Mailgun-Variables': JSON.stringify({ verificationToken: token }),
    });
    return response;
  }
}
