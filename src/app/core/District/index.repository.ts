import {Repository, EntityRepository} from "typeorm";
import {District} from "src/common/entity";

@EntityRepository(District)
export class DistrictRepository extends Repository<District> {
}
