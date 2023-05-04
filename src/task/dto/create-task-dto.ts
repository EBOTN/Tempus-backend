import { PickType } from "@nestjs/swagger";
import { TaskModel } from "./task-model-dto";

export class CreateTaskDto extends PickType(TaskModel, [
  "title",
  "description",
]) {}
