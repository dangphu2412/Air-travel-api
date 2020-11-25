import {ServiceCategory, User} from "../../../common/entity";
import {CsvHelper} from "../../../utils/csv";
import {SlugHelper} from "../../../global/slugify";
export class ServiceCategoryHelper {
  private _csvHelper: CsvHelper;

  constructor(csvHelper: CsvHelper) {
    this._csvHelper = csvHelper;
  }

  public async initServiceCategory(): Promise<ServiceCategory[]> {
    const data = await this._csvHelper.readCsv() as ServiceCategory[];
    const parents: Promise<ServiceCategory>[] = [];
    const childs: Promise<ServiceCategory>[] = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const dto = new ServiceCategory();
      dto.enName = item.enName || null;
      dto.viName = item.viName || null;
      dto.enSlug = SlugHelper.slugifyWithDateTime(item.enName);
      dto.viSlug = SlugHelper.slugifyWithDateTime(item.viName);
      dto.user = await User.findOne(item.userId) || null;

      if (item.parentId === "") {
        parents.push(dto.save());
      }
      else {
        dto.parent = await ServiceCategory.findOne(item.parentId) || null;
        childs.push(dto.save());
      }
    }

    return Promise.all([...parents, ...childs]);
  }
}
