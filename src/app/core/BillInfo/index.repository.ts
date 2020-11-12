import {Repository, EntityRepository} from "typeorm";
import {BillInfo} from "src/common/entity";

@EntityRepository(BillInfo)
export class BillInfoRepository extends Repository<BillInfo> {
}
