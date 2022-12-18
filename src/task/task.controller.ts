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
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { ReportService } from "src/report/report.service";
import { TimeLineService } from "src/time-line/time-line.service";
import { BadRequestAssignedTaskDto } from "./dto/assigned_task-info-dto";
import { CreateTaskDto } from "./dto/create-task-dto";
import { ValidationUserId } from "./dto/user-id-body";
import { ReadTaskQuery } from "./dto/read-task-query";
import { TaskDto, Tesst } from "./dto/task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { UpdateTaskParam } from "./dto/update-task-param";
import { TaskService } from "./task.service";
import { ReportDto } from "src/report/dto/report-dto";
import { AssignedTaskDto } from "./dto/assigned-task-dto";

@ApiTags("tasks")
@Controller("tasks")
export class TaskController {
  constructor(private taskService: TaskService,
    private reportService: ReportService,
    private timeLineService: TimeLineService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all assigned tasks by user" })
  @ApiResponse({ status: 200, type: [BadRequestAssignedTaskDto] })
  @Get("getAssignedTasks")
  getAssignedTasks(@Query() query: ReadTaskQuery) {
    return this.taskService.getAssignedTasksByUserId(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get report about work for user" })
  @ApiResponse({ status: 200, type: [ReportDto] })
  @Get("/getReport")
  getReport(@Query() query: Tesst) {
    
    return this.reportService.getReportForWorker(
      query.startTime,
      query.endTime,
      query.workerId
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("getUserTasks")
  @ApiOperation({ summary: "Get all created tasks by user" })
  @ApiResponse({ status: 200, type: [TaskDto] })
  getByCreatorId(@Query() query: ReadTaskQuery) {
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
  @ApiOperation({ summary: "Get first task" })
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
  @ApiResponse({ status: 200, type: BadRequestAssignedTaskDto })
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
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  @Post("/:id/assignWorker")
  assignUser(
    @Param() param: UpdateTaskParam,
    @Body() body: ValidationUserId
  ) {
    return this.taskService.assignUserToTask(param.id, body.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Unassign user from task" })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  @Post("/:id/unassignWorker")
  removeUser(
    @Param() param: UpdateTaskParam,
    @Body() body: ValidationUserId
  ) {
    return this.taskService.removeUserFromTask(param.id, body.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/startTimeLine")
  @ApiOperation({ summary: "Start track task" })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  starTimeLine(
    @Param() param: UpdateTaskParam,
    @Body() body: ValidationUserId
  ) {
    return this.timeLineService.startTimeLine(param.id, body.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/endTimeLine")
  @ApiOperation({ summary: "Finish track task" })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  endTimeLine(@Param() param: UpdateTaskParam) {
    return this.timeLineService.endTimeLine(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/completeTask")
  @ApiOperation({ summary: "Complete task" })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  completeTask(@Param() param: UpdateTaskParam) {
    return this.taskService.completeTask(param.id);
  }
}