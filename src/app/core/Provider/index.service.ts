import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";

import {Provider} from "src/common/entity";
import {ProviderRepository} from "./index.repository";

@Injectable()
export class ProviderService extends TypeOrmCrudService<Provider> {
  constructor(
    @InjectRepository(Provider)
    private repository: ProviderRepository
  ) {
    super(repository);
  }

  public findByIds(ids: number[]) {
    return this.repository.findByIds(ids);
  }
}
