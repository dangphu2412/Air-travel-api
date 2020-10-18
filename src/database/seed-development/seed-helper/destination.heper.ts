import {random} from "faker";
import {City, Destination} from "../../../common/entity";
import {generateRandomNumber} from "../../../utils";
import {SlugHelper} from "../../../global/slugify";
import data from "../data/destination.json";
export interface DestinationSeed {
  viName: string;
  viDescription: string;
  thumbnail: string;
  viContent : string;
  price: number;
  address: string;
  gallery: Array<any>
}

export class DestinationHelper {
  public async initDestination(userCount: number) {
    const cityRepo = City.getRepository();
    const destinationRepo = Destination.getRepository();

    await Promise.all(
      Object.keys(data).map(async e => {
        const city = await cityRepo.findOne({
          where: {
            slug: e
          },
          relations: ["districts"]
        });
        const {districts} = city;

        const currentValues: DestinationSeed[] = data[e].value;
        const startLongitude = data[e].coordination.longitude;
        const startLatitude = data[e].coordination.latitude;
        const endLongitude = startLongitude + 0.05;
        const endLatitude = startLatitude + 0.05;
        await Promise.all(currentValues.map(val => {
          const districtSlug = (
            SlugHelper
              .slugify(val.address.split(",")[0])
              .toUpperCase()
          ).split("-").join("");
          const districtFound = districts.find(dis => (districtSlug === dis.slug));
          const destination = destinationRepo.create();

          const slug = SlugHelper.slugify(val.viName) + generateRandomNumber(1, 2);
          destination.enName = SlugHelper.slugify(val.viName);
          destination.viName = val.viName;
          destination.enContent = val.viContent;
          destination.viContent = val.viContent;
          destination.enDescription = val.viDescription;
          destination.viDescription = val.viDescription;;
          destination.enSlug = slug;
          destination.viSlug = slug;
          destination.thumbnail = val.thumbnail;
          destination.userId = random.number({min: 1, max: userCount});
          destination.city = city;
          destination.district = districtFound;
          destination.address = val.address;
          destination.latitude = generateRandomNumber(startLatitude, endLatitude);
          destination.longitude = generateRandomNumber(startLongitude, endLongitude);
          return destination.save();
        }));
      })
    );
  }
}
