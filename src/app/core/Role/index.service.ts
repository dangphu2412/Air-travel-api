import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {BaseService} from "src/app/base/base.service";
import {Permission, Role, User} from "src/common/entity";
import {Not, IsNull} from "typeorm";
import {PermissionService} from "../Permission/index.service";
import {RoleRepository} from "./index.repository";

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  constructor(
    @InjectRepository(Role)
    private repository: RoleRepository,
    private permissionService: PermissionService,
    private baseService: BaseService
  ) {
    super(repository);
  }

  async mapRelationKeysToEntities(dto: Role, user: User): Promise<Role> {
    this.baseService.isNotAdminAndThrowErr(user);
    const {permissionIds} = dto;
    const permissions: Permission[] = await this.permissionService.findByIds(permissionIds);
    dto.permissions = permissions;
    return dto;
  }

  public async restore(id: number, user: User) {
    this.baseService.isNotAdminAndThrowErr(user);
    const record = await this
      .baseService
      .findByIdSoftDeletedAndThrowErr(
        this.repository,
        id
      );
    this.baseService.isNotSoftDeletedAndThrowErr(record);
    if (record.users) {
      await this.syncUserToUpdatePermission(record.users);
    }
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

  public async softDelete(id: number, user: User): Promise<void> {
    this.baseService.isNotAdminAndThrowErr(user);
    const record = await this
      .baseService
      .findWithRelationUserThrowErr(
        this.repository,
        id
      );
    if (record.users) {
      await this.syncUserToUpdatePermission(record.users);
    }
    await this.repository.softDelete(record.id);
  }

  public syncUserToUpdatePermission(users: User[]): Promise<User[]> {
    return Promise.all(users.map(user => {
      user.hasExpiredToken = true;
      return user.save();
    }))
  }
}
