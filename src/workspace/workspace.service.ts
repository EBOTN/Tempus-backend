import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}
  async create(createWorkspaceDto: CreateWorkspaceDto) {
    try {
      const returnedData = await this.prisma.workSpace.create({
        data: createWorkspaceDto,
      });
      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async findAll() {
    try {
      const returnedData = await this.prisma.workSpace.findMany();
      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async findOne(id: number) {
    try {
      const returnedData = await this.prisma.workSpace.findFirst({
        where: { id },
      });
      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    try {
      const returnedData = await this.prisma.workSpace.update({
        where: { id },
        data: updateWorkspaceDto,
      });
      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async remove(id: number) {
    try {
      const returnedData = await this.prisma.workSpace.delete({
        where: { id },
      });
      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }
}
