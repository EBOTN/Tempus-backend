import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { TaskModule } from './task/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { TimeLineModule } from "./time-line/time-line.module";
import { ReportModule } from "./report/report.module";
import { ProjectModule } from './project/project.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [UserModule, AuthModule, TaskModule, TimeLineModule, PrismaModule, ReportModule, ProjectModule, WorkspaceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
