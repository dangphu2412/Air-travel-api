import {ForbiddenException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {RoleError} from "src/common/constants";
import {CreateRoleDto} from "src/common/dto/Role";
import {Permission, Role} from "src/common/entity";
import {ErrorCodeEnum} from "src/common/enums";
import {TJwtPayload} from "src/common/type";
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

  async createRole(dto: CreateRoleDto, user: TJwtPayload): Promise<Role> {
    const currentUser = await this.userService.findByIdAndOnlyGetRole(user.userId);
    if (this.userService.isNotAdmin(currentUser)) {
      throw new ForbiddenException(
        RoleError.Forbidden,
        ErrorCodeEnum.NOT_CREATE_ADMIN_USER
      );
    }
    const {permissionIds} = dto;
    const permissions: Permission[] = await this.permissionService.findByIds(permissionIds);
    const entity = Role.create();
    entity.name = dto.name;
    entity.permissions = permissions;
    await entity.save();
    return entity;
  }

  async updateRole(dto: CreateRoleDto, user: TJwtPayload, id: number): Promise<Role> {
    const currentUser = await this.userService.findByIdAndOnlyGetRole(user.userId);
    if (this.userService.isNotAdmin(currentUser)) {
      throw new ForbiddenException(
        RoleError.Forbidden,
        ErrorCodeEnum.NOT_CREATE_ADMIN_USER
      );
    }
    const {permissionIds} = dto;
    const permissions: Permission[] = await this.permissionService.findByIds(permissionIds);
    const entity = await this.repository.findOne(id);
    entity.permissions = permissions;
    await entity.save();
    return entity;
  }
}
