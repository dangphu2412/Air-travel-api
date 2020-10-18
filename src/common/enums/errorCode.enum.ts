export enum ErrorCodeEnum {
  NOT_FOUND = "NOT_FOUND", // 404
  METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED", // 405
  REQUEST_TIMEOUT = "REQUEST_TIMEOUT", // 408
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR", // 500

  // 400 BAD_REQUEST ERROR
  BAD_REQUEST = "BAD_REQUEST", // 400
  FAIL_VALIDATION = "FAIL_VALIDATION",
  IS_NOT_EFFECTED = "IS_NOT_EFFECTED",
  IS_NOT_EMPTY = "IS_NOT_EMPTY",
  IS_EMPTY = "IS_EMPTY",
  IS_MOBILE_PHONE = "IS_MOBILE_PHONE",
  IS_EMAIL = "IS_EMAIL",
  IS_STRING = "IS_STRING",
  IS_NUMBER = "IS_NUMBER",
  IS_INT = "IS_INT",
  MIN = "MIN",
  MAX = "MAX",
  IS_BOOLEAN = "IS_BOOLEAN",
  IS_ARRAY = "IS_ARRAY",
  IS_DATE_STRING = "IS_DATE_STRING",
  IS_ENUM = "IS_ENUM",
  IS_IN = "IS_IN",
  IS_NOT_IN = "IS_NOT_IN",
  IS_LATITUDE = "IS_LATITUDE",
  IS_LONGITUDE = "IS_LONGITUDE",
  IS_LAT_LONG = "IS_LAT_LONG",

  // 401 UNAUTHORIZED ERROR
  UNAUTHORIZED = "UNAUTHORIZED", // 401
  INCORRECT_PHONE_PASSWORD = "INCORRECT_PHONE_PASSWORD",
  INCORRECT_EMAIL_PASSWORD = "INCORRECT_EMAIL_PASSWORD",
  IS_NOT_ACTIVE = "IS_NOT_ACTIVE",
  IS_EXPIRED_TOKEN = "IS_EXPIRED_TOKEN",

  // 403 FORBIDDEN ERROR
  FORBIDDEN = "FORBIDDEN", // 403
  NOT_UPDATE_YOURSELF = "NOT_UPDATE_YOURSELF",
  NOT_UPDATE_CURRENT_ROLE = "NOT_UPDATE_CURRENT_ROLE",
  NOT_DELETE_YOURSELF = "NOT_DELETE_YOURSELF",
  NOT_DELETE_ADMIN_USER = "NOT_DELETE_ADMIN_USER",
  NOT_CREATE_ADMIN_USER = "NOT_CREATE_ADMIN_USER",
  NOT_UPDATE_ADMIN_USER = "NOT_UPDATE_ADMIN_USER",
  NOT_RESTORE_ADMIN_USER = "NOT_RESTORE_ADMIN_USER",
  NOT_DELETE_ADMIN_ROLE = "NOT_DELETE_ADMIN_ROLE",
  NOT_UPDATE_ADMIN_ROLE = "NOT_UPDATE_ADMIN_ROLE",
  NOT_CHANGE_ANOTHER_AUTHORS_ITEM = "NOT_CHANGE_ANOTHER_AUTHORS_ITEM",

  // 409 CONFLICT ERROR
  CONFLICT = "CONFLICT", // 409
  VIOLATE_FOREIGN_KEY_CONSTRAINT = "VIOLATE_FOREIGN_KEY_CONSTRAINT",
  ALREADY_EXIST = "ALREADY_EXIST"
}
