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
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
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
import { ExtendedRequest } from "src/shared/extended-request";

@ApiTags("tasks")
@Controller("workspace/:workspaceId/project/:projectId/task")
export class TaskController {
  constructor(
    private taskService: TaskService,
    private reportService: ReportService,
    private timeLineService: TimeLineService
  ) {}

  // @ApiOperation({ summary: "Get all assigned tasks by user" })
  // @ApiResponse({ status: 200, type: [BadRequestAssignedTaskDto] })
  // @Get("getAssignedTasks")
  // getAssignedTasks(@Query() query: GetTaskQuery) {
  //   return this.taskService.getAssignedTasksByUserId(query);
  // }

  @ApiOperation({ summary: "Get report about work for user" })
  @ApiResponse({ status: 200, type: [ReportDto] })
  @ApiParam({name: "workspaceId", type: Number,required: true })
  @ApiParam({name: "projectId", type: Number, required: true })
  @Get("/getReport")
  getReport(@Query() query: ReportQuerryDto) {
    return this.reportService.getReportForWorker(
      query.startTime,
      query.endTime,
      query.workerId
    );
  }

  @Get("getCreatedTasks")
  @ApiOperation({ summary: "Get all created tasks by user" })
  @ApiResponse({ status: 200, type: [TaskDto] })
  @ApiParam({name: "workspaceId", type: Number,required: true })
  @ApiParam({name: "projectId", type: Number, required: true })
  getByCreatorId(
    @Query() query: GetTaskQuery,
    @Req() req: ExtendedRequest,
    @Param("projectId", ParseIntPipe) projectId: number
  ) {
    return this.taskService.getCreatedTasksByUserId(query, req.userInfo.id, projectId);
  }

  @Get()
  @ApiOperation({ summary: "Get tasks by project" })
  @ApiResponse({ status: 200, type: [TaskDto] })
  @ApiParam({name: "workspaceId", type: Number,required: true })
  getAll(@Param("projectId", ParseIntPipe) projectId: number) {
    return this.taskService.getByProject(projectId);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Get first task" })
  @ApiResponse({ status: 200, type: [TaskDto] })
  @ApiParam({name: "workspaceId", type: Number,required: true })
  @ApiParam({name: "projectId", type: Number, required: true })
  getFirst(@Param("id", ParseIntPipe) id: number) {
    return this.taskService.getFirst(id);
  }

  @ApiOperation({ summary: "Create task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @ApiParam({name: "workspaceId", type: Number,required: true })
  @Post()
  create(
    @Body() body: CreateTaskDto,
    @Req() req: ExtendedRequest,
    @Param("projectId", ParseIntPipe) projectId: number
  ) {
    return this.taskService.create(body, req.userInfo.id, projectId);
  }

  // @ApiOperation({ summary: "Create task for one user" })
  // @ApiResponse({ status: 200, type: BadRequestAssignedTaskDto })
  // @Post("createUserTask")
  // createForCreator(@Body() body: CreateTaskDto) {
  //   return this.taskService.createTaskForCreator(body);
  // }

  @ApiOperation({ summary: "Delete task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @ApiParam({name: "workspaceId", type: Number,required: true })
  @ApiParam({name: "projectId", type: Number, required: true })
  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.taskService.remove(id);
  }

  @ApiOperation({ summary: "Update task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @ApiParam({name: "workspaceId", type: Number,required: true })
  @ApiParam({name: "projectId", type: Number, required: true })
  @Put("/:id")
  update(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateTaskDto) {
    return this.taskService.update(id, body);
  }

  @ApiOperation({ summary: "Assign worker to task" })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  @ApiParam({name: "workspaceId", type: Number,required: true })
  @ApiParam({name: "projectId", type: Number, required: true })
  @Post("/:id/assignWorker")
  assignUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: ValidationUserId
  ) {
    return this.taskService.assignUserToTask(id, body.userId);
  }

  @ApiOperation({ summary: "Unassign user from task" })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  @ApiParam({name: "workspaceId", type: Number,required: true })
  @ApiParam({name: "projectId", type: Number, required: true })
  @Post("/:id/unassignWorker")
  removeUser(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: ExtendedRequest,
  ) {
    return this.taskService.removeUserFromTask(id, req.userInfo.id);
  }

  @Post("/:id/startTimeLine")
  @ApiOperation({ summary: "Start track task" })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  @ApiParam({name: "workspaceId", type: Number,required: true })
  @ApiParam({name: "projectId", type: Number, required: true })
  starTimeLine(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: ExtendedRequest,
  ) {
    return this.timeLineService.startTimeLine(id, req.userInfo.id);
  }

  @Post("/:id/endTimeLine")
  @ApiOperation({ summary: "Finish track task" })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  @ApiParam({name: "workspaceId", type: Number,required: true })
  @ApiParam({name: "projectId", type: Number, required: true })
  endTimeLine(@Param("id", ParseIntPipe) id: number) {
    return this.timeLineService.endTimeLine(id);
  }

  @Post("/:id/completeTask")
  @ApiOperation({ summary: "Complete task" })
  @ApiParam({name: "workspaceId", type: Number,required: true })
  @ApiParam({name: "projectId", type: Number, required: true })
  @ApiResponse({ status: 200, type: AssignedTaskDto })
  completeTask(@Param("id", ParseIntPipe) id: number) {
    return this.taskService.completeTask(id);
  }
}
