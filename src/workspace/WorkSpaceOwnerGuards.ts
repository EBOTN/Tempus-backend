import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";

@Injectable()
export class WorkSpaceOwnerGuard implements CanActivate {
  constructor(private workSpaceService: WorkspaceService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const workSpaceId: number = +req.params.id;
      const { id } = req.userInfo;
      const workSpaceData = await this.workSpaceService.findOne(
        id,
        workSpaceId
      );
      if (!workSpaceData) return false;

      if (id === workSpaceData.owner.id) return true;
      throw new ForbiddenException({ message: "You are not owner!" });
    } catch (e) {
      throw new ForbiddenException({ message: "You are not owner!" });
    }
  }
}
