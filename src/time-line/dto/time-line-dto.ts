import { ApiProperty } from "@nestjs/swagger";

export class TimeLineDto {
  @ApiProperty({
    description: "Start time date",
  })
  readonly startTime: Date;

  @ApiProperty({
    description: "End time date",
  })
  readonly endTime: Date;
}
