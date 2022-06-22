import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
