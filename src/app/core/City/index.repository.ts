import {Repository, EntityRepository} from "typeorm";
import {City} from "src/common/entity";

@EntityRepository(City)
export class CityRepository extends Repository<City> {
}
