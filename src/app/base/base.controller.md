<code>
@Action(ECrudAction.CREATE)
@GrantAccess()
@Override("createOneBase")
async createOneOverride(
  @ParsedRequest() req: CrudRequest,
  @ParsedBody() dto: Role,
  @CurrentUser() user: User
): Promise<T> {
  this.service.getUserId(dto, user);
  await this.service.mapRelationKeysToEntities(dto, user);
  return this.base.createOneBase(req, dto);
};

@Action(ECrudAction.UPDATE)
@GrantAccess()
@Override("updateOneBase")
async updateOneOverride(
  @ParsedRequest() req: CrudRequest,
  @ParsedBody() dto: Role,
  @CurrentUser() user: User
): Promise<T> {
  this.service.getUserId(dto, user);
  await this.service.mapRelationKeysToEntities(dto, user);
  return this.base.updateOneBase(req, dto);
};

@Patch(":id/restore")
@Action(ECrudAction.RESTORE)
@GrantAccess()
async restoreDestination(
  @Param("id", ParseIntPipe) id: number,
  @CurrentUser() user: User
) {
  return this.service.restore(id, user);
}

@UseInterceptors(CrudRequestInterceptor)
@Get("trashed")
getDeleted(@ParsedRequest() req: CrudRequest) {
  return this.service.getDeleted(req);
}

@Override("deleteOneBase")
@Delete(":id")
@Action(ECrudAction.SOFT_DEL)
@GrantAccess()
async softDelete(
  @Param("id", ParseIntPipe) id: number,
  @CurrentUser() user: User
) {
  return this.service.softDelete(id, user);
}
</code>