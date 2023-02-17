import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordRecovery(email: string, firstName: string, token: string) {
    console.log(process.cwd());
    
    const url = `http://localhost:3000/api/recovery-password?token=${token}`;
    return await this.mailerService.sendMail({
      to: email,
      template: "./transactional",
      context: {
        name: firstName,
        url,
      },
    });
  }
}
