import {TreeRepository, EntityRepository} from "typeorm";
import {ServiceCategory} from "src/common/entity";

@EntityRepository(ServiceCategory)
export class ServiceCategoryRepository extends TreeRepository<ServiceCategory> {
}
