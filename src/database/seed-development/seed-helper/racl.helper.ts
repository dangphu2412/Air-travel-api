import * as Racl from '../../../common/enums/racl.enum';
import {  Permission, Role, Method, Module  } from '../../../common/entity';
import { TRacl } from 'src/common/type/t.Racl';

export class RaclHelper {
  private _racls: Array<TRacl>;

  constructor() {
    this._racls = this.getRacls();
  }

  private  getRacls(): Array<TRacl> {
    return [
      {
        role: Racl.ERole.ADMIN,
        permissions: [
          {
            method: Racl.EMethod.GET,
            module: Racl.EModule.USER,
          },
          {
            method: Racl.EMethod.DELETE,
            module: Racl.EModule.USER,
          },
          {
            method: Racl.EMethod.SOFT_DELETE,
            module: Racl.EModule.USER,
          },
          {
            method: Racl.EMethod.PUT,
            module: Racl.EModule.ROLE,
          },
          {
            method: Racl.EMethod.POST,
            module: Racl.EModule.ROLE,
          },
        ],
      },
      {
        role: Racl.ERole.MODERATOR,
        permissions: [
          {
            method: Racl.EMethod.GET,
            module: Racl.EModule.USER,
          },
          {
            method: Racl.EMethod.SOFT_DELETE,
            module: Racl.EModule.USER,
          },
        ],
      },
      {
        role: Racl.ERole.USER,
        permissions: [],
      },
    ]
  }
  private findPermissionDefinitionAndCreaete(roleEntities: Role[], permissionEntities: Permission[]) {
    return Promise.all(roleEntities.map(role => {
      const { permissions } = this._racls.find(racl => racl.role === role.name);
      role.permissions = permissions.map(permission => {
        const requiredPermission = permissionEntities.find(per =>
          per.method.name === permission.method
          && per.module.name === permission.module
        );
        return requiredPermission;
      })
      return role.save();
    }))
  }

  private createPermissions(methodEntities: Array<Method>, moduleEntities: Array<Module>) {
    return Promise.all(methodEntities.map(method => {
      return Promise.all(moduleEntities.map(module => {
        const dto = Permission.create();

        dto.method = method;
        dto.module = module
        dto.name = `${method.name}_${module.name}`;
        return dto.save();
      }));
    }))
  }

  public async assignPermissionsToRoles(roleEntities: Array<Role>, methodEntities: Array<Method>, moduleEntities: Array<Module>) {
    await this.createPermissions(methodEntities, moduleEntities);
    const permissionEntities = await Permission.find();
    await this.findPermissionDefinitionAndCreaete(roleEntities, permissionEntities);
  }
}