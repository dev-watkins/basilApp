import 'reflect-metadata';
import { container } from 'tsyringe';
import { MailService } from './mail.service';
import { VerificationService } from './verification.service';

describe('test for verification service', () => {
  it('should create verfication token', () => {
    process.env.MG_APIKEY = 'key';
    const mailer = new MailService();
    container.register<MailService>('MailService', {
      useValue: mailer,
    });
    const vs = new VerificationService();
    const token = vs.createToken();

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBe(6);
  });

  it('should call mailer send method', async () => {
    process.env.MG_APIKEY = 'key';
    const mailer = new MailService();
    mailer.send = jest.fn();
    container.register<MailService>('MailService', {
      useValue: mailer,
    });
    const vs = new VerificationService();
    await vs.sendVerificationEmail('123456', 'test@test.com');

    expect(mailer.send).toBeCalled();
  });
});
