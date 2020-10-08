import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/app/core/Auth/index.service';
import { User } from '../entity';
import { UpsertUserDto } from '../dto/User/upsert.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, pass: string): Promise<User> {
    const user: User = await this.authService.validateUser(username, pass);
    if (!user) {
      throw new UnauthorizedException('Your username or password is not right');
    }
    return user;
  }
}