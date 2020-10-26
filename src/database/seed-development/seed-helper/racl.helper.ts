import {ECrudAction, ECrudFeature, ERole} from "../../../common/enums";
import {Permission, Role} from "../../../common/entity";
import {TRacl} from "../../../common/type/t.Racl";
import {enumToArray} from "../../../utils/array";
import {flatMap, remove} from "lodash";
import {TCrudAction} from "../../../common/type/t.CrudAction";
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
          ...this.createManyPermissionFromFeature(ECrudFeature.USER, ["DELETE", "REPLACE"]),
          ...this.createManyPermissionFromFeature(ECrudFeature.ROLE)
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
          ...this.createManyPermissionFromFeature(ECrudFeature.DESTINATION)
        ])
      },
      {
        role: ERole.INTERN,
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
    return `${feature}${action}`;
  }

  public createManyPermissionFromFeature(feature: string, exclude?: TCrudAction[]): string[] {
    let action = enumToArray(ECrudAction);
    if (exclude) {
      action = remove(action, exclude);
    }
    return action.map(action => {
      return `${feature}${action}`;
    })
  }

  public async assignPermissionsToRoles(roleEntities: Array<Role>) {
    await this.createPermissions();
    await this.createSuperPermission();
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
