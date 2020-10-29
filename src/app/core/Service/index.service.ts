import {
  ConflictException,
  ForbiddenException,
  Injectable, InternalServerErrorException, NotFoundException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {DEFAULT_ERROR, ServiceError} from "src/common/constants";
import {Lang} from "src/common/constants/lang";
import {Service, User} from "src/common/entity";
import {ErrorCodeEnum} from "src/common/enums";
import {FindOneOptions, IsNull, Not} from "typeorm";
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
    private userService: UserService,
    private providerService: ProviderService,
    private serviceCategoryService: ServiceCategoryService,
    private destinationService: DestinationService
  ) {
    super(repository);
  }

  getUserId(dto: Service, user: User) {
    if (!user.id) {
      throw new InternalServerErrorException(
        DEFAULT_ERROR.InternalSignJwt,
        ErrorCodeEnum.INTERNAL_SERVER_ERROR
      )
    }
    dto.userId = user.id;
  }

  public async restore(id: number, currentUser: User) {
    const record = await this.repository.findOne(id, {
      where: {
        deletedAt: Not(IsNull())
      },
      withDeleted: true,
      relations: ["user", "user.role"]
    });
    const {user} = record;
    if (!record) throw new NotFoundException(ServiceError.NotFound)
    if (this.userService.isNotAdmin(user)
    && this.userService.isNotAuthor(user, currentUser)
    ) {
      throw new ForbiddenException(
        DEFAULT_ERROR.ConflictSelf,
        ErrorCodeEnum.NOT_CHANGE_ANOTHER_AUTHORS_ITEM
      );
    }
    if (record.deletedAt === null) {
      throw new ConflictException(
        ServiceError.ConflictRestore,
        ErrorCodeEnum.CONFLICT
      );
    }
    await this.repository.restore(record.id);
  }

  public getDeleted(req: CrudRequest) {
    return this.find({
      where: {
        deletedAt: Not(IsNull())
      },
      withDeleted: true,
      skip: req.parsed.offset,
      take: req.parsed.limit
    });
  }

  public async softDelete(id: number, currentUser: User): Promise<void> {
    const record = await this.repository.findOne(id, {
      relations: ["user"]
    });
    const {user} = record;
    if (!record) {
      throw new NotFoundException(
        ServiceError.NotFound,
        ErrorCodeEnum.NOT_FOUND
      )
    }
    if (this.userService.isNotAdmin(currentUser)
    && this.userService.isNotAuthor(user, currentUser)
    ) {
      throw new ForbiddenException(
        DEFAULT_ERROR.ConflictSelf,
        ErrorCodeEnum.NOT_CHANGE_ANOTHER_AUTHORS_ITEM
      );
    }
    await this.repository.softDelete(record.id);
    return;
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
