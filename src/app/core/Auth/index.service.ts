import {TJwtPayload} from "../../../common/type";
import {ConflictException, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {User, Role} from "src/common/entity";
import {IUserInfo, IUserLoginResponse} from "src/common/interface/i.jwtPayload";
import {UserService} from "../User/index.service";
import {BcryptService} from "src/global/bcrypt";
import {UserError} from "src/common/constants";
import {LoginDto, RegisterDto} from "src/common/dto/User";
import {ErrorCodeEnum} from "src/common/enums";

@Injectable()
export class AuthService {
  constructor(
    private service: UserService,
    private jwtService: JwtService
  ) {}

  private getPermissions(role: Role): string[] {
    return role.permissions.map(permission => permission.name);
  }

  private getloginResponse(user: User): IUserLoginResponse {
    const info: IUserInfo = {
      email: user.email,
      avatar: user.avatar,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role.name
    }
    const payload: TJwtPayload = {
      userId: user.id,
      permissions: this.getPermissions(user.role)
    }
    const loginResponse: IUserLoginResponse = {
      token: this.jwtService.sign(payload),
      ...info
    }
    return loginResponse;
  }

  private turnoffUserExpired(user: User) {
    user.hasExpiredToken = false;
    return user.save();
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user: User = await this.service.findByEmail(email);
    if (user && BcryptService.compare(pass, user.password)) {
      return user;
    }
    throw new UnauthorizedException(
      UserError.Unauthorized,
      ErrorCodeEnum.INCORRECT_EMAIL_PASSWORD
    )
  }

  async login(dto: LoginDto): Promise<IUserLoginResponse> {
    const user: User = await this.validateUser(dto.email, dto.password);
    if (user.hasExpiredToken) {
      await this.turnoffUserExpired(user);
    }
    return this.getloginResponse(user);
  }

  async register(dto: RegisterDto): Promise<IUserLoginResponse> {
    const {email} = dto;
    const isExisted = await this.service.findByEmail(email);

    if (isExisted) {
      throw new ConflictException(
        UserError.ConflictExisted,
        ErrorCodeEnum.ALREADY_EXIST
      );
    }

    const user = await this.service.createOneBase(dto);
    return this.getloginResponse(user);
  }

  getProfile(user: User): Promise<User> {
    return this.service.getProfile(user);
  }
}
