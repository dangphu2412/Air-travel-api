import {
  ConflictException,
  ForbiddenException,
  Injectable
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BaseService} from "src/app/base/base.service";
import {CustomerError, DEFAULT_ERROR} from "src/common/constants";
import {RegisterDto} from "src/common/dto/User";
import {Customer, Role, User} from "src/common/entity";
import {ERole, ErrorCodeEnum} from "src/common/enums";
import {FindOneOptions, UpdateResult} from "typeorm";
import {CustomerRepository} from "./index.repository";

@Injectable()
export class CustomerService extends TypeOrmCrudService<Customer> {
  constructor(
    @InjectRepository(Customer)
    private repository: CustomerRepository,
    private baseService: BaseService,
  ) {
    super(repository);
  }

  public getRoleCustomer(): Promise<Role> {
    return Role.getRepository().findOne({
      where: {
        name: ERole.CUSTOMER
      }
    });
  }

  public assignRoleToDto(dto: Customer, role: Role) {
    dto.role = role;
  }

  public validateAuthor(userIdFromParams: number, user: Customer) {
    if (userIdFromParams !== user.id) {
      throw new ForbiddenException(
        DEFAULT_ERROR.ConflictSelf,
        ErrorCodeEnum.NOT_CHANGE_ANOTHER_AUTHORS_ITEM
      )
    }
  }

  // Auto ref in authService
  public findByEmail(email: string, options?: FindOneOptions): Promise<Customer> {
    return this.repository.findOne({
      where: {
        email
      },
      relations: options?.relations || ["role", "role.permissions"],
      order: options?.order,
      withDeleted: options?.withDeleted
    })
  }

  // Auto ref in authService
  public async createOneBase(user: RegisterDto): Promise<Customer> {
    const role = await this.getRoleCustomer();
    return this.repository.create(
      {
        email: user.email,
        password: user.password,
        fullName: user.fullName,
        role
      }
    ).save();
  }

  getUserId(dto: Customer, user: User) {
    return this.baseService.fillUserIdToDto(dto, user);
  }

  public async restore(id: number): Promise<UpdateResult> {
    const record = await this
      .baseService
      .findByIdSoftDeletedAndThrowErr(this.repository, id);

    this.baseService.isNotSoftDeletedAndThrowErr(record);
    return this.repository.restore(record.id);
  }

  public getDeleted(req: CrudRequest) {
    return this.baseService.findManySoftDeleted<Customer>(
      this.repository,
      req
    );
  }

  public async softDelete(id: number): Promise<UpdateResult> {
    const record = await this
      .baseService
      .findWithRelationUserThrowErr(this.repository, id);
    return this.repository.softDelete(record.id);
  }

  public updateNotificationToken(notifyToken: string, user: Customer) {
    if (user.notifyToken === notifyToken) {
      throw new ConflictException(
        CustomerError.ConflictNotifyToken,
        ErrorCodeEnum.CONFLICT
      );
    }
    user.notifyToken = notifyToken;
    return user.save();
  }
}
