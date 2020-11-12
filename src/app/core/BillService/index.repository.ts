import {Repository, EntityRepository} from "typeorm";
import {BillService} from "src/common/entity";

@EntityRepository(BillService)
export class BillServiceRepository extends Repository<BillService> {
}
