import {ServiceCategory, User} from "../../../common/entity";
import {CsvHelper} from "../../../utils/csv";
import * as faker from "faker";
import {SlugHelper} from "../../../global/slugify";
import {UpsertServiceCategoryDto} from "../../../common/dto/ServiceCategory";
export class ServiceCategoryHelper {
  private _csvHelper: CsvHelper;

  constructor(csvHelper: CsvHelper) {
    this._csvHelper = csvHelper;
  }

  public async initServiceCategory(): Promise<void> {
    const data = await this._csvHelper.readCsv() as UpsertServiceCategoryDto[];
    const parents = data.filter(item => item.parentId === "");
    await Promise.all(parents.map(async item => {
      const dto = new ServiceCategory();
      dto.enName = item.enName || null;
      dto.viName = item.viName || null;
      dto.enDescription = item.enDescription || faker.lorem.paragraphs(1);
      dto.viDescription = item.viDescription || faker.lorem.paragraphs(1);
      dto.enSlug = SlugHelper.slugifyWithDateTime(item.enName);
      dto.viSlug = SlugHelper.slugifyWithDateTime(item.viName);
      dto.user = await User.findOne(item.userId) || null;
      return dto.save();
    }));
    await Promise.all(data.map(async item => {
      if (item.parentId !== "") {
        const dto = new ServiceCategory();
        dto.enName = item.enName || null;
        dto.viName = item.viName || null;
        dto.enDescription = item.enDescription || faker.lorem.paragraphs(1);
        dto.viDescription = item.viDescription || faker.lorem.paragraphs(1);
        dto.enSlug = SlugHelper.slugifyWithDateTime(item.enName);
        dto.viSlug = SlugHelper.slugifyWithDateTime(item.viName);
        dto.parent = await ServiceCategory.findOne(item.parentId) || null;
        dto.user = await User.findOne(item.userId) || null;
        return dto.save();
      }
    }));
  }
}
