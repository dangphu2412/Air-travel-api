import {Repository, EntityRepository} from "typeorm";
import {Customer} from "src/common/entity";

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
}
