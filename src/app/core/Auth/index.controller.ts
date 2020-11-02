import {Body, Controller, Get, Post} from "@nestjs/common";
import {ApiBody, ApiTags} from "@nestjs/swagger";
import {CurrentUser, GrantAccess} from "src/common/decorators";
import {LoginDto} from "src/common/dto/User";
import {RegisterDto} from "src/common/dto/User/register.dto";
import {User} from "src/common/entity";
import {IUserLoginResponse} from "src/common/interface/i.jwtPayload";
import {AuthService} from "./index.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private service: AuthService) {}

  @Post("/login")
  @ApiBody({type: () => LoginDto})
  login(@Body() user: LoginDto): Promise<IUserLoginResponse> {
    return this.service.login(user, "USER");
  }

  @Post("/login/customer")
  @ApiBody({type: () => LoginDto})
  loginCustomer(@Body() user: LoginDto): Promise<IUserLoginResponse> {
    return this.service.login(user, "CUSTOMER");
  }

  @Post("/register/customer")
  @ApiBody({type: () => RegisterDto})
  registerCustomer(@Body() dto: RegisterDto): Promise<IUserLoginResponse> {
    return this.service.register(dto);
  }

  @GrantAccess({
    jwtOnly: true
  })
  @Get("/me")
  getProfile(@CurrentUser() user: User): Promise<User> {
    return this.service.getProfile(user);
  }
}
