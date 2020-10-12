import * as Faker from "faker";
import {define} from "typeorm-seeding";
import {User} from "../../common/entity/user.entity";
import {Role} from "../../common/entity/role.entity";

define(User,
  (
    faker: typeof Faker,
    context: { role: Role, password: string }
  ) => {
    const {role, password} = context;

    const gender = faker.random.number(1);
    const firstName = faker.name.firstName(gender);
    const lastName = faker.name.lastName(gender);

    const user = new User()
    user.username = `${firstName} ${lastName}`;
    user.password = password;
    user.role = role;
    return user
  })
