import {ECrudAction, ECrudFeature, ERole} from "../../../common/enums";
import {Permission, Role} from "../../../common/entity";
import {TRacl} from "../../../common/type/t.Racl";
import {enumToArray} from "../../../utils/array";
import {flatMap} from "lodash";
import {TCrudOptions} from "../../../common/type/t.CrudAction";
import {In} from "typeorm";

export class RaclHelper {
  private _racls: Array<TRacl>;

  constructor() {
    this._racls = this.getRacls();
  }

  private getRacls(): Array<TRacl> {
    return [
      {
        role: ERole.ADMIN,
        permissions: [
          "ALL"
        ]
      },
      {
        role: ERole.OPERATOR,
        permissions: flatMap([
          ...this.createManyPermissionFromFeature(ECrudFeature.USER, {
            exclude: ["DELETE", "REPLACE"]
          }),
          ...this.createManyPermissionFromFeature(ECrudFeature.ROLE),
          ...this.createManyPermissionFromFeature(ECrudFeature.PROVIDER)
        ])
      },
      {
        role: ERole.SALE,
        permissions: flatMap([
          ...this.createManyPermissionFromFeature(ECrudFeature.BILL),
          ...this.createManyPermissionFromFeature(ECrudFeature.BILL_INFO),
          ...this.createManyPermissionFromFeature(ECrudFeature.BILL_SERVICE),
          ...this.createManyPermissionFromFeature(ECrudFeature.CUSTOMER),
          ...this.createManyPermissionFromFeature(ECrudFeature.PAYMENT),
          ...this.createManyPermissionFromFeature(ECrudFeature.DESTINATION),
          ...this.createManyPermissionFromFeature(ECrudFeature.PROVIDER)
        ])
      },
      {
        role: ERole.INTERN,
        permissions: [
          ...this.createManyPermissionFromFeature(ECrudFeature.BILL, {
            only: ["READ"]
          }),
          ...this.createManyPermissionFromFeature(ECrudFeature.BILL_INFO, {
            only: ["READ"]
          })
        ]
      },
      {
        role: ERole.CUSTOMER,
        permissions: [
        ]
      }
    ]
  }

  private createPermissions() {
    return Promise.all(enumToArray(ECrudFeature).map(feature => {
      return Promise.all(enumToArray(ECrudAction).map(action => {
        const permission = this.createPermission(feature, action);
        const dto = new Permission();
        dto.name = permission;
        return dto.save();
      }))
    }))
  }

  private createSuperPermission() {
    const dto = new Permission();
    dto.name = "ALL";
    return dto.save();
  }

  public createPermission(feature: string, action: string): string {
    return `${feature}_${action}`;
  }

  public createManyPermissionFromFeature(feature: string, options?: TCrudOptions): string[] {
    let actions = enumToArray(ECrudAction);

    if (options) {
      if (options.exclude) {
        actions = actions.filter(action => {
          return !options.exclude.includes(action);
        })
      }
      if (options.only) {
        actions = actions.filter(action => {
          return options.only.includes(action);
        })
      }
    }

    return actions.map(action => {
      return this.createPermission(feature, action);
    })
  }

  public async assignPermissionsToRoles(roleEntities: Array<Role>) {
    await this.createSuperPermission();
    await this.createPermissions();
    const racls = this._racls;
    await Promise.all(
      racls.map(async racl => {
        const roleEntity = roleEntities.find(item => item.name === racl.role);
        const permissionAllow = await Permission.find({
          where: {
            name: racl.permissions.length ? In(racl.permissions) : ""
          }
        })
        roleEntity.permissions = permissionAllow;
        return roleEntity.save();
      })
    );
  }
}
