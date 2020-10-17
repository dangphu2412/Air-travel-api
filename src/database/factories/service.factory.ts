import * as Faker from "faker";
import {SlugHelper} from "../../global/slugify";
import {define} from "typeorm-seeding";
import {Service} from "../../common/entity";

define(Service, (faker: typeof Faker, context: { userCount: number }) => {
  const {userCount} = context;

  const enTitle = Faker.lorem.sentence();
  const viTitle = Faker.lorem.sentence();
  const enSlug = SlugHelper.slugifyWithDateTime(enTitle);
  const viSlug = SlugHelper.slugifyWithDateTime(viTitle);
  const enDescription = Faker.lorem.paragraph();
  const viDescription = Faker.lorem.paragraph();
  const enContent = Faker.lorem.paragraphs();
  const viContent = Faker.lorem.paragraphs();
  const note = Faker.lorem.paragraph();
  const thumbnail = Faker.image.image();
  const price = Faker.random.number({min: 3000000, max: 15000000});
  const currentPrice = price - Faker.random.number({min: 100000, max: 1000000});
  const netPrice = price - Faker.random.number({min: 100000, max: 1000000});
  const userId = Faker.random.number({min: 1, max: userCount});
  const unit = Faker.random.arrayElement(["xe", "tiền", "người"]);

  const item = new Service();
  item.enTitle = enTitle;
  item.viTitle = viTitle;
  item.enSlug = enSlug;
  item.viSlug = viSlug;
  item.enDescription = enDescription;
  item.viDescription = viDescription;
  item.enContent = enContent;
  item.viContent = viContent;
  item.note = note;
  item.thumbnail = thumbnail;
  item.price = price;
  item.currentPrice = currentPrice;
  item.netPrice = netPrice;
  item.userId = userId;
  item.unit = unit;

  return item;
});
