import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
import { env } from "process";

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
      const workspace = await this.prisma.workSpace.create({
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

      const returnedData = this.ConvertToWorkspaceDto(workspace);

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
        return this.ConvertToWorkspaceDto(obj);
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
      const workspace = await this.prisma.workSpace.findFirst({
        where: {
          id,
          OR: [
            { ownerId: userId },
            { members: { some: { memberId: userId } } },
          ],
        },
        select: SelectWorkspaceDto,
      });
      const returnedData = this.ConvertToWorkspaceDto(workspace);

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

      const updatedWorkspace = await this.prisma.workSpace.update({
        where: { id },
        data: {
          title: updateWorkspaceDto.title,
          cover: coverUrl || undefined,
          ownerId: updateWorkspaceDto.ownerId,
        },
        select: SelectWorkspaceDto,
      });
      const returnedData = this.ConvertToWorkspaceDto(updatedWorkspace);

      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
    }
  }

  async remove(id: number): Promise<WorkspaceDto> {
    try {
      const updatedWorkspace = await this.prisma.workSpace.delete({
        where: { id },
        select: SelectWorkspaceDto,
      });

      const returnedData = this.ConvertToWorkspaceDto(updatedWorkspace);

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
      const updatedWorkspace = await this.prisma.workSpace.update({
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
      const returnedData = this.ConvertToWorkspaceDto(updatedWorkspace);

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
      const updatedWorkspace = await this.prisma.workSpace.update({
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

      const returnedData = this.ConvertToWorkspaceDto(updatedWorkspace);

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
  ): Promise<WorkspaceDto> {
    const members = await this.prisma.workSpaceMembers.update({
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
    const workspace = await this.prisma.workSpace.findFirst({
      where: {
        id: workspaceId,
      },
      select: SelectWorkspaceDto,
    });
    if (!workspace) throw new NotFoundException();
    const returnedData = this.ConvertToWorkspaceDto(workspace);
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

  async generateInviteUrl(workspaceId: number): Promise<string> {
    const code = Math.random().toString(36).substring(7);
    try {
      const updatedWorkspace = await this.prisma.workSpace.update({
        where: {
          id: workspaceId,
        },
        data: {
          WorkspaceInviteUrl: {
            upsert: {
              create: { code },
              update: {
                code,
              },
            },
          },
        },
        select: SelectWorkspaceDto,
      });
      const returnedData = `${env.FRONT_URL}/invite/${code}`;
      return returnedData;
    } catch (e) {}
  }

  async getInviteUrl(workspaceId: number): Promise<String> {
    const workspace = await this.prisma.workSpace.findFirst({
      where: {
        id: workspaceId,
      },
      select: {
        WorkspaceInviteUrl: {
          select: {
            code: true,
          },
        },
      },
    });
    if (!workspace) throw new BadRequestException("Workspace not found");
    return `${env.FRONT_URL}/invite/${workspace.WorkspaceInviteUrl.code}`;
  }

  async removeInviteUrl(workspaceId: number) {
    try {
      const updatedWorkspace = await this.prisma.workSpace.update({
        where: {
          id: workspaceId,
        },
        data: {
          WorkspaceInviteUrl: {
            delete: true,
          },
        },
        select: SelectWorkspaceDto,
      });
      return "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        throw new BadRequestException("Invite url not found");
    }
  }

  async checkInviteUrl(code: string): Promise<WorkspaceDto> {
    const workspace = await this.prisma.workSpace.findFirst({
      where: {
        WorkspaceInviteUrl: {
          code,
        },
      },
      select: SelectWorkspaceDto,
    });
    if (!workspace) throw new NotFoundException();
    const returnedData = this.ConvertToWorkspaceDto(workspace);
    return returnedData;
  }

  async acceptInvite(code: string, userId: number): Promise<WorkspaceDto> {
    const workspace = await this.prisma.workSpace.findFirst({
      where: {
        WorkspaceInviteUrl: {
          code,
        },
      },
      select: {
        id: true,
      },
    });
    if (!workspace) throw new BadRequestException("Workspace not found");
    try {
      const updatedWorkspace = await this.prisma.workSpace.update({
        where: { id: workspace.id },
        data: {
          members: {
            create: {
              memberId: userId,
            },
          },
        },
        select: SelectWorkspaceDto,
      });

      const returnedData = this.ConvertToWorkspaceDto(updatedWorkspace);
      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002")
          throw new BadRequestException(
            "You are already a member of this workspace"
          );
      }
    }
  }

  private ConvertToMemberDto(data: RawMemberData[]): MemberDto[] {
    return data.map((item) => ({ ...item.member, role: item.role }));
  }

  private ConvertToCountDto(data: RawCountDto): CountDto {
    const count = data;
    return count;
  }

  private ConvertToWorkspaceDto(data): WorkspaceDto {
    const members = this.ConvertToMemberDto(data.members);
    const count = this.ConvertToCountDto(data._count);
    delete data["_count"];
    const returnedData = { ...data, members, count };

    return returnedData;
  }
}
