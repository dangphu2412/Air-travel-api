import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Module } from '../../common/entity/module.entity';

define(Module, (faker: typeof Faker, context: { name: string }) => {
  const { name } = context;
  const dto = new Module();
  dto.name = name;
  return dto;
})