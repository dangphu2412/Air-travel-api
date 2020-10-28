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
import {TJwtPayload} from "src/common/type";
import {FindOneOptions, Not} from "typeorm";
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

  getUserId(dto: Service, user: TJwtPayload) {
    if (!user.userId) {
      throw new InternalServerErrorException(
        DEFAULT_ERROR.InternalSignJwt,
        ErrorCodeEnum.INTERNAL_SERVER_ERROR
      )
    }
    dto.userId = user.userId;
  }

  async authAdmin(dto: Service, user: TJwtPayload) {
    const currentUser = await this.userService.findByIdAndOnlyGetRole(user.userId);
    if (this.userService.isNotAdmin(currentUser)) {
      throw new ForbiddenException(
        DEFAULT_ERROR.Forbidden,
        ErrorCodeEnum.NOT_CREATE_ADMIN_USER
      );
    }
  }

  public async restore(id: number, currentUser: User) {
    const record = await this.repository.findOne(id, {
      where: {
        deletedAt: Not(null)
      },
      relations: ["user"]
    });
    if (!record) throw new NotFoundException(ServiceError.NotFound)
    if (record.user.id === currentUser.id) {
      throw new ConflictException(ServiceError.ConflictRestore);
    }
    if (record.deletedAt === null) throw new ConflictException(ServiceError.ConflictRestore);
    await this.repository.restore(record);
  }

  public getDeleted(req: CrudRequest) {
    return this.find({
      where: {
        deletedAt: Not(null)
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
    if (record.user.id !== currentUser.id) throw new ForbiddenException();
    await this.repository.softDelete(record);
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
