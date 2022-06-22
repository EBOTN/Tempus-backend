import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/user.module';
import { UserService } from './users/user.service';

@Module({
  imports: [
    UsersModule
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
