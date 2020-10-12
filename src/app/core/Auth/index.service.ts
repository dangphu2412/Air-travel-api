import {TUserInfo, TJwtPayload} from "../../../common/type";
import {ConflictException, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UpsertUserDto} from "src/common/dto/User/upsert.dto";
import {User} from "src/common/entity";
import {IUserLoginResponse} from "src/common/interface/t.jwtPayload";
import {UserService} from "../User/index.service";
import {BcryptService} from "src/global/bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private service: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user: User = await this.service.findOne({
      where: {
        username
      },
      relations: ["role"]
    });
    if (user && BcryptService.compare(user.password, pass)) {
      return user;
    }
    return null;
  }

  login(user: User): IUserLoginResponse {
    const info: TUserInfo = {
      username: user.username
    }
    const payload: TJwtPayload = {
      userId: user.id,
      role: user.role.name,
      permissions: user.role.permissions
    }
    const loginResponse: IUserLoginResponse = {
      token: this.jwtService.sign(payload),
      info
    }
    return loginResponse;
  }

  async register(user: UpsertUserDto): Promise<User> {
    const {username} = user;
    const isExisted = await this.service.findByUsername(username);

    if (isExisted) throw new ConflictException("User existed");

    return this.service.createOneBase(user);
  }
}
