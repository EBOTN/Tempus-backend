import { Body, Controller, Get, Param, Put, Query, Req } from "@nestjs/common";
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import { UserDto } from "src/user/dto/user-dto";
import { TokenService } from "src/token/token.service";
import { UserService } from "./user.service";
import { FilterUserQuery } from "./dto/filter-user-query";
import { ExtendedRequest } from "src/shared/extended-request";
import { ChangeUserPasswordDto } from "./dto/change-user-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FormDataRequest, MemoryStoredFile } from "nestjs-form-data";
import { Post, Res } from "@nestjs/common/decorators";
import { ChangeUserMailDto } from "./dto/change-user-mail.dto";

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
  @ApiResponse({ status: 200 })
  @Put("/changePassword")
  async changePassword(
    @Req() req: ExtendedRequest,
    @Body() body: ChangeUserPasswordDto
  ) {
    return await this.userService.changePassword(req.userInfo.id, body);
  }

  // @ApiOperation({ summary: "Check change mail token for validation" })
  // @ApiResponse({ status: 200 })
  // @Get("/checkMailToken/:token")
  // async checkChangeMailToken(@Param("token") token: string, @Res() res: Response) {
  //   return await this.userService.checkMailToken(token, res);
  // }

  @ApiOperation({ summary: "Change mail by token" })
  @ApiResponse({ status: 200 })
  @Get("/confirmChangeMail/:token")
  async confirmChangeMail(@Param("token") token: string){
    return await this.userService.confirmChangeMail(token)
  }

  @Post("/changeMail")
  async changeMail(@Req() req: ExtendedRequest, @Body() body: ChangeUserMailDto){
    return await this.userService.changeMail(req.userInfo.id, body.email)
  }
}
