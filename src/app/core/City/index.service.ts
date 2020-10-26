import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {City} from "src/common/entity";
import {CityRepository} from "./index.repository";

@Injectable()
export class CityService extends TypeOrmCrudService<City> {
  constructor(
    @InjectRepository(City)
    private repository: CityRepository
  ) {
    super(repository);
  }
}
