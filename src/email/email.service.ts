import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordRecovery(email: string, firstName: string, token: string) {
    const url = `http://localhost:5173/recovery-password?token=${token}`;
    return await this.mailerService.sendMail({
      to: email,
      subject: 'Tempus password reset request',
      template: "./changePasswordTemplate",
      context: {
        title: 'test',
        siteUrl: "http://localhost:5173",
        firstName,
        url,
      },
    });
  }
}
