import moment from "moment";
import slug from "slugify";
import {ISlug} from "src/common/interface/i.slug";
import {TSlugColumnOptions} from "src/common/type/t.colSlug";
import {each} from "lodash";

class Helper implements ISlug {
  public slugify(data: string): string {
    return slug(data);
  }

  public slugifyWithDateTime(data: string): string {
    const typeFormat = "YYYYMMDDHHmmssSS";
    const date: string = moment().format(typeFormat);
    return `${slug(data)}-${date}`;
  }

  public slugifyUpperCaseAndRemoveDash(data: string) {
    const locale = "vi";
    return slug(data, {locale}).toUpperCase().split("-").join("");
  }

  /**
   *
   * @param sourceObject Source object to be changed
   * @param columns columns with options change
   */
  public slugifyColumns<T>(sourceObject: T, columns: Array<TSlugColumnOptions>): void {
    each(columns, value => {
      const {name, value: currentSlug} = value;
      sourceObject[name] = currentSlug;
    })
  }
}

export const SlugHelper = new Helper();
