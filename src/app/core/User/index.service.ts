import {
  ConflictException, ForbiddenException,
  Injectable, NotFoundException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {UserError} from "src/common/constants";
import {RegisterDto} from "src/common/dto/User";
import {User} from "src/common/entity";
import {ERole, ErrorCodeEnum} from "src/common/enums";
import {TJwtPayload} from "src/common/type";
import {In, Not} from "typeorm";
import {UserRepository} from "./index.repository";

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    private repository: UserRepository
  ) {
    super(repository);
  }

  public getCurrentUserFromEntities(users: User[], id: number): User {
    return users.find(user => user.id === id);
  }

  public isNotAdmin(user: User): boolean {
    const {role} = user;
    if (role.name === ERole.ADMIN) {
      return false;
    }
    return true;
  }

  public findByEmail(email: string): Promise<User> {
    return this.repository.findOne({
      where: {
        email
      },
      relations: ["role", "role.permissions"]
    })
  }

  public findByIdAndOnlyGetRole(id: number) {
    return this.repository.findOne(id, {
      select: ["id"],
      relations: ["role"]
    })
  }

  public createOneBase(user: RegisterDto): Promise<User> {
    return this.repository.create(
      {
        email: user.email,
        password: user.password
      }
    ).save();
  }

  public async restore(id: number, currentUser: TJwtPayload) {
    const record = await this.repository.findOne(id, {
      where: {
        deletedAt: Not(null)
      }
    });
    if (!record) throw new NotFoundException(UserError.NotFound, ErrorCodeEnum.NOT_FOUND)
    if (id === currentUser.userId) {
      throw new ConflictException(
        UserError.ConflictRestore,
        ErrorCodeEnum.ALREADY_EXIST
      );
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

  public async softDelete(id: number, currentUser: TJwtPayload): Promise<void> {
    if (id === currentUser.userId) {
      throw new ConflictException(
        UserError.ConflictSelf,
        ErrorCodeEnum.NOT_DELETE_YOURSELF
      );
    }
    const records = await this.repository.find({
      where: In([id, currentUser.userId]),
      relations: ["role"]
    });
    const currentUserEntity = this.getCurrentUserFromEntities(
      records, currentUser.userId
    );
    const record = records.find(record => record.id !== currentUser.userId);
    if (!record) throw new NotFoundException(UserError.NotFound, ErrorCodeEnum.NOT_FOUND);

    if (record.deletedAt !== null) {
      throw new ConflictException(
        UserError.ConflictSoftDeleted,
        ErrorCodeEnum.NOT_DELETE_YOURSELF
      );
    }
    if (this.isNotAdmin(currentUserEntity)) {
      throw new ForbiddenException(
        UserError.ForbiddenDelete,
        ErrorCodeEnum.NOT_DELETE_ADMIN_ROLE
      );
    }
    await this.repository.softDelete(record);
    return;
  }
}
