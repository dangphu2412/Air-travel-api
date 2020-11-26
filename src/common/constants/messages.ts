export const DEFAULT_ERROR = {
  NotFound: "Not found",
  ConflictSelf: "You are not admin or not an author",
  ConflictSoftDeleted: "Your record has been soft deleted",
  ConflictExisted: "This record existed",
  ConflictUnique: "Effect to resource conflict constraint keys",
  Forbidden: "Not allowed to access this resource",
  ConflictRestore: "Your record has been restore",
  Unauthorized: "You need to sign in",
  InternalSignJwt: "Jwt sign goes wrong without saving userId"
}

export const UserError = {
  NotFound: "Please delete first",
  ConflictSelf: "Not allow to delete your self",
  ConflictSoftDeleted: "Your record has been soft deleted",
  ConflictExisted: "User existed",
  ForbiddenDelete: "Not allowed to soft delete admin or super admin",
  ConflictRestore: "Your record has been restore",
  Unauthorized: "Your username or password is not right",
  ConflictNotifyToken: "This token has already in used"
}

export const CustomerError = {
  ConflictExisted: "Your account has been existed",
  Unauthorized: "Your username or password is not right"
}

export const RoleError = {
  NotFound: "Please delete first",
  ConflictSelf: "Not allow to delete your self",
  ConflictSoftDeleted: "Your record has been soft deleted",
  ConflictExisted: "Role existed",
  Forbidden: "Must be admin",
  ConflictRestore: "Your record has been restore"
}

export const ServiceError = {
  NotFound: "Not found this service",
  ConflictAuthor: "You are not author",
  ConflictSoftDeleted: "Your record has been soft deleted",
  ForbiddenDelete: "Not allowed to soft delete admin or super admin",
  ConflictRestore: "Your record has been restore",
  Unauthorized: "Your username or password is not right"
}

export const DestinationError = {
  NotFound: "Not found this service",
  ConflictAuthor: "You are not author",
  ConflictSoftDeleted: "Your record has been soft deleted",
  ForbiddenDelete: "Not allowed to soft delete admin or super admin",
  ConflictRestore: "Your record has been restore",
  Unauthorized: "Your username or password is not right"
}

export const CityError = {
  NotFound: "Not found this city"
}

export const BillError = {
  NotFound: "Not found this bill"
}

export const BillInfoError = {
  NotFound: "Not found this bill info"
}
