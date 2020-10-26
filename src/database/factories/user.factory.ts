import Faker from "faker";
import {define} from "typeorm-seeding";
import {Role, User} from "../../common/entity";
import {UserStatus} from "../../common/enums/userStatus.enum";
import {Gender} from "../../common/enums/gender.enum";
import {enumToArray} from "../../utils";

define(User, (faker: typeof Faker, context: { role: Role }) => {
  const {role} = context;

  const fullName = faker.name.findName();
  const email = faker.internet.email(fullName);
  const password = "member";
  const phoneNumber = faker.phone.phoneNumber();
  const avatar = faker.image.avatar();
  const gender = faker.random.arrayElement(enumToArray(Gender));
  const birthday = faker.date.between("1975/01/01", "2010/01/01");
  const bio = faker.lorem.paragraph();
  const note = faker.lorem.paragraph();
  const status = faker.random.arrayElement(enumToArray(UserStatus));

  const user = new User();
  user.fullName = fullName;
  user.email = email;
  user.password = password;
  user.phone = phoneNumber;
  user.avatar = avatar;
  user.gender = gender;
  user.birthday = birthday;
  user.bio = bio;
  user.note = note;
  user.status = status;
  user.role = role;

  return user;
});
