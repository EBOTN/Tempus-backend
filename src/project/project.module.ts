import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [PrismaModule, AuthModule],
})
export class ProjectModule {}
