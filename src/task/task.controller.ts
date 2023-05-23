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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ReportService } from "src/report/report.service";
import { TimeLineService } from "src/time-line/time-line.service";
import { CreateTaskDto } from "./dto/create-task-dto";
import { GetTaskQuery } from "./dto/get-task-query";
import { TaskDto, ReportQuerryDto } from "./dto/task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { TaskService } from "./task.service";
import { ReportDto } from "src/report/dto/report-dto";
import { ExtendedRequest } from "src/shared/extended-request";
import { MemberProgressDto } from "./dto/member-progress-dto";
import { ValidationUserIdDto } from "./dto/validation-user-id-dto";

@ApiTags("tasks")
@Controller("workspace/:workspaceId/project/:projectId/task")
export class TaskController {
  constructor(
    private taskService: TaskService,
    private reportService: ReportService,
    private timeLineService: TimeLineService
  ) {}

  @ApiOperation({ summary: "Get report about work for user" })
  @ApiResponse({ status: 200, type: [ReportDto] })
  @ApiParam({ name: "workspaceId", type: Number, required: true })
  @ApiParam({ name: "projectId", type: Number, required: true })
  @Get("/getReport")
  getReport(@Query() query: ReportQuerryDto) {
    return this.reportService.getReportForWorker(
      query.startTime,
      query.endTime,
      query.workerId
    );
  }

  @Get()
  @ApiOperation({ summary: "Get tasks by filter" })
  @ApiResponse({ status: 200, type: [TaskDto] })
  @ApiParam({ name: "workspaceId", type: Number, required: true })
  getAll(
    @Param("projectId", ParseIntPipe) projectId: number,
    @Query() query: GetTaskQuery,
    @Req() req: ExtendedRequest
  ) {
    return this.taskService.getByFilter(query, projectId, req.userInfo.id);
  }

  @Get("/:taskId")
  @ApiOperation({ summary: "Get task by id" })
  @ApiResponse({ status: 200, type: TaskDto })
  @ApiParam({ name: "workspaceId", type: Number, required: true })
  @ApiParam({ name: "projectId", type: Number, required: true })
  getById(@Param("taskId", ParseIntPipe) id: number) {
    return this.taskService.getById(id);
  }

  @ApiOperation({ summary: "Create task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @ApiParam({ name: "workspaceId", type: Number, required: true })
  @Post()
  create(
    @Body() body: CreateTaskDto,
    @Req() req: ExtendedRequest,
    @Param("projectId", ParseIntPipe) projectId: number
  ) {
    return this.taskService.create(body, req.userInfo.id, projectId);
  }

  @ApiOperation({ summary: "Delete task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @ApiParam({ name: "workspaceId", type: Number, required: true })
  @ApiParam({ name: "projectId", type: Number, required: true })
  @Delete("/:taskId")
  remove(@Param("taskId", ParseIntPipe) id: number) {
    return this.taskService.remove(id);
  }

  @ApiOperation({ summary: "Update task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @ApiParam({ name: "workspaceId", type: Number, required: true })
  @ApiParam({ name: "projectId", type: Number, required: true })
  @Put("/:taskId")
  update(
    @Param("taskId", ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto
  ) {
    return this.taskService.update(id, body);
  }

  @ApiOperation({ summary: "Assign worker to task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @ApiParam({ name: "workspaceId", type: Number, required: true })
  @ApiParam({ name: "projectId", type: Number, required: true })
  @Post("/:taskId/assignWorker")
  assignUser(
    @Param("taskId", ParseIntPipe) id: number,
    @Body() data: ValidationUserIdDto
  ) {
    return this.taskService.assignUserToTask(id, data.userId);
  }

  @ApiOperation({ summary: "Unassign user from task" })
  @ApiResponse({ status: 200, type: TaskDto })
  @ApiParam({ name: "workspaceId", type: Number, required: true })
  @ApiParam({ name: "projectId", type: Number, required: true })
  @Post("/:taskId/unassignWorker")
  removeUser(
    @Param("taskId", ParseIntPipe) id: number,
    @Body() data: ValidationUserIdDto
  ) {
    return this.taskService.removeUserFromTask(id, data.userId);
  }

  @Post("/:taskId/startTimeLine")
  @ApiOperation({ summary: "Start track task" })
  @ApiResponse({ status: 200, type: MemberProgressDto })
  @ApiParam({ name: "workspaceId", type: Number, required: true })
  @ApiParam({ name: "projectId", type: Number, required: true })
  starTimeLine(
    @Param("taskId", ParseIntPipe) id: number,
    @Req() req: ExtendedRequest
  ) {
    return this.timeLineService.startTimeLine(id, req.userInfo.id);
  }

  @Post("/:taskId/endTimeLine")
  @ApiOperation({ summary: "Finish track task" })
  @ApiResponse({ status: 200, type: MemberProgressDto })
  @ApiParam({ name: "workspaceId", type: Number, required: true })
  @ApiParam({ name: "projectId", type: Number, required: true })
  endTimeLine(
    @Param("taskId", ParseIntPipe) id: number,
    @Req() req: ExtendedRequest
  ) {
    return this.timeLineService.endTimeLine(id, req.userInfo.id);
  }

  @Post("/:taskId/completeTask")
  @ApiOperation({ summary: "Complete task" })
  @ApiParam({ name: "workspaceId", type: Number, required: true })
  @ApiParam({ name: "projectId", type: Number, required: true })
  @ApiResponse({ status: 200, type: MemberProgressDto })
  completeTask(
    @Param("taskId", ParseIntPipe) id: number,
    @Req() req: ExtendedRequest
  ) {
    return this.taskService.completeTask(id, req.userInfo.id);
  }

  @Post("/:taskId/unCompleteTask")
  @ApiOperation({ summary: "Uncomplete task" })
  @ApiParam({ name: "workspaceId", type: Number, required: true })
  @ApiParam({ name: "projectId", type: Number, required: true })
  @ApiResponse({ status: 200, type: MemberProgressDto })
  unCompleteTask(
    @Param("taskId", ParseIntPipe) id: number,
    @Req() req: ExtendedRequest
  ) {
    return this.taskService.unCompleteTask(id, req.userInfo.id);
  }

  @Get("/:taskId/getMemberProgress")
  @ApiOperation({ summary: "Get member progress" })
  @ApiParam({ name: "workspaceId", type: Number, required: true })
  @ApiParam({ name: "projectId", type: Number, required: true })
  @ApiResponse({ status: 200, type: MemberProgressDto })
  getMemberProgress(
    @Param("taskId", ParseIntPipe) id: number,
    @Req() req: ExtendedRequest
  ) {
    return this.taskService.getMemberProgress(id, req.userInfo.id);
  }
}
