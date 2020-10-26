import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {District} from "src/common/entity";
import {DistrictRepository} from "./index.repository";

@Injectable()
export class DistrictService extends TypeOrmCrudService<District> {
  constructor(
    @InjectRepository(District)
    private repository: DistrictRepository
  ) {
    super(repository);
  }
}
