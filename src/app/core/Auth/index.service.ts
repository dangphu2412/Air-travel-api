import {TJwtPayload} from "../../../common/type";
import {ConflictException, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {User, Role} from "src/common/entity";
import {IUserInfo, IUserLoginResponse} from "src/common/interface/i.jwtPayload";
import {UserService} from "../User/index.service";
import {BcryptService} from "src/global/bcrypt";
import {CustomerError, UserError} from "src/common/constants";
import {LoginDto, RegisterDto} from "src/common/dto/User";
import {ErrorCodeEnum} from "src/common/enums";
import {CustomerService} from "../Customer/index.service";
import {TValidateUser} from "src/common/type/t.Validate";
import {pickServiceToValidate} from "src/utils";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private customerService: CustomerService,
    private jwtService: JwtService
  ) {}

  public getPermissions(role: Role): string[] {
    return role.permissions.map(permission => permission.name);
  }

  public getloginResponse(user: User, type: TValidateUser): IUserLoginResponse {
    const info: IUserInfo = {
      email: user.email,
      avatar: user.avatar,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role.name
    }
    const payload: TJwtPayload = {
      userId: user.id,
      permissions: this.getPermissions(user.role),
      type
    }
    const loginResponse: IUserLoginResponse = {
      token: this.jwtService.sign(payload),
      ...info
    }
    return loginResponse;
  }

  public turnoffUserExpired(user: any) {
    user.hasExpiredToken = false;
    return user.save();
  }

  public async validateUser(email: string, pass: string, type: TValidateUser): Promise<User> {
    const user: User = await pickServiceToValidate(type, this).findByEmail(email);
    if (user && BcryptService.compare(pass, user.password)) {
      return user;
    }
    throw new UnauthorizedException(
      UserError.Unauthorized,
      ErrorCodeEnum.INCORRECT_EMAIL_PASSWORD
    )
  }

  public async login(dto: LoginDto, type: TValidateUser): Promise<IUserLoginResponse> {
    const user = await this.validateUser(dto.email, dto.password, type);
    if (user.hasExpiredToken) {
      await this.turnoffUserExpired(user);
    }
    return this.getloginResponse(user, type);
  }

  public async register(dto: RegisterDto): Promise<IUserLoginResponse> {
    const {email} = dto;
    const service = pickServiceToValidate("CUSTOMER", this);
    const isExisted = await service.findByEmail(email);

    if (isExisted) {
      throw new ConflictException(
        CustomerError.ConflictExisted,
        ErrorCodeEnum.ALREADY_EXIST
      );
    }

    const user = await service.createOneBase(dto);
    return this.getloginResponse(user, "CUSTOMER");
  }

  getProfile(user: User): Promise<User> {
    return this.userService.getProfile(user);
  }
}
