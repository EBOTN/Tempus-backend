import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { TaskModule } from "./task/task.module";
import { PrismaModule } from "./prisma/prisma.module";
import { TimeLineModule } from "./time-line/time-line.module";
import { ProjectModule } from "./project/project.module";
import { WorkspaceModule } from "./workspace/workspace.module";
import { FileModule } from "./file/file.module";
import { NestjsFormDataModule } from "nestjs-form-data";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { EmailModule } from './email/email.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    UserModule,
    FileModule,
    AuthModule,
    TaskModule,
    TimeLineModule,
    PrismaModule,
    ProjectModule,
    WorkspaceModule,
    NestjsFormDataModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "static"),
      serveRoot: "/api/images/",
      exclude: ["/api/*"],
    }),
    EmailModule,
    ReportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
