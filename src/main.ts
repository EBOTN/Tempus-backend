import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma/prisma.service";
import * as basicAuth from "express-basic-auth";

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  const origin =
    process.env.IS_DEV === "true"
      ? ["http://192.168.205.211:3000", "http://192.168.205.211:5173"]
      : ["http://localhost:3000", "http://localhost:5173"];
  app.enableCors({
    origin,
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("Tempus SWAGGER")
    .setDescription("REST API")
    .setVersion("1.0.0")
    .addTag("Tempus")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);

  await prismaService.enableShutdownHooks(app);
  await app.listen(PORT);
}
start();
