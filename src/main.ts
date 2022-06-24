import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import {PrismaService } from './prisma.service'

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, {cors:true});
  const prismaService = app.get(PrismaService)
  app.enableCors({ origin: /.+/ });
  app.use(cookieParser())
  await prismaService.enableShutdownHooks(app)
  await app.listen(PORT);
}
start();
