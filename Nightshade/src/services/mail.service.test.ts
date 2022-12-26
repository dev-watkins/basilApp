import 'reflect-metadata';
import Mailgun from 'mailgun.js';
import Client from 'mailgun.js/client';
import { MailService } from './mail.service';

describe('Mail service tests', () => {
  it('should call mailgun client create method', async () => {
    const createMock = jest.fn();
    jest.spyOn(Mailgun.prototype, 'client').mockImplementation(() => {
      return {
        messages: {
          create: createMock,
        },
      } as unknown as Client;
    });

    const service = new MailService();
    await service.send({
      to: 'test@test.com',
      from: 'test test',
      subject: 'test subject',
      template: 'nightshade',
    });

    expect(createMock).toBeCalled();
  });
});
