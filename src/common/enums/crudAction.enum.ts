export enum ECrudAction {
  READ = "READ",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  REPLACE = "REPLACE",
  SOFT_DEL = "SOFT_DEL",
  DELETE = "DELETE",
  RESTORE = "RESTORE"
}

export enum EBaseCrudAction {
  "Read-All"= "READ",
  "Create-One"= "CREATE",
  "Update-One"= "UPDATE",
  "Replace-One"= "REPLACE",
  "Delete-One"= "SOFT_DEL"
}

export enum ECrudFeature {
  AUTH = "AUTH",
  ROLE = "ROLE",
  PERMISSIONS = "PERMISSIONS",
  USER = "USER",
  SERVICE = "SERVICE",
  DESTINATION = "DESTINATION",
  SERVICE_CATEGORY = "SERVICE_CATEGORY",
  PROVIDER = "PROVIDER",
  CUSTOMER = "CUSTOMER",
  BILL = "BILL",
  BILL_INFO = "BILL_INFO",
  BILL_SERVICE = "BILL_SERVICE",
  CITY = "CITY",
  DISTRICT = "DISTRICT",
  PAYMENT = "PAYMENT"
}
