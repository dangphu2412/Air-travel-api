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
