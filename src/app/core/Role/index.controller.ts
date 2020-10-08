import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { Role } from 'src/common/entity';
import { RoleService } from './index.service';

@Crud({
  model: {
    type: Role,
  },
  routes: {
    only: ['getManyBase']
  }
})
@ApiTags('Roles')
@Controller('roles')
export class RoleController implements CrudController<Role> {
  constructor(public service: RoleService) {}
}
