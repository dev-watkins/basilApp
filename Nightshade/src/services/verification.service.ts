import * as crypto from 'crypto';
import { container } from 'tsyringe';
import { MailService } from './mail.service';
import { MessagesSendResult } from 'mailgun.js/interfaces/Messages';

export class VerificationService {
  private readonly _mailer: MailService;

  constructor() {
    this._mailer = container.resolve<MailService>('MailService');
  }

  generateHOTPCode(counter: number, email: string): string {
    const hash = crypto
      .createHmac('sha256', process.env.SECRET as string)
      .update(counter.toString() + email)
      .digest('hex');

    const dynamicTruncation = parseInt(hash.substr(-8), 16) & 0x7fffffff;

    const code = dynamicTruncation % 1e6;

    return code.toString().padStart(6, '0');
  }

  createToken(email: string): string {
    const time = Math.floor(Date.now() / 1000);

    const counter = Math.floor(time / 300);

    return this.generateHOTPCode(counter, email);
  }

  async sendVerificationEmail(email: string): Promise<MessagesSendResult> {
    const response = await this._mailer.send({
      from: process.env.MG_FROM,
      to: [email],
      subject: 'New sign in request.',
      template: 'nightshade-verification',
      'h:X-Mailgun-Variables': JSON.stringify({
        verificationToken: this.createToken(email),
      }),
    });
    return response;
  }
}
