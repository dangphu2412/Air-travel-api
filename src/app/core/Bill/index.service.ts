import {
  ForbiddenException,
  Injectable
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BaseService} from "src/app/base/base.service";
import {DEFAULT_ERROR} from "src/common/constants";
import {Bill, Role, User} from "src/common/entity";
import {ERole, ErrorCodeEnum} from "src/common/enums";
import {FindOneOptions, UpdateResult} from "typeorm";
import {BillRepository} from "./index.repository";

@Injectable()
export class BillService extends TypeOrmCrudService<Bill> {
  constructor(
    @InjectRepository(Bill)
    private repository: BillRepository,
    private baseService: BaseService,
  ) {
    super(repository);
  }

  public getRoleBill(): Promise<Role> {
    return Role.getRepository().findOne({
      where: {
        name: ERole.CUSTOMER
      }
    });
  }

  public validateAuthor(userIdFromParams: number, user: Bill) {
    if (userIdFromParams !== user.id) {
      throw new ForbiddenException(
        DEFAULT_ERROR.ConflictSelf,
        ErrorCodeEnum.NOT_CHANGE_ANOTHER_AUTHORS_ITEM
      )
    }
  }

  // Auto ref in authService
  public findByEmail(email: string, options?: FindOneOptions): Promise<Bill> {
    return this.repository.findOne({
      where: {
        email
      },
      relations: options?.relations || ["role", "role.permissions"],
      order: options?.order,
      withDeleted: options?.withDeleted
    })
  }

  getUserId(dto: Bill, user: User) {
    return this.baseService.fillUserIdToDto(dto, user);
  }

  public async restore(id: number, currentUser: User) {
    // const record = await this
    //   .baseService
    //   .findByIdSoftDeletedAndThrowErr(this.repository, id);
    // const {user} = record;

    // this.baseService.isNotAdminAndAuthorAndThrowErr(
    //   this.userService,
    //   currentUser, user
    // );
    // this.baseService.isNotSoftDeletedAndThrowErr(record);
    return this.repository.restore(id);
  }

  public getDeleted(req: CrudRequest) {
    return this.baseService.findManySoftDeleted<Bill>(
      this.repository,
      req
    );
  }

  public async softDelete(id: number, currentUser: User): Promise<UpdateResult> {
    // const record = await this
    //   .baseService
    //   .findWithRelationUserThrowErr(this.repository, id);
    // const {user} = record;
    // this.baseService.isNotAdminAndAuthor(
    //   this.userService,
    //   currentUser, user
    // );
    return this.repository.softDelete(id);
  }

  public async mapRelationKeysToEntities(dto: Bill): Promise<Bill> {

    return dto;
  }
}
