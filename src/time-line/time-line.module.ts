import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { TimeLineService } from "./time-line.service";

@Module({
  controllers: [],
  providers: [TimeLineService],
  imports: [PrismaModule],
  exports: [TimeLineService, PrismaModule],
})
export class TimeLineModule {}
