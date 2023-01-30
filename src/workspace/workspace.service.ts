import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { GetWorkspacesQuerry } from "./dto/get-workspaces-querry.dto";
import { WorkspaceDto } from "./dto/workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { FileService } from "src/file/file.service";

@Injectable()
export class WorkspaceService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService
  ) {}
  async create(
    ownerId: number,
    createWorkspaceDto: CreateWorkspaceDto
  ): Promise<WorkspaceDto> {
    try {
      const coverUrl = await this.fileService.createFile(
        createWorkspaceDto.cover
      );
      const returnedData = await this.prisma.workSpace.create({
        data: {
          title: createWorkspaceDto.title,
          cover: coverUrl || undefined,
          ownerId,
        },
        include: {
          owner: true,
          members: {
            select: {
              member: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async findAll(querry: GetWorkspacesQuerry): Promise<WorkspaceDto[]> {
    try {
      const returnedData = await this.prisma.workSpace.findMany({
        where: {
          title: { contains: querry.title || "", mode: "insensitive" },
        },
        include: {
          owner: true,
          members: {
            select: {
              member: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        skip: querry.offset || undefined,
        take: querry.limit || undefined,
      });

      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async findOne(id: number): Promise<WorkspaceDto> {
    try {
      const returnedData = await this.prisma.workSpace.findFirst({
        where: { id },
        include: {
          owner: true,
          members: {
            select: {
              member: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
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
  ): Promise<WorkspaceDto> {
    try {
      const returnedData = await this.prisma.workSpace.update({
        where: { id },
        data: updateWorkspaceDto,
        include: {
          owner: true,
          members: {
            select: {
              member: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async remove(id: number): Promise<WorkspaceDto> {
    try {
      const returnedData = await this.prisma.workSpace.delete({
        where: { id },
        include: {
          owner: true,
          members: {
            select: {
              member: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async addMember(
    workspaceId: number,
    memberId: number
  ): Promise<WorkspaceDto> {
    try {
      const returnedData = await this.prisma.workSpace.update({
        where: { id: workspaceId },
        data: {
          members: {
            create: {
              memberId: memberId,
            },
          },
        },
        include: {
          owner: true,
          members: {
            select: {
              member: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async removeMember(
    workSpaceId: number,
    memberId: number
  ): Promise<WorkspaceDto> {
    try {
      const returnedData = await this.prisma.workSpace.update({
        where: {
          id: workSpaceId,
        },
        data: {
          members: {
            delete: {
              workspaceId_memberId: {
                workspaceId: workSpaceId,
                memberId: memberId,
              },
            },
          },
        },
        include: {
          owner: true,
          members: {
            select: {
              member: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }
}
