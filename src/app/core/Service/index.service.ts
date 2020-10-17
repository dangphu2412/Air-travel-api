import {
  ConflictException,
  ForbiddenException,
  Injectable, NotFoundException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {ServiceError} from "src/common/constants";
import {Lang} from "src/common/constants/lang";
import {Service, User} from "src/common/entity";
import {FindOneOptions, Not} from "typeorm";
import {ServiceRepository} from "./index.repository";

@Injectable()
export class ServiceService extends TypeOrmCrudService<Service> {
  constructor(
    @InjectRepository(Service)
    private repository: ServiceRepository
  ) {
    super(repository);
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
}
