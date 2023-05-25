import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TaskIsNotCompleteGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!isNumber(request.params.taskId)) throw new BadRequestException();
    const task = await this.prisma.task.findFirst({
      where: {
        id: +request.params.taskId,
      },
    });
    if (task.isComplete) throw new BadRequestException("Task is complete");
    return !task.isComplete;
  }
}

function isNumber(str: string): boolean {
  if (typeof str !== "string") {
    return false;
  }

  if (str.trim() === "") {
    return false;
  }

  return !Number.isNaN(Number(str));
}
