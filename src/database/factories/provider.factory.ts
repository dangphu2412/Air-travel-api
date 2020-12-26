import Faker from "faker";
import {enumToArray} from "../../utils";
import {define} from "typeorm-seeding";
import {Provider} from "../../common/entity";
import {Gender} from "../../common/enums/gender.enum";

define(Provider, (faker: typeof Faker, context: { userCount: number }) => {
  const randomImg = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU",
    "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png",
    "https://cdn1.iconfinder.com/data/icons/avatar-97/32/avatar-02-512.png",
    "https://cdn.iconscout.com/icon/free/png-512/avatar-369-456321.png"
  ]
  const {userCount} = context;
  const fullName = faker.name.findName();
  const email = faker.internet.email(fullName);
  const phoneNumber = faker.phone.phoneNumber();
  const avatar = faker.random.arrayElement(randomImg);
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
