import {Factory, Seeder} from "typeorm-seeding";
import {Connection} from "typeorm";
import {ERole} from "../../common/enums/racl.enum";
import {enumToArray} from "../../utils/array";
import * as Entity from "../../common/entity";
import {RaclHelper} from "./seed-helper/racl.helper";
import {UserHepler} from "./seed-helper/user.helper";
import {Role, User} from "../../common/entity";

export default class Seeding implements Seeder {

  private randomUser(factory: Factory, role: Role) {
    return factory(User)({role, password: "123123"}).createMany(10)
  }

  private initRoles(roles: ERole[]) {
    return Promise.all(roles.map(role => {
      const dto = Entity.Role.create();
      dto.name = role;
      return dto.save();
    }))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async run(factory: Factory, connection: Connection): Promise<any> {
    try {
      await this.initRoles(enumToArray(ERole));

      const roleEntities = await Entity.Role.find();

      const permissionHelper = new RaclHelper();
      await permissionHelper.assignPermissionsToRoles(roleEntities);

      const userHelper = new UserHepler(roleEntities);
      await userHelper.initUser();
      const userRole: Role = roleEntities.find(role => role.name === ERole.USER);
      await this.randomUser(factory, userRole);
    } catch (error) {
      throw error;
    }
  }
}
