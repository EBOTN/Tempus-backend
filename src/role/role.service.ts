import { Injectable } from "@nestjs/common";
import { Roles } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

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
}
