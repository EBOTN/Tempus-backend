import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ReadProjectDto } from "./dto/read-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  async create(createProjectDto: CreateProjectDto): Promise<ReadProjectDto> {
    try {
      const returnedData = await this.prisma.projects.create({
        data: createProjectDto,
        select: {
          id: true,
          title: true,
          description: true,
          isHidden: true,
        },
      });
      return returnedData;
    } catch (e) {
      console.log(e);
    }
  }

  async findAll(): Promise<ReadProjectDto[]> {
    return await this.prisma.projects.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        isHidden: true,
      },
    });
  }

  async findOne(id: number): Promise<ReadProjectDto> {
    const returnedData = await this.prisma.projects.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        isHidden: true,
      },
    });
    return returnedData;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto
  ): Promise<ReadProjectDto> {
    try {
      const returnedData = await this.prisma.projects.update({
        where: { id },
        data: updateProjectDto,
        select: {
          id: true,
          title: true,
          description: true,
          isHidden: true,
        },
      });
      return returnedData;
    } catch (e) {
      console.log(e);
    }
  }

  async remove(id: number): Promise<ReadProjectDto> {
    const returnedData = await this.prisma.projects.delete({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        isHidden: true,
      },
    });
    return returnedData;
  }
}
