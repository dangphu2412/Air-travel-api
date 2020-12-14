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
import {NotificationRepository} from "../Notification/index.repository";
import {CustomerRepository} from "./index.repository";

@Injectable()
export class CustomerService extends TypeOrmCrudService<Customer> {
  constructor(
    @InjectRepository(Customer)
    private repository: CustomerRepository,
    private baseService: BaseService,
    private notificationRepository: NotificationRepository
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
        role,
        phone: user.phone
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
    if (user.notifyTokens !== null && user.notifyTokens.length) {
      if (user.notifyTokens.includes(notifyToken)) {
        throw new ConflictException(
          CustomerError.ConflictNotifyToken,
          ErrorCodeEnum.CONFLICT
        );
      }
      user.notifyTokens.push(notifyToken);
    }

    if (user.notifyTokens === null) {
      user.notifyTokens = [];
    }
    return user.save();
  }

  public unsubcribeNotificationToken(notifyToken: string, user: Customer) {
    user.notifyTokens = user.notifyTokens.filter(token => {
      return token !== notifyToken;
    })
    return user.save();
  }

  public async addFavouriteServiceToCustomer(id: number, userId: number) {
    const customer: Customer = await this.findOne(userId);

    const {favouriteServiceIds} = customer;

    if (favouriteServiceIds === null || favouriteServiceIds.length === 0) {
      customer.favouriteServiceIds = [];
    }
    customer.favouriteServiceIds.push(id);
    return customer.save();
  }

  public isCustomer(user: User | Customer) {
    return user.role.name === ERole.CUSTOMER;
  }

  public getNotifications(req: CrudRequest, user: Customer) {
    return this.notificationRepository.find({
      skip: req.parsed.offset ?? req.options.query.maxLimit,
      take: req.parsed.limit ?? req.options.query.limit,
      where: {
        customerId: user.id
      }
    });
  }

  public getNotificationCount() {
    return this.notificationRepository.count();
  }
}
