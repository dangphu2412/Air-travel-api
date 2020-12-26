import Faker from "faker";
import {define} from "typeorm-seeding";
import {Role, Customer} from "../../common/entity";
import {Gender} from "../../common/enums/gender.enum";
import {enumToArray} from "../../utils";

define(Customer, (faker: typeof Faker, context: { role: Role }) => {
  const randomImg = [
    // eslint-disable-next-line max-len
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU",
    "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png",
    "https://cdn1.iconfinder.com/data/icons/avatar-97/32/avatar-02-512.png",
    "https://cdn.iconscout.com/icon/free/png-512/avatar-369-456321.png"
  ];
  const {role} = context;

  const fullName = faker.name.findName();
  const email = faker.internet.email(fullName);
  const password = "123123";
  const phoneNumber = faker.phone.phoneNumber();
  const avatar = faker.random.arrayElement(randomImg);
  const gender = faker.random.arrayElement(enumToArray(Gender));
  const birthday = faker.date.between("1975/01/01", "2010/01/01");
  const bio = faker.lorem.paragraph();
  const note = faker.lorem.paragraph();

  const customer = new Customer();
  customer.fullName = fullName;
  customer.email = email;
  customer.password = password;
  customer.phone = phoneNumber;
  customer.avatar = avatar;
  customer.gender = gender;
  customer.birthday = birthday;
  customer.bio = bio;
  customer.note = note;
  customer.role = role;
  customer.favouriteServiceIds = [
    "" + faker.random.arrayElement([1, 5]),
    "" + faker.random.arrayElement([6, 10])
  ];

  return customer;
});
