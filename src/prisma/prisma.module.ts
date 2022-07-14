import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [],
  providers: [PrismaService],
  imports: [],
  exports: [PrismaService],
})
export class PrismaModule {}
