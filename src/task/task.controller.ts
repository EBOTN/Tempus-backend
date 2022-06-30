import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { CreateTaskDto } from "./dto/create-task-dto";
import { TaskDto } from "./dto/task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { TaskService } from "./task.service";

@ApiTags("tasks")
@Controller("tasks")
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all tasks by user" })
  @ApiResponse({ status: 200, type: TaskDto })
  @Get()
  getAll(@Query("userid") id: number) {
    return this.taskService.getAllTasksByUserId(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create task and set to user" })
  @ApiResponse({ status: 200, type: TaskDto })
  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.taskService.createTask(body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.taskService.removeTask(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @Put("/:id")
  update(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateTaskDto) {
    return this.taskService.update(id, body);
  }
}
