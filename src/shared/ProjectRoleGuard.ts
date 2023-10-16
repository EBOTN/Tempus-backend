import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectRoleGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!isNumber(request.params.id)) throw new BadRequestException();

    const member = await this.prisma.projectMembers.findFirst({
      where: {
        projectId: +request.params.projectId,
        memberId: +request.userInfo.id,
      },
      select: {
        role: true,
      },
    });
    if (!member) throw new BadRequestException("Project or member not found");
    const roles = this.reflector.get<string[]>("projectRoles", context.getHandler());
    if (!roles) {
      return true;
    }

    return this.matchRoles(roles, member.role);
  }
  private matchRoles(roles: string[], userRole: string) {
    if (roles.includes(userRole)) {
      return true;
    }
    return false;
  }
}
function isNumber(str: string): boolean {
  if (typeof str !== "string") {
    return false;
  }

  if (str.trim() === "") {
    return false;
  }

  return !Number.isNaN(Number(str));
}
