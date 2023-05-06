import { ApiProperty } from "@nestjs/swagger";

export class MemberProgressDto{
    @ApiProperty({description: 'Task in progress?'})
    readonly isRunning: boolean;

    @ApiProperty({description: 'How much time are tracked'})
    readonly trackedTime: number;

    @ApiProperty({description: 'osas'})
    readonly lastTimeLineStartTime: Date
}