import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { AssignedTaskDto } from "./dto/assigned-task-dto";
import { CreateTaskDto } from "./dto/create-task-dto";
import { ReadTaskQuery as GetTasksQuery } from "./dto/read-task-query";
import { TaskDto } from "./dto/task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { UpdateTaskParam } from "./dto/update-task-param";
import { TaskService } from "./task.service";

@ApiTags("tasks")
@Controller("tasks")
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all tasks by user" })
  @ApiResponse({ status: 200, type: [AssignedTaskDto] })
  @Get()
  getAll(@Query() query: GetTasksQuery) {
    return this.taskService.getAllByUserId(query.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create task and set to user" })
  @ApiResponse({ status: 200, type: TaskDto })
  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.taskService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @Delete("/:id")
  remove(@Param() param: UpdateTaskParam) {
    return this.taskService.remove(param);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @Put("/:id")
  update(@Param() param: UpdateTaskParam, @Body() body: UpdateTaskDto) {
    return this.taskService.update(param, body);
  }
}
