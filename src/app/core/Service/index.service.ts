import {
  ForbiddenException,
  Injectable, NotFoundException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest, GetManyDefaultResponse} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BaseService} from "src/app/base/base.service";
import {CustomerError} from "src/common/constants";
import {Lang} from "src/common/constants/lang";
import {Customer, Service, User} from "src/common/entity";
import {ErrorCodeEnum} from "src/common/enums";
import {FindOneOptions, In, UpdateResult} from "typeorm";
import {CustomerService} from "../Customer/index.service";
import {DestinationService} from "../Destination/index.service";
import {ProviderService} from "../Provider/index.service";
import {ServiceCategoryService} from "../ServiceCategory/index.service";
import {UserService} from "../User/index.service";
import {ServiceRepository} from "./index.repository";
import {IBestSeller} from "./interface";

@Injectable()
export class ServiceService extends TypeOrmCrudService<Service> {
  constructor(
    @InjectRepository(Service)
    private repository: ServiceRepository,
    private baseService: BaseService,
    private providerService: ProviderService,
    private serviceCategoryService: ServiceCategoryService,
    private destinationService: DestinationService,
    private userService: UserService,
    private customerService: CustomerService
  ) {
    super(repository);
  }

  getUserId(dto: Service, user: User) {
    return this.baseService.fillUserIdToDto(dto, user);
  }

  public async restore(id: number, currentUser: User) {
    const record = await this
      .baseService
      .findByIdSoftDeletedAndThrowErr(this.repository, id);
    const {user} = record;

    if (this.userService.isNotAuthor(currentUser, user)) {
      throw new ForbiddenException(
        ErrorCodeEnum.NOT_CHANGE_ANOTHER_AUTHORS_ITEM,
        "You are not author"
      )
    }
    this.baseService.isNotSoftDeletedAndThrowErr(record);
    return this.repository.restore(record.id);
  }

  public getDeleted(req: CrudRequest) {
    return this.baseService.findManySoftDeleted<Service>(
      this.repository,
      req
    );
  }

  public async softDelete(id: number, currentUser: User): Promise<UpdateResult> {
    const record = await this
      .baseService
      .findWithRelationUserThrowErr(this.repository, id);
    const {user} = record;
    if (this.userService.isNotAuthor(currentUser, user)) {
      throw new ForbiddenException(
        ErrorCodeEnum.NOT_CHANGE_ANOTHER_AUTHORS_ITEM,
        "You are not author"
      )
    }
    return this.repository.softDelete(record.id);
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
      case Lang.EN:
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

  public async mapRelationKeysToEntities(dto: Service): Promise<Service> {
    const {destinationIds, serviceCategoryIds, providerIds} = dto;
    dto.destinations = await this.destinationService.findByIds(destinationIds);
    dto.providers = await this.providerService.findByIds(providerIds);
    dto.serviceCategories = await this.serviceCategoryService.findByIds(serviceCategoryIds);
    return dto;
  }

  public async findCustomerFavouriteServices(customerId: number): Promise<string[]> {
    const customer: Customer = await this.customerService.findOne(customerId);

    if (!customer) {
      throw new NotFoundException(
        ErrorCodeEnum.NOT_FOUND,
        CustomerError.NotFound
      )
    }

    return customer.favouriteServiceIds;
  }

  public getManyFilterFavourite(
    services: GetManyDefaultResponse<Service>,
    user: Customer | User
  ): any {
    if (user === null) {
      return services;
    }

    const isCustomer = this.customerService.isCustomer(user);

    if (isCustomer) {
      const data = this.filterFavourite(services.data, user as Customer);
      return {
        count: services.count,
        data,
        page: services.page,
        pageCount: services.pageCount,
        total: services.total
      }
    }
    return services;
  }

  public filterFavourite(services: Service[], user: Customer): any[] {
    const {favouriteServiceIds} = user;
    return services.map(service => {
      const response: any = {
        ...service,
        isFavourite: favouriteServiceIds.includes(service.id.toString())
      };
      return response;
    })
  }

  public findServicesByIds(
    req: CrudRequest = null, favouriteIds: string[]
  ): Promise<Service[]> | []{
    if (favouriteIds === null || !favouriteIds.length) {
      return [];
    }
    return this.repository.find({
      skip: req?.parsed?.offset ?? 0,
      take: req?.parsed?.limit ?? req?.options?.query?.limit ?? 10,
      relations: [
        "serviceCategories",
        "providers",
        "destinations",
        "destinations.city",
        "destinations.district",
        "user"
      ],
      where: {
        id: In(favouriteIds)
      }
    });
  }

  public async getBestSeller() {
    const ids = await this.getBestSellerIds();
    return this.findServicesByIds(null, ids);
  }

  public async getBestSellerIds() {
    const services: any[] = await this.repository
      .createQueryBuilder("service")
      .select(["service.id", "service.createdAt"])
      .leftJoinAndSelect("service.billServices", "billServices")
      .loadRelationCountAndMap("service.billServices", "service.billServices")
      .orderBy("service.createdAt", "DESC")
      .getMany();

    return services
      .sort((pre: IBestSeller, af: IBestSeller) => af.billServices - pre.billServices)
      .splice(0, 5).map(record => record.id);
  }

  public getCount() {
    return this.repository.count();
  }
}
