import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { RegisterDto } from 'src/common/dto/User/register.dto';
import { UpsertUserDto } from 'src/common/dto/User/upsert.dto';
import { User } from 'src/common/entity';
import { LocalAuthGuard } from 'src/common/guards/local.guard';
import { AuthService } from './index.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: () => RegisterDto })
  login(@CurrentUser() user: User) {
    return this.service.login(user);
  }

  @Post('/register')
  @ApiBody({ type: () => RegisterDto })
  register(@Body() dto: UpsertUserDto) {
    return this.service.register(dto);
  }
}
