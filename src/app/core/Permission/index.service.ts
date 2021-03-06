import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {Permission} from "src/common/entity";
import {Not} from "typeorm";
import {PermissionRepository} from "./index.repository";

@Injectable()
export class PermissionService extends TypeOrmCrudService<Permission>{
  constructor(
    @InjectRepository(Permission)
    private repository: PermissionRepository
  ) {
    super(repository);
  }

  getAll() {
    return this.repository.find({
      where: {
        name: Not("ALL")
      }
    });
  }

  findByIds(ids: number[]): Promise<Permission[]> {
    return this.repository.findByIds(ids);
  }
}
