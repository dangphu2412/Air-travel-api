import * as Faker from "faker";
import {define} from "typeorm-seeding";
import {startCase, camelCase} from "lodash";
import {Destination} from "../../common/entity";
import {SlugHelper} from "../../global/slugify";

define(Destination, (
  faker: typeof Faker,
  context: { userCount: number }
) => {
  const {userCount} = context;
  const enName = startCase(camelCase(faker.lorem.words()));
  const viName = startCase(camelCase(faker.lorem.words()));
  const enSlug = SlugHelper.slugify(enName);
  const viSlug = SlugHelper.slugify(viName);
  const enDescription = faker.lorem.paragraph();
  const viDescription = faker.lorem.paragraph();
  const enContent = faker.lorem.paragraphs();
  const viContent = faker.lorem.paragraphs();
  const thumbnail = "https://picsum.photos/500/500";
  const userId = faker.random.number({min: 1, max: userCount});

  const item = new Destination();
  item.enName = enName;
  item.viName = viName;
  item.enSlug = enSlug;
  item.viSlug = viSlug;
  item.enDescription = enDescription;
  item.viDescription = viDescription;
  item.enContent = enContent;
  item.viContent = viContent;
  item.thumbnail = thumbnail;
  item.userId = userId;
  return item;
});
