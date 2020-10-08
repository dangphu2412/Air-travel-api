/* eslint-disable @typescript-eslint/no-unused-vars */
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { EMethod, EModule, ERole } from '../../common/enums/racl.enum';
import { enumToArray } from '../../utils/array';
import * as Entity from '../../common/entity';
import { RaclHelper } from './seed-helper/racl.helper';

export default class Seeding implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    try {
      await Promise.all(enumToArray(EMethod).map(method => {
        const dto = Entity.Method.create();
        dto.name = method;
        return dto.save();
      }))

      await Promise.all(enumToArray(EModule).map(module => {
        const dto = Entity.Module.create();
        dto.name = module;
        return dto.save();
      }))

      await Promise.all(enumToArray(ERole).map(role => {
        const dto = Entity.Role.create();
        dto.name = role;
        return dto.save();
      }))

      const methodEntities = await Entity.Method.find();
      const moduleEntities = await Entity.Module.find();
      const roleEntities = await Entity.Role.find();

      const permissionHelper = new RaclHelper();
      await permissionHelper.assignPermissionsToRoles(roleEntities, methodEntities,moduleEntities );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
