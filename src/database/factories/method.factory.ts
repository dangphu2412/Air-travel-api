import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Method } from '../../common/entity/method.entity';

define(Method, (faker: typeof Faker, context: { name: string }) => {
  const { name } = context;
  const dto = new Method();
  dto.name = name;
  return dto;
})