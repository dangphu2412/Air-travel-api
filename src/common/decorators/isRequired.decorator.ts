import { applyDecorators } from '@nestjs/common';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional, IsNotEmpty } from 'class-validator';

const { CREATE, UPDATE } = CrudValidationGroups;

export function IsRequired() {
  return applyDecorators(
    IsOptional({ groups: [UPDATE] }),
    IsNotEmpty({ groups: [CREATE] })
  );
}
