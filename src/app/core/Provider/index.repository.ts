import {Repository, EntityRepository} from "typeorm";
import {Provider} from "src/common/entity";

@EntityRepository(Provider)
export class ProviderRepository extends Repository<Provider> {
}
