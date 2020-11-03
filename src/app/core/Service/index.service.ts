import {
  Injectable
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BaseService} from "src/app/base/base.service";
import {Lang} from "src/common/constants/lang";
import {Service, User} from "src/common/entity";
import {FindOneOptions, UpdateResult} from "typeorm";
import {DestinationService} from "../Destination/index.service";
import {ProviderService} from "../Provider/index.service";
import {ServiceCategoryService} from "../ServiceCategory/index.service";
import {UserService} from "../User/index.service";
import {ServiceRepository} from "./index.repository";

@Injectable()
export class ServiceService extends TypeOrmCrudService<Service> {
  constructor(
    @InjectRepository(Service)
    private repository: ServiceRepository,
    private baseService: BaseService,
    private providerService: ProviderService,
    private serviceCategoryService: ServiceCategoryService,
    private destinationService: DestinationService,
    private userService: UserService
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

    this.baseService.isNotAdminAndAuthorAndThrowErr(
      this.userService,
      currentUser, user
    );
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
    this.baseService.isNotAdminAndAuthor(
      this.userService,
      currentUser, user
    );
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
}
