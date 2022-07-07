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
import { AssignedTaskInfoDto } from "./dto/assigned_task-info-dto";
import { CreateTaskDto } from "./dto/create-task-dto";
import { EditUsersToTaskDto } from "./dto/edit-users-to-task-dto";
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
  @ApiOperation({ summary: "Get all assigned tasks by user" })
  @ApiResponse({ status: 200, type: [AssignedTaskDto] })
  @Get("getAssignedTasks")
  getAssignedTasks(@Query() query: GetTasksQuery) {
    return this.taskService.getAssignedTasksByUserId(query.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("getUserTasks")
  @ApiOperation({ summary: "Get all created tasks by user" })
  @ApiResponse({ status: 200, type: [TaskDto] })
  getByCreatorId(@Query() query: GetTasksQuery) {
    return this.taskService.getCreatedTasksByUserId(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "Get all tasks and them workers" })
  @ApiResponse({ status: 200, type: [TaskDto] })
  getAll() {
    return this.taskService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  @ApiOperation({ summary: "Get all tasks" })
  @ApiResponse({ status: 200, type: [TaskDto] })
  getFirst(@Param() param: UpdateTaskParam) {
    return this.taskService.getFirst(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.taskService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create task for one user" })
  @ApiResponse({ status: 200, type: AssignedTaskInfoDto })
  @Post("createUserTask")
  createForCreator(@Body() body: CreateTaskDto) {
    return this.taskService.createTaskForCreator(body);
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

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Assign worker to task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @Post("/:id/assignWorker")
  assignUser(
    @Param() param: UpdateTaskParam,
    @Body() body: EditUsersToTaskDto
  ) {
    return this.taskService.assignUsersToTaskById(param.id, body.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Unassign user from task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @Post("/:id/unassignWorker")
  removeUser(
    @Param() param: UpdateTaskParam,
    @Body() body: EditUsersToTaskDto
  ) {
    return this.taskService.removeUsersFromTaskById(param.id, body.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/start")
  @ApiOperation({ summary: "Start task" })
  @ApiResponse({ status: 200, type: AssignedTaskInfoDto })
  startTask(@Param() param: UpdateTaskParam) {
    return this.taskService.startTask(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/complete")
  @ApiOperation({ summary: "Finish task" })
  @ApiResponse({ status: 200, type: AssignedTaskInfoDto })
  finishTask(@Param() param: UpdateTaskParam) {
    return this.taskService.finishTask(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/startpause")
  @ApiOperation({ summary: "Pause task" })
  @ApiResponse({ status: 200, type: AssignedTaskInfoDto })
  startPause(@Param() param: UpdateTaskParam) {
    return this.taskService.startPause(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/endpause")
  @ApiOperation({ summary: "Unpause task" })
  @ApiResponse({ status: 200, type: AssignedTaskInfoDto })
  endPause(@Param() param: UpdateTaskParam) {
    return this.taskService.endPause(param.id);
  }
}
