import Faker from "faker";
import {enumToArray} from "../../utils";
import {define} from "typeorm-seeding";
import {Provider} from "../../common/entity";
import {Gender} from "../../common/enums/gender.enum";

define(Provider, (faker: typeof Faker, context: { userCount: number }) => {
  const {userCount} = context;
  const fullName = faker.name.findName();
  const email = faker.internet.email(fullName);
  const phoneNumber = faker.phone.phoneNumber();
  const avatar = faker.image.avatar();
  const gender = faker.random.arrayElement(enumToArray(Gender));
  const birthday = faker.date.between("1975/01/01", "2010/01/01");
  const note = faker.lorem.paragraph();
  const userId = faker.random.number({min: 1, max: userCount});

  const provider = new Provider();
  provider.name = fullName;
  provider.email = email;
  provider.phone = phoneNumber;
  provider.avatar = avatar;
  provider.gender = gender;
  provider.birthday = birthday;
  provider.note = note;
  provider.userId = userId;

  return provider;
});
