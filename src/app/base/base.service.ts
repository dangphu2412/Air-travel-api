import {DEFAULT_ERROR} from "src/common/constants";
import {
  ConflictException, ForbiddenException, Injectable,
  InternalServerErrorException, NotFoundException
} from "@nestjs/common";
import {IBaseService} from "src/common/interface/i.base.service";
import {IsNull, Not, Repository, FindOneOptions} from "typeorm";
import {EntityId} from "typeorm/repository/EntityId";
import {ErrorCodeEnum} from "src/common/enums";
import {UserService} from "../core/User/index.service";
import {User} from "src/common/entity";

@Injectable()
export class BaseService implements IBaseService {
  constructor(
    private userService: UserService
  ) {}

  findWithRelationUser<T>(repository: Repository<T>, id: number): Promise<T> {
    return repository.findOne(id, {
      relations: ["user"]
    });
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
      relations: options.relations ?? ["user"]
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
      relations: options.relations ?? ["user"]
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

  isNotAdminAndAuthor(currentUser: User, userBeCompared: User): boolean {
    return this.userService.isNotAdmin(currentUser)
    && this.userService.isNotAuthor(currentUser, userBeCompared)
  }

  isNotAdminAndAuthorAndThrowErr(currentUser: User, userBeCompared: User): void {
    if (this.userService.isNotAdmin(currentUser)
    && this.userService.isNotAuthor(currentUser, userBeCompared)
    ) {
      throw new ForbiddenException(
        DEFAULT_ERROR.ConflictSelf,
        ErrorCodeEnum.NOT_CHANGE_ANOTHER_AUTHORS_ITEM
      );
    }
  }

  fillUserIdToDto(dto: any, user: User): void {
    if (!user.id) {
      throw new InternalServerErrorException(
        DEFAULT_ERROR.InternalSignJwt,
        ErrorCodeEnum.INTERNAL_SERVER_ERROR
      )
    }
    dto.userId = user.id;
  }
}
