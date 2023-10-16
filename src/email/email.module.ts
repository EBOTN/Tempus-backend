import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.MAILDEV_INCOMING_USER,
            pass: process.env.MAILDEV_INCOMING_PASS,
          },
        },
        defaults: {
          from: `"No Reply" <keva.ss156@gmail.com>`,
        },
        template: {
          dir: process.cwd() + "/templates",
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  exports: [EmailService]
})
export class EmailModule {}
