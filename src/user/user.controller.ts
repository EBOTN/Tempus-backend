import { Body, Controller, Get, Put, Query, Req } from "@nestjs/common";
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request } from "express";
import { UserDto } from "src/user/dto/user-dto";
import { TokenService } from "src/token/token.service";
import { UserService } from "./user.service";
import { FilterUserQuery } from "./dto/filter-user-query";
import { ExtendedRequest } from "src/shared/extended-request";
import { ChangeUserPasswordDto } from "./dto/change-user-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FormDataRequest, MemoryStoredFile } from "nestjs-form-data";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

  @ApiOperation({
    summary: "Get all users by filter",
    description: "Need authorization",
  })
  @ApiResponse({ status: 200, type: [UserDto] })
  @Get()
  async getAll(@Query() query: FilterUserQuery) {
    return await this.userService.getByFilter(query);
  }

  @ApiOperation({ summary: "Get current user" })
  @ApiResponse({ status: 200, type: UserDto })
  @Get("/currentUser")
  async getCurrentUser(@Req() req: ExtendedRequest) {
    return await this.userService.getById(req.userInfo.id);
  }

  @ApiOperation({ summary: "Update user" })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiConsumes("multipart/form-data")
  @Put()
  @FormDataRequest({ storage: MemoryStoredFile })
  async update(@Req() req: ExtendedRequest, @Body() body: UpdateUserDto) {
    return await this.userService.update(req.userInfo.id, body);
  }

  @ApiOperation({ summary: "Change password" })
  @ApiResponse({ status: 200, type: UserDto })
  @Put("/changePassword")
  async changePassword(
    @Req() req: ExtendedRequest,
    @Body() body: ChangeUserPasswordDto
  ) {
    return await this.userService.changePassword(req.userInfo.id, body);
  }
}
