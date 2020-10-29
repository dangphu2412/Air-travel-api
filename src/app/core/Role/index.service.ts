import {ConflictException, ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {DEFAULT_ERROR, RoleError} from "src/common/constants";
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
    private userService: UserService
  ) {
    super(repository);
  }

  async authAdmin(user: User) {
    const currentUser = await this.userService.findByIdAndOnlyGetRole(user.id);
    if (this.userService.isNotAdmin(currentUser)) {
      throw new ForbiddenException(
        RoleError.Forbidden,
        ErrorCodeEnum.NOT_CREATE_ADMIN_USER
      );
    }
    return currentUser;
  }

  async mapRelationKeysToEntities(dto: Role): Promise<Role> {
    const {permissionIds} = dto;
    const permissions: Permission[] = await this.permissionService.findByIds(permissionIds);
    dto.permissions = permissions;
    return dto;
  }

  public async restore(id: number) {
    const record = await this.repository.findOne(id, {
      where: {
        deletedAt: Not(IsNull())
      },
      withDeleted: true,
      relations: ["users"]
    });
    if (!record) throw new NotFoundException(
      DEFAULT_ERROR.NotFound,
      ErrorCodeEnum.NOT_FOUND
    )
    if (record.deletedAt === null) {
      throw new ConflictException(
        DEFAULT_ERROR.ConflictRestore,
        ErrorCodeEnum.CONFLICT
      );
    }
    if (record.users) {
      await this.syncUserToUpdatePermission(record.users);
    }
    await this.repository.restore(record.id);
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

  public async softDelete(id: number): Promise<void> {
    const record = await this.repository.findOne(id, {
      relations: ["users"]
    });
    if (!record) {
      throw new NotFoundException(
        DEFAULT_ERROR.NotFound,
        ErrorCodeEnum.NOT_FOUND
      )
    }
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
