import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { userDTO } from "src/user/dto/user-dto";
import { TokenService } from "src/token/token.service";
import { UserService } from "./user.service";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all users", description: "Need authorization" })
  @ApiResponse({ status: 200, type: [userDTO] })
  @Get()
  async getAll() {
    return await this.userService.getAllUser();
  }

  // TODO: Add validation
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get current user" })
  @ApiResponse({ status: 200, type: userDTO })
  @Get("/currentUser")
  async getCurrentUser(@Req() req: Request) {
    return await this.tokenService.validateAccessToken(req.cookies.accessToken);
  }
}
