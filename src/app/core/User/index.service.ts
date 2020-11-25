import {
  ConflictException, ForbiddenException,
  Injectable, NotFoundException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {UserError} from "src/common/constants";
import {Role, User} from "src/common/entity";
import {ERole, ErrorCodeEnum} from "src/common/enums";
import {FindOneOptions, IsNull, Not, UpdateResult} from "typeorm";
import {UserRepository} from "./index.repository";

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    private repository: UserRepository
  ) {
    super(repository);
  }

  public async mapRelationKeysToEntities(dto: User): Promise<User> {
    dto.role = await Role.getRepository().findOne(dto.roleId);
    return dto;
  }

  public getCurrentUserFromEntities(users: User[], id: number): User {
    return users.find(user => user.id === id);
  }

  public isNotAdmin(user: User): boolean {
    return user.role.name !== ERole.ADMIN;
  }

  public isNotAuthor(currentUser: User, compareUser: User) {
    return currentUser.id !== compareUser.id
  }

  public findByEmail(email: string, options?: FindOneOptions): Promise<User> {
    return this.repository.findOne({
      where: {
        email
      },
      relations: options?.relations || ["role", "role.permissions"],
      order: options?.order,
      withDeleted: options?.withDeleted
    })
  }

  public async restore(id: number, currentUser: User): Promise<UpdateResult> {
    const record = await this.repository.findOne(id, {
      where: {
        deletedAt: Not(IsNull())
      },
      withDeleted: true
    });
    if (!record) {
      throw new NotFoundException(
        UserError.NotFound,
        ErrorCodeEnum.NOT_FOUND
      )
    }
    if (id === currentUser.id) {
      throw new ConflictException(
        UserError.ConflictRestore,
        ErrorCodeEnum.ALREADY_EXIST
      );
    }
    return this.repository.restore(record.id);
  }

  public getDeleted(req: CrudRequest) {
    return this.find({
      where: {
        deletedAt: Not(IsNull())
      },
      withDeleted: true,
      cache: req.options.query.cache,
      skip: req.parsed.offset,
      take: req.parsed.limit
    });
  }

  public async softDelete(id: number, currentUser: User): Promise<UpdateResult> {
    if (id === currentUser.id) {
      throw new ConflictException(
        UserError.ConflictSelf,
        ErrorCodeEnum.NOT_DELETE_YOURSELF
      );
    }
    const record = await this.repository.findOne(id, {
      relations: ["role"]
    });
    if (!record) {
      throw new NotFoundException(
        UserError.NotFound,
        ErrorCodeEnum.NOT_FOUND
      );
    }

    if (record.deletedAt !== null) {
      throw new ConflictException(
        UserError.ConflictSoftDeleted,
        ErrorCodeEnum.CONFLICT
      );
    }

    /**
     * Admin is allow to delete but can not delete admin
     */

    if (this.isNotAdmin(currentUser)
    || !this.isNotAdmin(record)) {
      throw new ForbiddenException(
        UserError.ForbiddenDelete,
        ErrorCodeEnum.NOT_DELETE_ADMIN_USER
      );
    }
    return this.repository.softDelete(record.id);
  }

  public getProfile(user: User): Promise<User> {
    const {id} = user;
    return this.repository.findOne(id, {
      relations: ["role", "role.permissions"],
      select: [
        "id", "fullName", "email", "avatar", "bio",
        "birthday", "gender", "note", "status", "phone",
        "role"
      ]
    })
  }
}
