import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { ProjectRoleGuard } from "./ProjectRoleGuard";
import { WorkspaceRoleGuard } from "./workspace-role-guard";

@Injectable()
export class WorkspaceOrProjectRoleGuard implements CanActivate {
  constructor(
    private readonly workspaceRoleGuard: WorkspaceRoleGuard,
    private readonly projectRoleGuard: ProjectRoleGuard
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return (
      this.workspaceRoleGuard.canActivate(context) ||
      this.projectRoleGuard.canActivate(context)
    );
  }
}
