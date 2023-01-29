import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { WorkspaceDto } from "./dto/workspace.dto";
import { Query, Req, UseGuards } from "@nestjs/common/decorators";
import { WorkSpaceOwnerGuard } from "./WorkSpaceOwnerGuards";
import { GetWorkspacesQuerry } from "./dto/get-workspaces-querry.dto";
import { ExtendedRequest } from "src/shared/extended-request";
import { FormDataRequest } from "nestjs-form-data/dist/decorators";
import { MemoryStoredFile } from "nestjs-form-data";

@ApiTags("Workspace")
@Controller("workspace")
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @ApiOperation({ summary: "Create workspace" })
  @ApiResponse({ status: 200, type: WorkspaceDto })
  @ApiConsumes("multipart/form-data")
  @Post()
  @FormDataRequest({ storage: MemoryStoredFile })
  create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @Req() req: ExtendedRequest
  ) {
    return this.workspaceService.create(req.userInfo.id, createWorkspaceDto);
  }

  @ApiOperation({ summary: "Get workspaces by querry" })
  @ApiResponse({ status: 200, type: [WorkspaceDto] })
  @Get()
  findAll(@Query() querry: GetWorkspacesQuerry) {
    return this.workspaceService.findAll(querry);
  }

  @ApiOperation({ summary: "Get workspace by id" })
  @ApiResponse({ status: 200, type: WorkspaceDto })
  @Get("/:id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.workspaceService.findOne(id);
  }

  @UseGuards(WorkSpaceOwnerGuard)
  @ApiOperation({ summary: "Update workspace by id" })
  @ApiResponse({ status: 200, type: WorkspaceDto })
  @Put("/:id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto
  ) {
    return this.workspaceService.update(id, updateWorkspaceDto);
  }

  @UseGuards(WorkSpaceOwnerGuard)
  @ApiOperation({ summary: "Delete workspace by id" })
  @ApiResponse({ status: 200, type: WorkspaceDto })
  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.workspaceService.remove(id);
  }

  @UseGuards(WorkSpaceOwnerGuard)
  @ApiOperation({ summary: "Add member to workspace" })
  @ApiResponse({ status: 200, type: WorkspaceDto })
  @Post("/:id/addMember")
  addMember(
    @Param("id", ParseIntPipe) id: number,
    @Body("memberId", ParseIntPipe) memberId: number
  ) {
    return this.workspaceService.addMember(id, memberId);
  }

  @UseGuards(WorkSpaceOwnerGuard)
  @ApiOperation({ summary: "Remove member from workspace" })
  @ApiResponse({ status: 200, type: WorkspaceDto })
  @Post("/:id/removeMember")
  removeMember(
    @Param("id", ParseIntPipe) id: number,
    @Body("memberId", ParseIntPipe) memberId: number
  ) {
    return this.workspaceService.removeMember(id, memberId);
  }
}
