import { Controller, Body, Patch, Param, ParseIntPipe } from "@nestjs/common";
import { RoleService } from "./role.service";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Patch("/:id/changeWorkspaceRole")
  async changeWorkspaceRole(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateRole: UpdateRoleDto
  ) {
    return await this.roleService.changeWorkspaceMemberRole(
      id,
      updateRole.memberId,
      updateRole.role
    );
  }

  @Patch("/:id/changeProjectRole")
  async changeProjectRole(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateRole: UpdateRoleDto
  ) {
    return await this.roleService.changeProjectMemberRole(
      id,
      updateRole.memberId,
      updateRole.role
    );
  }
}
