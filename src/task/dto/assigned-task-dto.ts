import { ApiProperty } from "@nestjs/swagger";
import { TaskDto } from "./task-dto";

export class AssignedTaskDto{
    @ApiProperty({ description: "Task" })
    readonly task: TaskDto
    @ApiProperty({ description: "Worker id"})
    readonly workerId: number
    @ApiProperty({ description: "Task start time"})
    readonly startTime: Date
    @ApiProperty({description: "Task end time"})
    readonly endTime: Date
}