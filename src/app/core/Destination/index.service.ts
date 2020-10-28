import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable, NotFoundException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {DestinationError} from "src/common/constants";
import {Lang} from "src/common/constants/lang";
import {City, Destination, District} from "src/common/entity";
import {TJwtPayload} from "src/common/type";
import {SlugHelper} from "src/global/slugify";
import {FindOneOptions, Not} from "typeorm";
import {CityService} from "../City/index.service";
import {DistrictService} from "../District/index.service";
import {DestinationRepository} from "./index.repository";

@Injectable()
export class DestinationService extends TypeOrmCrudService<Destination> {
  constructor(
    @InjectRepository(Destination)
    private repository: DestinationRepository,
    private readonly cityService: CityService,
    private readonly districtService: DistrictService
  ) {
    super(repository);
  }

  public findByIds(ids: number[]) {
    return this.repository.findByIds(ids);
  }

  public async createOneBase(
    req: CrudRequest,
    dto: Destination
  ): Promise<Destination> {
    const citySlug = SlugHelper.slugifyUpperCaseAndRemoveDash(dto.cityName);
    const districtSlug = SlugHelper.slugifyUpperCaseAndRemoveDash(dto.districtName);

    const city: City = await this.cityService.findOne({
      where: {
        slug: citySlug
      }
    });

    if (!city) throw new BadRequestException("Not supported this city");
    const district: District = await this.districtService.findOne({
      where: {
        slug: districtSlug
      }
    }) || await this.districtService.findOne({
      where: {
        slug: `${citySlug}KHAC`
      }
    });
    dto.city = city;
    dto.district = district;
    return dto.save();
  }

  public async restore(id: number, currentUser: TJwtPayload) {
    const record = await this.repository.findOne(id, {
      where: {
        deletedAt: Not(null)
      },
      relations: ["user"]
    });
    if (!record) throw new NotFoundException(DestinationError.NotFound)
    if (record.user.id === currentUser.userId) {
      throw new ConflictException(DestinationError.ConflictRestore);
    }
    if (record.deletedAt === null) throw new ConflictException(DestinationError.ConflictRestore);
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

  public async softDelete(id: number, currentUser: TJwtPayload): Promise<void> {
    const record = await this.repository.findOne(id, {
      relations: ["user"]
    });
    if (record.user.id !== currentUser.userId) throw new ForbiddenException();
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
}
