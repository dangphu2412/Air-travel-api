import { ApiTags } from '@nestjs/swagger';
import { Controller, Patch, Param } from '@nestjs/common';
import { Crud, CrudController, CrudAuth } from '@nestjsx/crud';
import { UpsertUserDto } from 'src/common/dto/User/upsert.dto';
import { User } from 'src/common/entity';
import { UserService } from './index.service';
import { CurrentUser } from 'src/common/decorators';
import { GrantAccess } from 'src/common/decorators';

@Crud({
  model: {
    type: User,
  },
  query: {
    exclude: ['password']
  },
  dto: {
    create: UpsertUserDto,
    update: UpsertUserDto,
    replace: UpsertUserDto
  },
  routes: {
    exclude: ['createManyBase']
  }
})
@ApiTags('Users')
@Controller('users')
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}

  @Patch('/restore/:id')
  @GrantAccess()
  restoreUser(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    return this.service.restoreUser(id, user);
  }
}
