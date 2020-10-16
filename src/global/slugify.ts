import * as moment from "moment";
import slug from "slugify";
import {Logger} from "@nestjs/common";
import {ISlug} from "src/common/interface/i.slug";
import {TSlugColumnOptions} from "src/common/type/t.colSlug";
import {each, has} from "lodash";

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
    return slug(data).toUpperCase().split("-").join("");
  }

  /**
   *
   * @param sourceObject Source object to be changed
   * @param columns columns with options change
   */
  public slugifyColumns<T>(sourceObject: T, columns: Array<TSlugColumnOptions>): void {
    each(columns, value => {
      const {name, value: currentSlug} = value;
      if (!has(sourceObject, name)) {
        Logger.error(`There is no key ${name} in ${sourceObject}`);
        process.exit(1);
      }
      // Assign value with callback slugify object
      sourceObject[name] = currentSlug;
    })
  }
}

export const SlugHelper = new Helper();
