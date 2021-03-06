import {CrudRequest, GetManyDefaultResponse} from "@nestjsx/crud";
import {EBaseCrudAction, ECrudAction} from "src/common/enums";
import {TValidateUser} from "src/common/type/t.Validate";

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 *
 * @param type
 * @param pointer this
 */
export const pickServiceToValidate = (type: TValidateUser, pointer: any): any => {
  const service = `${type.toLowerCase()}Service`;
  return pointer[service];
}

export const filterIdToUpdate = (presentRecords: any[]) => {
  const newRecords = [];
  const existedRecords = [];
  presentRecords.forEach(record => {
    if (!record.id) {
      newRecords.push(record);
    } else {
      existedRecords.push(record);
    }
  });

  return {
    newRecords,
    existedRecords
  }
}

export const mappingResponseFromCrudReq = <T>(
  req: CrudRequest, data: T[], total: number
): GetManyDefaultResponse<T> => {
  const {parsed, options} = req;
  const limit = parsed.limit ?? options.query.limit ?? 0;
  const offset = parsed.offset ?? 0;
  const page = total !== 0 ? Math.ceil(offset / limit) : 0;
  const pageCount = total !== 0 ? Math.ceil(total / limit) : 0;
  return {
    data,
    count: data.length,
    total,
    page,
    pageCount
  }
}

export const castPermission = (action: ECrudAction): EBaseCrudAction => {
  return EBaseCrudAction[action] ?? action;
}
