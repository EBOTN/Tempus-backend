import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { env } from "process";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordRecovery(email: string, firstName: string, token: string) {
    const url = `${env.FRONT_URL}/recovery-password?token=${token}`;
    return await this.mailerService.sendMail({
      to: email,
      subject: 'Tempus password reset request',
      template: "./changePasswordTemplate",
      context: {
        title: 'test',
        siteUrl: env.FRONT_URL,
        firstName,
        url,
      },
    });
  }

  async sendChangeMail(email: string, token: string) {
    const url = `${env.FRONT_URL}/user/confirmChangeMail/${token}`;
    return await this.mailerService.sendMail({
      to: email,
      template: "./bebra",
      context: {
        url,
        email,
      },
    });
  }
}
