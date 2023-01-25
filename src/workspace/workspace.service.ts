import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { ReadWorkSpaceDto } from "./dto/read-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}
  async create(
    createWorkspaceDto: CreateWorkspaceDto
  ): Promise<ReadWorkSpaceDto> {
    try {
      const returnedData = await this.prisma.workSpace.create({
        data: createWorkspaceDto,
        include: { owner: true },
      });
      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async findAll(): Promise<ReadWorkSpaceDto[]> {
    try {
      const returnedData = await this.prisma.workSpace.findMany({
        include: { owner: true },
      });
      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async findOne(id: number): Promise<ReadWorkSpaceDto> {
    try {
      const returnedData = await this.prisma.workSpace.findFirst({
        where: { id },
        include: { owner: true },
      });
      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async update(
    id: number,
    updateWorkspaceDto: UpdateWorkspaceDto
  ): Promise<ReadWorkSpaceDto> {
    try {
      const returnedData = await this.prisma.workSpace.update({
        where: { id },
        data: updateWorkspaceDto,
        include: { owner: true },
      });
      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async remove(id: number): Promise<ReadWorkSpaceDto> {
    try {
      const returnedData = await this.prisma.workSpace.delete({
        where: { id },
        include: { owner: true },
      });
      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }
}
