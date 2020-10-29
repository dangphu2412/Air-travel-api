import {EntityId} from "typeorm/repository/EntityId"
import {Repository, FindOneOptions, FindManyOptions} from "typeorm"
import {User} from "../entity"
import {CrudRequest} from "@nestjsx/crud"

export interface IBaseService {
  // Find methods
  findManySoftDeleted<T>(
    repository: Repository<T>, req: CrudRequest, options?: FindManyOptions
  ): Promise<T[]>;
  findWithRelationUser<T>(repository: Repository<T>, id: number): Promise<T>;
  findWithRelationUserThrowErr<T>(repository: Repository<T>, id: number): Promise<T>;
  findByIdSoftDeleted<T>(
    repository: Repository<T>,
    id: EntityId,
    options? :FindOneOptions
  ): Promise<T>;
  findByIdSoftDeletedAndThrowErr<T>(
    repository: Repository<T>,
    id: EntityId,
    options? :FindOneOptions
  ): Promise<T>;

  // Validate methods
  isNotSoftDeleted(record: any): boolean;
  isNotSoftDeletedAndThrowErr(record: any): void;
  isNotAdminAndAuthor(currentUser: User, userBeCompared: User): boolean;
  isNotAdminAndAuthorAndThrowErr(currentUser: User, userBeCompared: User): void;
  // Fill methods
  fillUserIdToDto(dto: any, user: User): void;

}
