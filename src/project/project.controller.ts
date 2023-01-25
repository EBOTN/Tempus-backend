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
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ReadProjectDto } from "./dto/read-project.dto";
import { GetProjectQuerry } from "./dto/get-project-querry.dto";

@ApiTags("projects")
@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: "Create project" })
  @ApiResponse({ status: 200, type: ReadProjectDto })
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @ApiOperation({ summary: "Get projects by filter" })
  @ApiResponse({ status: 200, type: [ReadProjectDto] })
  @Get()
  findAll(@Query() querry: GetProjectQuerry) {
    return this.projectService.findAll(querry);
  }

  @ApiOperation({ summary: "Get project by id" })
  @ApiResponse({ status: 200, type: ReadProjectDto })
  @Get("/:id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.projectService.findOne(id);
  }

  @ApiOperation({ summary: "Update project" })
  @ApiResponse({ status: 200, type: ReadProjectDto })
  @Put("/:id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto
  ) {
    return this.projectService.update(id, updateProjectDto);
  }

  @ApiOperation({ summary: "Delete project" })
  @ApiResponse({ status: 200, type: ReadProjectDto })
  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.projectService.remove(id);
  }

  @ApiOperation({ summary: "Add member to project" })
  @ApiResponse({ status: 200, type: ReadProjectDto })
  @Post("/:id/addMember")
  addMember(
    @Param("id", ParseIntPipe) id: number,
    @Body("memberId", ParseIntPipe) memberId: number
  ) {
    return this.projectService.addMember(id, memberId);
  }

  @ApiOperation({ summary: "Remove member from project" })
  @ApiResponse({ status: 200, type: ReadProjectDto })
  @Post("/:id/removeMember")
  removeMember(
    @Param("id", ParseIntPipe) id: number,
    @Body("memberId", ParseIntPipe) memberId: number
  ) {
    return this.projectService.removeMember(id, memberId);
  }
}
