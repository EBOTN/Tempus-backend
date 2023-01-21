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
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ReadProjectDto } from "./dto/read-project.dto";

@ApiTags("projects")
@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create project" })
  @ApiResponse({ status: 200, type: ReadProjectDto })
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all projects" })
  @ApiResponse({ status: 200, type: [ReadProjectDto] })
  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get project by id" })
  @ApiResponse({ status: 200, type: ReadProjectDto })
  @Get("/:id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.projectService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update project" })
  @ApiResponse({ status: 200, type: ReadProjectDto })
  @Put("/:id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto
  ) {
    return this.projectService.update(id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete project" })
  @ApiResponse({ status: 200, type: ReadProjectDto })
  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.projectService.remove(id);
  }
}
