import {map} from "lodash";
import {TErrorMessage} from "src/common/type/t.Error";

export const toError = (...error: TErrorMessage[]): TErrorMessage[] => {
  return map(error, (item: TErrorMessage) => ({
    code: item.code,
    description: item.description
  }));
}
