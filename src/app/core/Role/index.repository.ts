import { Repository, EntityRepository } from "typeorm";
import { Role } from "src/common/entity";

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
}