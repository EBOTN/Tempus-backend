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
import {
  Patch,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from "@nestjs/common/decorators";
import { WorkSpaceOwnerGuard } from "./WorkSpaceOwnerGuards";
import { GetWorkspacesQuerry } from "./dto/get-workspaces-querry.dto";
import { ExtendedRequest } from "src/shared/extended-request";
import { FormDataRequest } from "nestjs-form-data/dist/decorators";
import { MemoryStoredFile } from "nestjs-form-data";
import { WorkspaceRoleGuard } from "src/shared/workspace-role-guard";
import { UpdateRoleDto } from "src/shared/update-role.dto";
import { GetRoleDto } from "src/shared/get-role-dto";

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
  findAll(@Query() querry: GetWorkspacesQuerry, @Req() req: ExtendedRequest) {
    return this.workspaceService.findAll(req.userInfo.id, querry);
  }

  @ApiOperation({ summary: "Get workspace by id" })
  @ApiResponse({ status: 200, type: WorkspaceDto })
  @Get("/:workspaceId")
  findOne(
    @Param("workspaceId", ParseIntPipe) id: number,
    @Req() req: ExtendedRequest
  ) {
    return this.workspaceService.findOne(req.userInfo.id, id);
  }

  @SetMetadata("roles", ["Owner"])
  @UseGuards(WorkspaceRoleGuard)
  @ApiOperation({ summary: "Update workspace by id" })
  @ApiResponse({ status: 200, type: WorkspaceDto })
  @ApiConsumes("multipart/form-data")
  @Put("/:workspaceId")
  @FormDataRequest({ storage: MemoryStoredFile })
  update(
    @Param("workspaceId", ParseIntPipe) id: number,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto
  ) {
    return this.workspaceService.update(id, updateWorkspaceDto);
  }

  @SetMetadata("roles", ["Owner"])
  @UseGuards(WorkspaceRoleGuard)
  @ApiOperation({ summary: "Delete workspace by id" })
  @ApiResponse({ status: 200, type: WorkspaceDto })
  @Delete("/:workspaceId")
  remove(@Param("workspaceId", ParseIntPipe) id: number) {
    return this.workspaceService.remove(id);
  }

  @SetMetadata("roles", ["Owner", "Manager"])
  @UseGuards(WorkspaceRoleGuard)
  @ApiOperation({ summary: "Remove member from workspace" })
  @ApiResponse({ status: 200, type: WorkspaceDto })
  @Post("/:workspaceId/removeMember")
  removeMember(
    @Param("workspaceId", ParseIntPipe) id: number,
    @Body("memberId", ParseIntPipe) memberId: number
  ) {
    return this.workspaceService.removeMember(id, memberId);
  }

  @SetMetadata("roles", ["Owner", "Manager"])
  @UseGuards(WorkspaceRoleGuard)
  @Patch("/:workspaceId/changeWorkspaceRole")
  async changeWorkspaceRole(
    @Param("workspaceId", ParseIntPipe) id: number,
    @Body() updateRole: UpdateRoleDto
  ) {
    return await this.workspaceService.changeWorkspaceMemberRole(
      id,
      updateRole.memberId,
      updateRole.role
    );
  }

  @SetMetadata("roles", ["Owner", "Manager", "Member"])
  @UseGuards(WorkspaceRoleGuard)
  @ApiOperation({ summary: "Get user role in workspace" })
  @ApiResponse({ status: 200, type: GetRoleDto })
  @Get("/:workspaceId/getRole")
  async getRole(
    @Param("workspaceId", ParseIntPipe) workspaceId: number,
    @Req() req: ExtendedRequest
  ) {
    return await this.workspaceService.getRole(workspaceId, req.userInfo.id);
  }

  @SetMetadata("roles", ["Owner"])
  @UseGuards(WorkspaceRoleGuard)
  @ApiOperation({ summary: "Generate invite url for workspace" })
  @ApiResponse({ status: 200, type: String })
  @Post("/:workspaceId/generateInviteUrl")
  generateInviteUrl(@Param("workspaceId", ParseIntPipe) workspaceId: number) {
    return this.workspaceService.generateInviteUrl(workspaceId);
  }

  @SetMetadata("roles", ["Owner"])
  @UseGuards(WorkspaceRoleGuard)
  @ApiOperation({ summary: "Remove invite url from workspace" })
  @ApiResponse({ status: 200, type: String })
  @Delete("/:workspaceId/removeInviteUrl")
  removeInviteUrl(@Param("workspaceId", ParseIntPipe) workspaceId: number) {
    return this.workspaceService.removeInviteUrl(workspaceId);
  }

  @ApiOperation({ summary: "Check invite url valid" })
  @ApiResponse({ status: 200, type: String })
  @Get("/checkInviteUrl/:code")
  checkInviteUrl(@Param("code") code: string) {
    return this.workspaceService.checkInviteUrl(code);
  }

  @ApiOperation({ summary: "Accept invite from url" })
  @ApiResponse({ status: 200, type: WorkspaceDto })
  @Post("/acceptInvite/:code")
  acceptInvite(@Param("code") code: string, @Req() req: ExtendedRequest) {
    return this.workspaceService.acceptInvite(code, req.userInfo.id);
  }
}
