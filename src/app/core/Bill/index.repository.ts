import {Repository, EntityRepository} from "typeorm";
import {Bill} from "src/common/entity";

@EntityRepository(Bill)
export class BillRepository extends Repository<Bill> {
}
