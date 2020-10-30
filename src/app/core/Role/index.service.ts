import {ForbiddenException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {BaseService} from "src/app/base/base.service";
import {DEFAULT_ERROR} from "src/common/constants";
import {Permission, Role, User} from "src/common/entity";
import {ErrorCodeEnum} from "src/common/enums";
import {Not, IsNull} from "typeorm";
import {PermissionService} from "../Permission/index.service";
import {UserService} from "../User/index.service";
import {RoleRepository} from "./index.repository";

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  constructor(
    @InjectRepository(Role)
    private repository: RoleRepository,
    private permissionService: PermissionService,
    private userService: UserService,
    private baseService: BaseService
  ) {
    super(repository);
  }

  async mapRelationKeysToEntities(dto: Role, user: User): Promise<Role> {
    if (this.userService.isNotAdmin(user)) {
      throw new ForbiddenException(
        DEFAULT_ERROR.Forbidden,
        ErrorCodeEnum.FORBIDDEN
      )
    }
    const {permissionIds} = dto;
    const permissions: Permission[] = await this.permissionService.findByIds(permissionIds);
    dto.permissions = permissions;
    return dto;
  }

  public async restore(id: number, user: User) {
    if (this.userService.isNotAdmin(user)) {
      throw new ForbiddenException(
        DEFAULT_ERROR.Forbidden,
        ErrorCodeEnum.FORBIDDEN
      )
    }
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
    if (this.userService.isNotAdmin(user)) {
      throw new ForbiddenException(
        DEFAULT_ERROR.Forbidden,
        ErrorCodeEnum.FORBIDDEN
      )
    }
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
