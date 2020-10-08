import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Permission } from '../../common/entity/permission.entity';
import { Method } from '../../common/entity/method.entity';
import { Module } from '../../common/entity/module.entity';


define(Permission,
  (
    faker: typeof Faker,
    context: { method: Method, module: Module }
  ) => {
  const { method, module } = context;
  const dto = new Permission();
  dto.name = `${method.name}_${module.name}`;
  dto.method = method;
  dto.module = module;

  return dto;
})