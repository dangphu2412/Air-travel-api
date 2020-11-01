import {Factory, Seeder} from "typeorm-seeding";
import {Connection} from "typeorm";
import {ERole} from "../../common/enums/racl.enum";
import {enumToArray} from "../../utils/array";
import * as Entity from "../../common/entity";
import {RaclHelper} from "./seed-helper/racl.helper";
import {UserHepler} from "./seed-helper/user.helper";
import {Role, User, Provider} from "../../common/entity";
import {ServiceCategoryHelper} from "./seed-helper/servicecategory.helper";
import {CsvHelper} from "../../utils/csv";
import {resolve} from "path";
import {CityAndDistrictHelper} from "./seed-helper/cityAndDistrict.helper";
import {DestinationHelper} from "./seed-helper/destination.heper";
import {ServiceHelper} from "./seed-helper/service.helper";

export default class Seeding implements Seeder {
  private serviceCategoryFilePath = resolve(__dirname, "data", "serviceCategory.csv");;

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
      const userRole: Role = roleEntities.find(role => role.name === ERole.INTERN);
      await this.randomUser(factory, userRole);
      const userCount: number = await userHelper.countUser();

      const serviceCategoryHelper = new ServiceCategoryHelper(
        new CsvHelper(this.serviceCategoryFilePath)
      );
      await serviceCategoryHelper.initServiceCategory();

      const cityAndDistrictHelper = new CityAndDistrictHelper();
      await cityAndDistrictHelper.initCitiesAndDistricts();

      const destinationHelper = new DestinationHelper();
      await destinationHelper.initDestination(userCount);

      const serviceHelper = new ServiceHelper();
      await serviceHelper.initService(userCount);

      await factory(Provider)({userCount}).createMany(20);
    } catch (error) {
      throw error;
    }
  }
}
