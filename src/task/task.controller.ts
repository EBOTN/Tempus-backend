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
import { ReportService } from "src/report/report.service";
import { TimeLineService } from "src/time-line/time-line.service";
import { BadRequestAssignedTaskDto } from "./dto/assigned_task-info-dto";
import { CreateTaskDto } from "./dto/create-task-dto";
import { ValidationUserId } from "./dto/user-id-body";
import { GetTaskQuery } from "./dto/get-task-query";
import { TaskDto, ReportQuerryDto } from "./dto/task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { TaskService } from "./task.service";
import { ReportDto } from "src/report/dto/report-dto";
import { AssignedTaskDto } from "./dto/assigned-task-dto";

@ApiTags("tasks")
@Controller("tasks")
export class TaskController {
  constructor(
    private taskService: TaskService,
    private reportService: ReportService,
    private timeLineService: TimeLineService
  ) {}

  @ApiOperation({ summary: "Get all assigned tasks by user" })
  @ApiResponse({ status: 200, type: [BadRequestAssignedTaskDto] })
  @Get("getAssignedTasks")
  getAssignedTasks(@Query() query: GetTaskQuery) {
    return this.taskService.getAssignedTasksByUserId(query);
  }

  @ApiOperation({ summary: "Get report about work for user" })
  @ApiResponse({ status: 200, type: [ReportDto] })
  @Get("/getReport")
  getReport(@Query() query: ReportQuerryDto) {
    return this.reportService.getReportForWorker(
      query.startTime,
      query.endTime,
      query.workerId
    );
  }

  @Get("getUserTasks")
  @ApiOperation({ summary: "Get all created tasks by user" })
  @ApiResponse({ status: 200, type: [TaskDto] })
  getByCreatorId(@Query() query: GetTaskQuery) {
    return this.taskService.getCreatedTasksByUserId(query);
  }

  @Get()
  @ApiOperation({ summary: "Get all tasks and them workers" })
  @ApiResponse({ status: 200, type: [TaskDto] })
  getAll() {
    return this.taskService.getAll();
  }

  @Get("/:id")
  @ApiOperation({ summary: "Get first task" })
  @ApiResponse({ status: 200, type: [TaskDto] })
  getFirst(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.getFirst(id);
  }

  @ApiOperation({ summary: "Create task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.taskService.create(body);
  }

  @ApiOperation({ summary: "Create task for one user" })
  @ApiResponse({ status: 200, type: BadRequestAssignedTaskDto })
  @Post("createUserTask")
  createForCreator(@Body() body: CreateTaskDto) {
    return this.taskService.createTaskForCreator(body);
  }

  @ApiOperation({ summary: "Delete task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @Delete("/:id")
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.remove(id);
  }

  @ApiOperation({ summary: "Update task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @Put("/:id")
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTaskDto) {
    return this.taskService.update(id, body);
  }

  @ApiOperation({ summary: "Assign worker to task" })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  @Post("/:id/assignWorker")
  assignUser(@Param('id', ParseIntPipe) id: number, @Body() body: ValidationUserId) {
    return this.taskService.assignUserToTask(id, body.userId);
  }

  @ApiOperation({ summary: "Unassign user from task" })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  @Post("/:id/unassignWorker")
  removeUser(@Param('id', ParseIntPipe) id: number, @Body() body: ValidationUserId) {
    return this.taskService.removeUserFromTask(id, body.userId);
  }

  @Post("/:id/startTimeLine")
  @ApiOperation({ summary: "Start track task" })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  starTimeLine(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ValidationUserId
  ) {
    return this.timeLineService.startTimeLine(id, body.userId);
  }

  @Post("/:id/endTimeLine")
  @ApiOperation({ summary: "Finish track task" })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  endTimeLine(@Param('id', ParseIntPipe) id: number) {
    return this.timeLineService.endTimeLine(id);
  }

  @Post("/:id/completeTask")
  @ApiOperation({ summary: "Complete task" })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  completeTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.completeTask(id);
  }
}
