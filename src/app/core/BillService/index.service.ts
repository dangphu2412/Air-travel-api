import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BillService} from "src/common/entity";
import {BillServiceRepository} from "./index.repository";

@Injectable()
export class BillServiceService extends TypeOrmCrudService<BillService> {
  constructor(
    @InjectRepository(BillService)
    private repository: BillServiceRepository
  ) {
    super(repository);
  }
}
