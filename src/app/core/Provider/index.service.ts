import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BaseService} from "src/app/base/base.service";

import {Provider, User} from "src/common/entity";
import {UserService} from "../User/index.service";
import {ProviderRepository} from "./index.repository";

@Injectable()
export class ProviderService extends TypeOrmCrudService<Provider> {
  constructor(
    @InjectRepository(Provider)
    private repository: ProviderRepository,
    private baseService: BaseService,
    private userService: UserService
  ) {
    super(repository);
  }

  public findByIds(ids: number[]) {
    return this.repository.findByIds(ids);
  }

  public async restore(id: number, currentUser: User) {
    const record = await this
      .baseService
      .findByIdSoftDeletedAndThrowErr<Provider>(
        this.repository,
        id
      );
    const {user} = record;
    this.baseService.isNotAdminAndAuthorAndThrowErr(
      this.userService,
      user, currentUser
    );
    this.baseService.isNotSoftDeletedAndThrowErr(record);
    return this.repository.restore(record.id);
  }

  public getDeleted(req: CrudRequest) {
    return this.baseService
      .findManySoftDeleted<Provider>(
        this.repository,
        req
      )
  }


  public async softDelete(id: number, currentUser: User) {
    const record = await this
      .baseService
      .findWithRelationUser(this.repository, id);
    const {user} = record;
    this.baseService.isNotAdminAndAuthorAndThrowErr(
      this.userService,
      user, currentUser
    );
    return this.repository.softDelete(record.id);
  }
}
