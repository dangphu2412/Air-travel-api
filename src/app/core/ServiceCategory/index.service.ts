import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {ServiceCategory, User} from "src/common/entity";
import {ServiceCategoryRepository} from "./index.repository";
import {FindOneOptions, IsNull, Not} from "typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {Lang} from "src/common/constants/lang";
import {UserService} from "../User/index.service";
import {BaseService} from "src/app/base/base.service";

@Injectable()
export class ServiceCategoryService extends TypeOrmCrudService<ServiceCategory> {
  constructor(
    @InjectRepository(ServiceCategory)
    private repository: ServiceCategoryRepository,
    private userService: UserService,
    private baseService: BaseService
  ) {
    super(repository);
  }

  public findByIds(ids: number[]) {
    return this.repository.findByIds(ids);
  }

  public async restore(id: number, currentUser: User) {
    const record = await this
      .baseService
      .findByIdSoftDeletedAndThrowErr<ServiceCategory>(
        this.repository,
        id
      );
    const {user} = record;
    this.baseService.isNotAdminAndAuthorAndThrowErr(user, currentUser);
    this.baseService.isNotSoftDeletedAndThrowErr(record);
    return this.repository.restore(record.id);
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
    const record = await this
      .baseService
      .findWithRelationUserThrowErr(
        this.repository,
        id
      );
    const {user} = record;
    this.baseService.isNotAdminAndAuthor(user, currentUser);
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

  public getRoots() {
    return this.repository.findRoots();
  }

  public async getChildrens(id: number): Promise<ServiceCategory> {
    const parent = await this.repository.findOne(id);
    return this.repository.findDescendantsTree(parent);
  }

  public async getParent(id: number): Promise<ServiceCategory> {
    const child = await this.repository.findOne(id);
    return this.repository.findAncestorsTree(child);
  }
}
