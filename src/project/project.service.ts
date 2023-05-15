import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Roles } from "src/shared/roles-enum";
import { CreateProjectDto } from "./dto/create-project.dto";
import { GetProjectQuerry } from "./dto/get-project-querry.dto";
import { ProjectDto } from "./dto/read-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { RawMemberData } from "src/shared/raw-member-data";
import { MemberDto } from "src/shared/member-dto";
import { Roles as PrismaRoles } from "@prisma/client";
import { GetRoleDto } from "src/shared/get-role-dto";

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  async create(
    createProjectDto: CreateProjectDto,
    workspaceId: number,
    userId: number
  ): Promise<ProjectDto> {
    try {
      const data = await this.prisma.project.create({
        data: {
          workspaceId,
          ...createProjectDto,
          members: {
            create: {
              memberId: userId,
              role: Roles.Owner,
            },
          },
        },
        select: {
          id: true,
          title: true,
          isHidden: true,
          workspaceId: true,
          members: {
            select: {
              member: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
              role: true,
            },
          },
        },
      });
      const members = this.ConvertToMemberDto(data.members);
      const returnedData = { ...data, members };

      return returnedData;
    } catch (e) {
      console.log(e);
    }
  }

  async findAll(
    query: GetProjectQuerry,
    workspaceId: number
  ): Promise<ProjectDto[]> {
    const data = await this.prisma.project.findMany({
      where: {
        title: { contains: query.title || "", mode: "insensitive" },
        isHidden: query.filter === "showHidden" ? true : undefined,
        workspaceId: workspaceId,
      },
      select: {
        id: true,
        title: true,
        isHidden: true,
        workspaceId: true,
        members: {
          select: {
            member: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            role: true,
          },
        },
      },
      skip: query.offset || undefined,
      take: query.limit || undefined,
    });
    // if (!data || data.length === 0)
    //   throw new BadRequestException("Projects not found");
    const returnedData = data.map((obj) => {
      const members = this.ConvertToMemberDto(obj.members);
      return { ...obj, members };
    });
    return returnedData;
  }

  async findProjects(
    query: GetProjectQuerry,
    userId: number,
    workspaceId: number
  ): Promise<ProjectDto[]> {
    let filter;
    switch (query.filter) {
      case "showHidden": {
        filter = { isHidden: true };
        break;
      }
      case "all": {
        filter = null;
      }
      default: {
        filter = { isHidden: false };
      }
    }
    const data = await this.prisma.project.findMany({
      where: {
        title: { contains: query.title || "", mode: "insensitive" },
        ...filter,
        workspaceId: workspaceId,
        members: {
          some: {
            memberId: userId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        workspaceId: true,
        isHidden: true,
        members: {
          select: {
            member: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            role: true,
          },
        },
      },
      skip: query.offset || undefined,
      take: query.limit || undefined,
    });
    // if (!data || data.length === 0)
    //   throw new BadRequestException("Projects not found");

    const returnedData = data.map((obj) => {
      const members = this.ConvertToMemberDto(obj.members);
      return { ...obj, members };
    });
    return returnedData;
  }

  async findOne(id: number): Promise<ProjectDto> {
    const data = await this.prisma.project.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        workspaceId: true,
        isHidden: true,
        members: {
          select: {
            member: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            role: true,
          },
        },
      },
    });
    if (!data) throw new BadRequestException("Project not found");
    const members = this.ConvertToMemberDto(data.members);
    const returnedData = { ...data, members };
    return returnedData;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto
  ): Promise<ProjectDto> {
    try {
      const data = await this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
        select: {
          id: true,
          title: true,
          workspaceId: true,
          isHidden: true,
          members: {
            select: {
              member: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
              role: true,
            },
          },
        },
      });
      if (!data) throw new BadRequestException("Project not found");
      const members = this.ConvertToMemberDto(data.members);
      const returnedData = { ...data, members };
      return returnedData;
    } catch (e) {
      console.log(e);
    }
  }

  async remove(id: number): Promise<ProjectDto> {
    try {
      const data = await this.prisma.project.delete({
        where: { id },
        select: {
          id: true,
          title: true,
          workspaceId: true,
          isHidden: true,
          members: {
            select: {
              member: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
              role: true,
            },
          },
        },
      });
      if (!data) throw new BadRequestException("Project not found");
      const members = this.ConvertToMemberDto(data.members);
      const returnedData = { ...data, members };
      return returnedData;
    } catch (e) {}
  }

  async addMember(projectId: number, userId: number): Promise<ProjectDto> {
    try {
      const data = await this.prisma.project.update({
        where: {
          id: projectId,
        },
        select: {
          id: true,
          title: true,
          workspaceId: true,
          isHidden: true,
          members: {
            select: {
              member: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
              role: true,
            },
          },
        },
        data: {
          members: {
            create: {
              member: {
                connect: {
                  id: userId,
                },
              },
            },
          },
        },
      });
      if (!data) throw new BadRequestException("Project not found");
      const members = this.ConvertToMemberDto(data.members);
      const returnedData = { ...data, members };
      return returnedData;
    } catch (e) {}
  }

  async removeMember(projectId: number, userId: number): Promise<ProjectDto> {
    try {
      const memberInfo = await this.prisma.projectMembers.findFirst({
        where: {
          projectId,
          member: {
            id: userId,
          },
        },
      });
      const data = await this.prisma.project.update({
        where: {
          id: projectId,
        },
        select: {
          id: true,
          title: true,
          workspaceId: true,
          isHidden: true,
          members: {
            select: {
              member: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
              role: true,
            },
          },
        },
        data: {
          members: {
            delete: {
              id: memberInfo.id,
            },
          },
        },
      });
      if (!data) throw new BadRequestException("Project not found");
      const members = this.ConvertToMemberDto(data.members);
      const returnedData = { ...data, members };
      return returnedData;
    } catch (e) {}
  }

  async changeProjectMemberRole(
    projectId: number,
    userId: number,
    role: Roles
  ) {
    const returnedData = await this.prisma.projectMembers.update({
      where: {
        projectId_memberId: {
          projectId,
          memberId: userId,
        },
      },
      data: {
        role,
      },
    });
    return returnedData;
  }

  async getRole(projectId: number, userId: number): Promise<GetRoleDto> {
    const returnedData = await this.prisma.projectMembers.findFirst({
      where: {
        memberId: userId,
        projectId,
      },
      select: {
        role: true,
      },
    });
    if (!returnedData)
      throw new BadRequestException("Project or member not found");
    return returnedData;
  }

  private ConvertToMemberDto(data: RawMemberData[]): MemberDto[] {
    return data.map((item) => ({ ...item.member, role: item.role }));
  }
}
