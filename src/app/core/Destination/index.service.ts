import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable, InternalServerErrorException, NotFoundException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {CityError, DEFAULT_ERROR, DestinationError} from "src/common/constants";
import {Lang} from "src/common/constants/lang";
import {City, Destination, District, User} from "src/common/entity";
import {ErrorCodeEnum} from "src/common/enums";
import {SlugHelper} from "src/global/slugify";
import {FindOneOptions, IsNull, Not} from "typeorm";
import {CityService} from "../City/index.service";
import {DistrictService} from "../District/index.service";
import {UserService} from "../User/index.service";
import {DestinationRepository} from "./index.repository";

@Injectable()
export class DestinationService extends TypeOrmCrudService<Destination> {
  constructor(
    @InjectRepository(Destination)
    private repository: DestinationRepository,
    private readonly cityService: CityService,
    private readonly districtService: DistrictService,
    private readonly userService: UserService
  ) {
    super(repository);
  }

  getUserId(dto: Destination, user: User) {
    if (!user.id) {
      throw new InternalServerErrorException(
        DEFAULT_ERROR.InternalSignJwt,
        ErrorCodeEnum.INTERNAL_SERVER_ERROR
      )
    }
    dto.userId = user.id;
  }

  public findByIds(ids: number[]) {
    return this.repository.findByIds(ids);
  }

  public async mapRelationKeysToEntities(dto: Destination): Promise<Destination> {
    const citySlug = SlugHelper.slugifyUpperCaseAndRemoveDash(dto.cityName);
    const districtSlug = SlugHelper.slugifyUpperCaseAndRemoveDash(dto.districtName);
    const diffCitySlug = `${citySlug}KHAC`;
    const city: City = await this.cityService.findOne({
      where: {
        slug: citySlug
      }
    });

    if (!city) throw new BadRequestException(
      CityError.NotFound,
      ErrorCodeEnum.NOT_FOUND
    );
    const district: District = await this.districtService.findOne({
      where: {
        slug: districtSlug
      }
    }) || await this.districtService.findOne({
      where: {
        slug: diffCitySlug
      }
    });
    dto.city = city;
    dto.district = district;
    return dto;
  }

  public async restore(id: number, currentUser: User) {
    const record = await this.repository.findOne(id, {
      where: {
        deletedAt: Not(IsNull())
      },
      relations: ["user", "user.role"]
    });
    const {user} = record;
    if (!record) throw new NotFoundException(
      DestinationError.NotFound,
      ErrorCodeEnum.NOT_FOUND
    )
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
        DestinationError.ConflictRestore,
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
      relations: ["user", "user.role"]
    });
    const {user} = record;
    if (this.userService.isNotAdmin(user)
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
}
