import {DEFAULT_ERROR} from "src/common/constants";
import {ConflictException, ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {ServiceCategory, User} from "src/common/entity";
import {ServiceCategoryRepository} from "./index.repository";
import {FindOneOptions, IsNull, Not} from "typeorm";
import {ErrorCodeEnum} from "src/common/enums";
import {CrudRequest} from "@nestjsx/crud";
import {Lang} from "src/common/constants/lang";
import {UserService} from "../User/index.service";

@Injectable()
export class ServiceCategoryService extends TypeOrmCrudService<ServiceCategory> {
  constructor(
    @InjectRepository(ServiceCategory)
    private repository: ServiceCategoryRepository,
    private userService: UserService
  ) {
    super(repository);
  }

  public findByIds(ids: number[]) {
    return this.repository.findByIds(ids);
  }

  public async restore(id: number, currentUser: User) {
    const record = await this.repository.findOne(id, {
      where: {
        deletedAt: Not(IsNull())
      },
      relations: ["user", "user.role"]
    });
    if (!record) throw new NotFoundException(
      DEFAULT_ERROR.NotFound,
      ErrorCodeEnum.NOT_FOUND
    )
    const {user} = record;
    if (this.userService.isNotAdmin(user)
    && this.userService.isNotAuthor(user, currentUser)
    ) {
      throw new ForbiddenException(
        DEFAULT_ERROR.ConflictSelf,
        ErrorCodeEnum.NOT_CHANGE_ANOTHER_AUTHORS_ITEM
      );
    }
    if (record.deletedAt === null) throw new ConflictException(
      DEFAULT_ERROR.ConflictRestore,
      ErrorCodeEnum.CONFLICT
    );
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
