import {TSlugColumnOptions} from "../type/t.colSlug";

export interface ISlug {
  slugify(data: string): string

  slugifyWithDateTime(data: string): string

  slugifyUpperCaseAndRemoveDash(data: string): string;

  slugifyColumns<T>(sourceObject: T, columns: Array<TSlugColumnOptions>): void;
}
