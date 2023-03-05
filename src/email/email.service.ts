import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordRecovery(email: string, firstName: string, token: string) {
    const url = `http://localhost:5173/api/recovery-password?token=${token}`;
    return await this.mailerService.sendMail({
      to: email,
      template: "./transactional",
      context: {
        name: firstName,
        url,
      },
    });
  }

  async sendChangeMail(email: string, token: string) {
    const url = `http://localhost:5173/api/user/confirmChangeMail/${token}`;
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
