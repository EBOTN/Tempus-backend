import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { userDTO } from "src/user/dto/user-dto";
import { TokenService } from "src/token/token.service";
import { UserService } from "./user.service";
import { FilterUserQuery } from "./dto/filter-user-query";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all users by filter", description: "Need authorization" })
  @ApiResponse({ status: 200, type: [userDTO] })
  @Get()
  async getAll(@Query() query: FilterUserQuery) {
    return await this.userService.getByFilter(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get current user" })
  @ApiResponse({ status: 200, type: userDTO })
  @Get("/currentUser")
  async getCurrentUser(@Req() req: Request) {
    return await this.tokenService.validateAccessToken(req.cookies.accessToken);
  }
}
