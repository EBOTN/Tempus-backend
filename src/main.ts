import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {PrismaService } from './prisma.service'

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)
  await app.listen(PORT);
}
start();
