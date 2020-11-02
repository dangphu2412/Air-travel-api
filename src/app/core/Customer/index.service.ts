import {
  Injectable
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BaseService} from "src/app/base/base.service";
import {Lang} from "src/common/constants/lang";
import {RegisterDto} from "src/common/dto/User";
import {Customer, Role, User} from "src/common/entity";
import {ERole} from "src/common/enums";
import {FindOneOptions} from "typeorm";
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
    const role = await Role.getRepository().findOne({
      where: {
        name: ERole.CUSTOMER
      }
    });
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

  public async restore(id: number, currentUser: User) {
    // const record = await this
    //   .baseService
    //   .findByIdSoftDeletedAndThrowErr(this.repository, id);
    // const {user} = record;

    // this.baseService.isNotAdminAndAuthorAndThrowErr(currentUser, user);
    // this.baseService.isNotSoftDeletedAndThrowErr(record);
    // await this.repository.restore(record.id);
  }

  public getDeleted(req: CrudRequest) {
    return this.baseService.findManySoftDeleted<Customer>(
      this.repository,
      req
    );
  }

  public async softDelete(id: number, currentUser: User): Promise<void> {
    // const record = await this
    //   .baseService
    //   .findWithRelationUserThrowErr(this.repository, id);
    // const {user} = record;
    // this.baseService.isNotAdminAndAuthor(currentUser, user);
    // await this.repository.softDelete(record.id);
    // return;
  }

  public getBySlugWithMutilpleLanguagues(value: string, lang: string) {
    let conditions: FindOneOptions = {};
    switch (lang) {
      case Lang.VN:
        conditions = {
          where: {
            viSlug: value
          }
        }
        break;
      default:
        // Default EnSlug
        conditions = {
          where: {
            enSlug: value
          }
        }
        break;
    }
    return this.repository.findOne(conditions);
  }

  public async mapRelationKeysToEntities(dto: Customer): Promise<Customer> {
    // const {destinationIds, serviceCategoryIds, providerIds} = dto;
    // dto.destinations = await this.destinationCustomer.findByIds(destinationIds);
    // dto.providers = await this.providerCustomer.findByIds(providerIds);
    // dto.serviceCategories = await this.serviceCategoryCustomer.findByIds(serviceCategoryIds);
    return dto;
  }
}
