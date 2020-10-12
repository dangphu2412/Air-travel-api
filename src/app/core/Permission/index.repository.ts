import {Repository, EntityRepository} from "typeorm";
import {Permission} from "src/common/entity";

@EntityRepository(Permission)
export class PermissionRepository extends Repository<Permission> {
}
