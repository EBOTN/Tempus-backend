import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { TokenService } from "./token/token.service";
import { transformAndValidateSync } from "class-transformer-validator";
import { TaskService } from './task/task.service';
import { TaskModule } from './task/task.module';

@Module({
  imports: [UserModule, AuthModule, TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
