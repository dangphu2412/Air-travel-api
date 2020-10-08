import { Repository, EntityRepository } from "typeorm";
import { User } from "src/common/entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
}