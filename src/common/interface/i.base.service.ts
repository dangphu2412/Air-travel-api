import {EntityId} from "typeorm/repository/EntityId"
import {Repository, FindOneOptions} from "typeorm"
import {User} from "../entity"

export interface IBaseService {
  // Find methods
  findWithRelationUser<T>(repository: Repository<T>, id: number): Promise<T>;
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
