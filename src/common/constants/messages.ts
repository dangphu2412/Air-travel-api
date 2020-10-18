export const UserError = {
  NotFound: "Not found this user",
  ConflictSelf: "Not allow to delete your self",
  ConflictSoftDeleted: "Your record has been soft deleted",
  ConflictExisted: "User existed",
  ForbiddenDelete: "Not allowed to soft delete admin or super admin",
  ConflictRestore: "Your record has been restore",
  Unauthorized: "Your username or password is not right"
}

export const ServiceError = {
  NotFound: "Not found this service",
  ConflictAuthor: "You are not author",
  ConflictSoftDeleted: "Your record has been soft deleted",
  ForbiddenDelete: "Not allowed to soft delete admin or super admin",
  ConflictRestore: "Your record has been restore",
  Unauthorized: "Your username or password is not right"
}
