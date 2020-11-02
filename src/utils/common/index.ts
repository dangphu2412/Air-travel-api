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
