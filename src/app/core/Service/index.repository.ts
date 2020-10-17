import {Repository, EntityRepository} from "typeorm";
import {Service} from "src/common/entity";

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
}
