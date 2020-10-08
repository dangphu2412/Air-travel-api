import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Override } from "@nestjsx/crud";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import { UpsertUserDto } from "src/common/dto/User/upsert.dto";
import { User } from "src/common/entity";
import { UserRepository } from "./index.repository";

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    private repository: UserRepository
  ) {
    super(repository);
  }

  findByUsername(username: string): Promise<User> {
    return this.repository.findOne({
      where: {
        username,
      }
    })
  }

  @Override('createOneBase')
  createOneBase(user: UpsertUserDto): Promise<User> {
    return this.repository.create(
      {
        username: user.username,
        password: user.password,
      }
    ).save();
  }

  async restoreUser(id: string, currentUser: User) {
    const record = await this.repository.findOne(id, {
      withDeleted: true
    });
    if (!record) throw new NotFoundException('Not found this user')
    if (parseInt(id, 10) === currentUser.id) throw new ConflictException('Can not restore yourself');
    if (record.deletedAt === null) throw new ConflictException('Your record has been restore');
    await this.repository.restore(record);
  }
}