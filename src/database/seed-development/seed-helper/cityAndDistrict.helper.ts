import {City, District} from "../../../common/entity";
import data from "../data/cityAndDistrict.json";
export class CityAndDistrictHelper {
  private _data: any;

  constructor() {
    this._data = data;
  }

  public async initCitiesAndDistricts() {
    const cities: Array<City> = await this.createCities();
    await this.createDistricts(cities);
  }

  public createCities(): Promise<City[]> {
    const cityRepo = City.getRepository();
    return Promise.all(Object.keys(this._data).map(citySlug => {
      const cityName = this._data[citySlug].name;
      const cityDto = cityRepo.create();
      cityDto.name = cityName;
      cityDto.slug = citySlug;
      return cityDto.save();
    }));
  }

  public createDistricts(cities: Array<City>): Promise<Promise<District>[][]> {
    const districtRepo = District.getRepository();
    let i = 0;
    return Promise.all(Object.keys(data).map(citySlug => {
      const city = cities[i];
      const district = data[citySlug].cities;
      const pendingDistrict = Object.keys(district)
        .map(slug => {
          const districtName = district[slug];
          const districtDto = districtRepo.create();
          districtDto.city = city;
          districtDto.name = districtName;
          districtDto.slug = slug;
          return districtDto.save();
        });
      i += 1;
      return pendingDistrict;
    }));
  }
}
