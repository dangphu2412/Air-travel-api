import {Repository, EntityRepository} from "typeorm";
import {Payment} from "src/common/entity";

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {
}
