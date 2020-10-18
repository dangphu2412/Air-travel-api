import faker from "faker";
import {Service} from "../../../common/entity";
import data from "../data/destination.json";
import {DestinationSeed} from "./destination.heper";
import {SlugHelper} from "../../../global/slugify";

export class ServiceHelper {
  public async initService(userCount: number): Promise<void> {
    await Promise.all(
      Object.keys(data).map(async e => {
        const currentValues: DestinationSeed[] = data[e].value;
        await Promise.all(currentValues.map(val => {
          const slug = SlugHelper.slugifyWithDateTime(val.viName);
          const enTitle = slug;
          const viTitle = val.viName;
          const enSlug = slug;
          const viSlug = slug;
          const enDescription = val.viDescription;
          const {viDescription} = val;
          const enContent = val.viContent;
          const {viContent} = val;
          const note = faker.lorem.paragraph();
          const {thumbnail} = val;
          const price = faker.random.number({min: 3000000, max: 15000000});
          const currentPrice = price - faker.random.number({min: 100000, max: 1000000});
          const netPrice = price - faker.random.number({min: 100000, max: 1000000});
          const userId = faker.random.number({min: 1, max: userCount});
          const unit = faker.random.arrayElement(["xe", "tiền", "người"]);
          const {gallery} = val;

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
          item.gallery = gallery;
          return item.save();
        }));
      })
    );
  }
}
