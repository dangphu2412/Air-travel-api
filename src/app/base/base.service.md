<code>
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import { CrudRequest } from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BaseService} from "src/app/base/base.service";

import {Provider,User} from "src/common/entity";
import { Not, IsNull } from "typeorm";
import {UserService} from "../User/index.service";
import {ProviderRepository} from "./index.repository";

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
    return this.find({
      where: {
        deletedAt: Not(IsNull())
      },
      withDeleted: true,
      skip: req.parsed.offset,
      take: req.parsed.limit
    });
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
</code>