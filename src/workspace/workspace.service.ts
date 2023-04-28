import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma, Roles } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { GetWorkspacesQuerry } from "./dto/get-workspaces-querry.dto";
import { CountDto, WorkspaceDto } from "./dto/workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { FileService } from "src/file/file.service";
import { MemberDto } from "src/shared/member-dto";
import { RawMemberData } from "src/shared/raw-member-data";
import { GetRoleDto } from "src/shared/get-role-dto";
import { SelectWorkspaceDto } from "./dto/workspace.selector";
import { RawCountDto } from "src/shared/raw-count-dto";

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
        createWorkspaceDto.coverFile
      );
      const data = await this.prisma.workSpace.create({
        data: {
          title: createWorkspaceDto.title,
          cover: coverUrl || undefined,
          ownerId,
          members: {
            create: {
              memberId: ownerId,
              role: Roles.Owner,
            },
          },
        },
        select: SelectWorkspaceDto,
      });

      const members = this.ConvertToMemberDto(data.members);
      const count = this.ConvertToCountDto(data._count);
      delete data["_count"];
      const returnedData = { ...data, members, count };

      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async findAll(
    userId: number,
    querry: GetWorkspacesQuerry
  ): Promise<WorkspaceDto[]> {
    try {
      let getFilter: {
        ownerId?: number;
        NOT?: { ownerId: number };
        members?:
          | { some: { memberId: number } }
          | { some: { memberId: number } };
      };
      switch (querry.filter) {
        case "own": {
          getFilter = { ownerId: userId };
          break;
        }
        case "others": {
          getFilter = {
            NOT: { ownerId: userId },
            members: {
              some: {
                memberId: userId,
              },
            },
          };
          break;
        }
        default: {
          getFilter = {
            members: {
              some: {
                memberId: userId,
              },
            },
          };
          break;
        }
      }

      const data = await this.prisma.workSpace.findMany({
        where: {
          title: { contains: querry.title || "", mode: "insensitive" },
          ...getFilter,
        },
        select: SelectWorkspaceDto,
        skip: querry.offset || undefined,
        take: querry.limit || undefined,
      });
      const returnedData = data.map((obj) => {
        const members = this.ConvertToMemberDto(obj.members);
        const count = this.ConvertToCountDto(obj._count);
        delete obj["_count"];
        return { ...obj, members, count };
      });

      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async findOne(userId: number, id: number): Promise<WorkspaceDto> {
    try {
      const data = await this.prisma.workSpace.findFirst({
        where: {
          id,
          OR: [
            { ownerId: userId },
            { members: { some: { memberId: userId } } },
          ],
        },
        select: SelectWorkspaceDto,
      });

      const members = this.ConvertToMemberDto(data.members);
      const count = this.ConvertToCountDto(data._count);
      delete data["_count"];
      const returnedData = { ...data, members, count };

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
      let coverUrl: string;

      if (updateWorkspaceDto.coverFile) {
        coverUrl = await this.fileService.createFile(
          updateWorkspaceDto.coverFile
        );
      }
      if (coverUrl) {
        const { cover } = await this.prisma.workSpace.findFirst({
          where: { id },
          select: {
            cover: true,
          },
        });
        if (cover) await this.fileService.deleteFile(cover);
      }

      const data = await this.prisma.workSpace.update({
        where: { id },
        data: {
          title: updateWorkspaceDto.title,
          cover: coverUrl || undefined,
          ownerId: updateWorkspaceDto.ownerId,
        },
        select: SelectWorkspaceDto,
      });

      const members = this.ConvertToMemberDto(data.members);
      const count = this.ConvertToCountDto(data._count);
      delete data["_count"];
      const returnedData = { ...data, members, count };

      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async remove(id: number): Promise<WorkspaceDto> {
    try {
      const data = await this.prisma.workSpace.delete({
        where: { id },
        select: SelectWorkspaceDto,
      });

      const members = this.ConvertToMemberDto(data.members);
      const count = this.ConvertToCountDto(data._count);
      delete data["_count"];
      const returnedData = { ...data, members, count };

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
      const data = await this.prisma.workSpace.update({
        where: { id: workspaceId },
        data: {
          members: {
            create: {
              memberId: memberId,
            },
          },
        },
        select: SelectWorkspaceDto,
      });

      const members = this.ConvertToMemberDto(data.members);
      const count = this.ConvertToCountDto(data._count);
      delete data["_count"];
      const returnedData = { ...data, members, count };

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
      const data = await this.prisma.workSpace.update({
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
        select: SelectWorkspaceDto,
      });

      const members = this.ConvertToMemberDto(data.members);
      const count = this.ConvertToCountDto(data._count);
      delete data["_count"];
      const returnedData = { ...data, members, count };

      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async changeWorkspaceMemberRole(
    workspaceId: number,
    userId: number,
    role: Roles
  ) {
    const returnedData = await this.prisma.workSpaceMembers.update({
      where: {
        workspaceId_memberId: {
          workspaceId,
          memberId: userId,
        },
      },
      data: {
        role,
      },
    });
    return returnedData;
  }

  async getRole(workspaceId: number, id: number): Promise<GetRoleDto> {
    const returnedData = await this.prisma.workSpaceMembers.findFirst({
      where: {
        workspaceId,
        memberId: id,
      },
      select: {
        role: true,
      },
    });
    if (!returnedData)
      throw new BadRequestException("Workspace or meber not found");
    return returnedData;
  }

  private ConvertToMemberDto(data: RawMemberData[]): MemberDto[] {
    return data.map((item) => ({ ...item.member, role: item.role }));
  }

  private ConvertToCountDto(data: RawCountDto): CountDto {
    const count = data;
    return count;
  }
}
