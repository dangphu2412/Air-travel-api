import {
  ConflictException, ForbiddenException,
  Injectable, NotFoundException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest, Override} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {UserError} from "src/common/constants";
import {UpsertUserDto} from "src/common/dto/User/upsert.dto";
import {User} from "src/common/entity";
import {ERole, ErrorCodeEnum} from "src/common/enums";
import {Not} from "typeorm";
import {UserRepository} from "./index.repository";

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    private repository: UserRepository
  ) {
    super(repository);
  }

  private isNotAdmin(user: User): boolean {
    const {role} = user;
    if (role.name === ERole.ADMIN) {
      return false;
    }
    return true;
  }

  public findByUsername(username: string): Promise<User> {
    return this.repository.findOne({
      where: {
        username
      }
    })
  }

  @Override("createOneBase")
  public createOneBase(user: UpsertUserDto): Promise<User> {
    return this.repository.create(
      {
        username: user.username,
        password: user.password
      }
    ).save();
  }

  public async restore(id: number, currentUser: User) {
    const record = await this.repository.findOne(id, {
      where: {
        deletedAt: Not(null)
      }
    });
    if (!record) throw new NotFoundException(UserError.NotFound, ErrorCodeEnum.NOT_FOUND)
    if (id === currentUser.id || record.deletedAt === null) {
      throw new ConflictException(UserError.ConflictRestore, ErrorCodeEnum.ALREADY_EXIST);
    }
    await this.repository.restore(record);
  }

  public getDeleted(req: CrudRequest) {
    return this.find({
      where: {
        deletedAt: Not(null)
      },
      withDeleted: true,
      cache: req.options.query.cache,
      skip: req.parsed.offset,
      take: req.parsed.limit
    });
  }

  public async softDelete(id: number, currentUser: User): Promise<void> {
    const record = await this.repository.findOne(id, {
      relations: ["role"]
    });
    if (!record) throw new NotFoundException(UserError.NotFound, ErrorCodeEnum.NOT_FOUND);
    if (id === currentUser.id) {
      throw new ConflictException(UserError.ConflictSelf, ErrorCodeEnum.NOT_DELETE_YOURSELF);
    }
    if (record.deletedAt !== null) {
      throw new ConflictException(UserError.ConflictSoftDeleted, ErrorCodeEnum.NOT_DELETE_YOURSELF);
    }
    if (this.isNotAdmin(currentUser)) {
      throw new ForbiddenException(
        UserError.ForbiddenDelete,
        ErrorCodeEnum.NOT_DELETE_ADMIN_ROLE
      );
    }
    await this.repository.softDelete(record);
    return;
  }
}
