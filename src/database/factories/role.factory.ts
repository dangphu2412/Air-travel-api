import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Role } from '../../common/entity/role.entity';
import { Permission } from '../../common/entity/permission.entity';

define(Role,
  (
    faker: typeof Faker,
    context: { name: string, permissions: Permission[] }
  ) => {
  const { name, permissions } = context;
  const dto = new Role();
  dto.name = name;
  dto.permissions = permissions;

  return dto;
})