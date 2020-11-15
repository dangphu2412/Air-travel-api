import {DEFAULT_ERROR} from "src/common/constants";
import {
  ConflictException, ForbiddenException, Injectable,
  InternalServerErrorException, NotFoundException
} from "@nestjs/common";
import {IBaseService} from "src/common/interface/i.base.service";
import {IsNull, Not, Repository, FindOneOptions, FindManyOptions} from "typeorm";
import {EntityId} from "typeorm/repository/EntityId";
import {ERole, ErrorCodeEnum} from "src/common/enums";
import {Customer, User} from "src/common/entity";
import {CrudRequest} from "@nestjsx/crud";
import {UserService} from "../core/User/index.service";

@Injectable()
export class BaseService implements IBaseService {
  findManySoftDeleted<T>(
    repository: Repository<T>,
    req: CrudRequest,
    options?: FindManyOptions): Promise<T[]> {
    return repository.find({
      where: options?.where ?? {
        deletedAt: Not(IsNull())
      },
      withDeleted: true,
      skip: req.parsed.offset,
      take: req.parsed.limit
    });
  }

  findWithRelationUser<T>(repository: Repository<T>, id: number): Promise<T> {
    return repository.findOne(id, {
      relations: ["user", "user.role"]
    });
  }

  async findWithRelationUserThrowErr<T>(repository: Repository<T>, id: number): Promise<T> {
    const record = await repository.findOne(id, {
      relations: ["user", "user.role"]
    });
    if (!record) {
      throw new NotFoundException(
        DEFAULT_ERROR.NotFound,
        ErrorCodeEnum.NOT_FOUND
      )
    }
    return record;
  }

  async findChildsThrowErr<T>(repository: Repository<T>, id: number, options: FindManyOptions) {
    const relations: string[] = ["children", ...options.relations];
    const record = await repository.findOne(id, {
      relations
    });
    if (!record) {
      throw new NotFoundException(
        DEFAULT_ERROR.NotFound,
        ErrorCodeEnum.NOT_FOUND
      )
    }
    return record;
  }

  findByIdSoftDeleted<T>(
    repository: Repository<T>,
    id: EntityId,
    options? :FindOneOptions
  ): Promise<T> {
    return repository.findOne(id, {
      where: {
        deletedAt: Not(IsNull())
      },
      withDeleted: true,
      relations: options?.relations ?? ["user", "user.role"]
    });
  }

  async findByIdSoftDeletedAndThrowErr<T>(
    repository: Repository<T>,
    id: EntityId,
    options? :FindOneOptions
  ): Promise<T> {
    const record = await repository.findOne(id, {
      where: {
        deletedAt: Not(IsNull())
      },
      withDeleted: true,
      relations: options?.relations ?? ["user", "user.role"]
    });

    if (!record) {
      throw new NotFoundException(
        DEFAULT_ERROR.NotFound,
        ErrorCodeEnum.NOT_FOUND
      )
    }
    return record;
  }

  isNotSoftDeleted(record: any): boolean {
    return record.deletedAt === null;
  }

  isNotSoftDeletedAndThrowErr(record: any): void {
    if (record.deletedAt === null) {
      throw new ConflictException(
        DEFAULT_ERROR.ConflictSoftDeleted,
        ErrorCodeEnum.CONFLICT
      );
    }
  }


  isNotAdminAndAuthor(
    service: UserService,
    currentUser: User,
    userBeCompared: User
  ): boolean {
    return service.isNotAdmin(currentUser)
    && service.isNotAuthor(currentUser, userBeCompared)
  }

  /**
   *
   * @param service Must be userservice
   * @param currentUser user get from token
   * @param userBeCompared user get from record
   */
  isNotAdminAndAuthorAndThrowErr(
    service: UserService,
    currentUser: User,
    userBeCompared: User
  ): void {
    if (service.isNotAdmin(currentUser)
    && service.isNotAuthor(currentUser, userBeCompared)
    ) {
      throw new ForbiddenException(
        DEFAULT_ERROR.ConflictSelf,
        ErrorCodeEnum.NOT_CHANGE_ANOTHER_AUTHORS_ITEM
      );
    }
  }

  isNotAdminAndThrowErr(user: User): void {
    const {role} = user;
    if (role.name === ERole.ADMIN) {
      throw new ForbiddenException(
        DEFAULT_ERROR.Forbidden,
        ErrorCodeEnum.FORBIDDEN
      )
    }
  }

  fillUserIdToDto(dto: any, user: User | Customer): void {
    if (!user.id) {
      throw new InternalServerErrorException(
        DEFAULT_ERROR.InternalSignJwt,
        ErrorCodeEnum.INTERNAL_SERVER_ERROR
      )
    }
    dto.userId = user.id;
  }
}
