import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  Patch,
  Req,
  SetMetadata,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProjectDto } from "./dto/read-project.dto";
import { GetProjectQuerry } from "./dto/get-project-querry.dto";
import { UpdateRoleDto } from "src/shared/update-role.dto";
import { ExtendedRequest } from "src/shared/extended-request";
import { WorkspaceRoleGuard } from "src/shared/workspace-role-guard";

@ApiTags("projects")
@Controller("workspace/:id/projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: "Create project" })
  @ApiResponse({ status: 200, type: ProjectDto })
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @SetMetadata("roles", ["Owner", "Manager", "Member"])
  @UseGuards(WorkspaceRoleGuard)
  @ApiOperation({ summary: "Get projects by filter" })
  @ApiResponse({ status: 200, type: [ProjectDto] })
  @Get("getProjects")
  getProjects(
    @Query() querry: GetProjectQuerry,
    @Req() req: ExtendedRequest,
    @Param("id", ParseIntPipe) workspaceId: number
  ) {
    return this.projectService.findProjects(
      querry,
      req.userInfo.id,
      workspaceId
    );
  }

  @SetMetadata("roles", ["Owner", "Manager"])
  @UseGuards(WorkspaceRoleGuard)
  @ApiOperation({
    summary: "Get all projects by filter (for workspace owner|manager)",
  })
  @ApiResponse({ status: 200, type: [ProjectDto] })
  @Get("getAllProjects")
  getAllProjects(
    @Query() querry: GetProjectQuerry,
    @Param("id", ParseIntPipe) workspaceId: number
  ) {
    return this.projectService.findAll(querry, workspaceId);
  }

  @ApiOperation({ summary: "Get project by id" })
  @ApiResponse({ status: 200, type: ProjectDto })
  @Get("/:projectId")
  findOne(@Param("projectId", ParseIntPipe) projectId: number) {
    return this.projectService.findOne(projectId);
  }

  @ApiOperation({ summary: "Update project" })
  @ApiResponse({ status: 200, type: ProjectDto })
  @Put("/:projectId")
  update(
    @Param("projectId", ParseIntPipe) projectId: number,
    @Body() updateProjectDto: UpdateProjectDto
  ) {
    return this.projectService.update(projectId, updateProjectDto);
  }

  @ApiOperation({ summary: "Delete project" })
  @ApiResponse({ status: 200, type: ProjectDto })
  @Delete("/:projectId")
  remove(@Param("projectId", ParseIntPipe) projectId: number) {
    return this.projectService.remove(projectId);
  }

  @ApiOperation({ summary: "Add member to project" })
  @ApiResponse({ status: 200, type: ProjectDto })
  @Post("/:projectId/addMember")
  addMember(
    @Param("projectId", ParseIntPipe) projectId: number,
    @Body("memberId", ParseIntPipe) memberId: number
  ) {
    return this.projectService.addMember(projectId, memberId);
  }

  @ApiOperation({ summary: "Remove member from project" })
  @ApiResponse({ status: 200, type: ProjectDto })
  @Post("/:projectId/removeMember")
  removeMember(
    @Param("projectId", ParseIntPipe) projectId: number,
    @Body("memberId", ParseIntPipe) memberId: number
  ) {
    return this.projectService.removeMember(projectId, memberId);
  }

  @Patch("/:projectId/changeProjectRole")
  async changeProjectRole(
    @Param("projectId", ParseIntPipe) projectId: number,
    @Body() updateRole: UpdateRoleDto
  ) {
    return await this.projectService.changeProjectMemberRole(
      projectId,
      updateRole.memberId,
      updateRole.role
    );
  }
}
