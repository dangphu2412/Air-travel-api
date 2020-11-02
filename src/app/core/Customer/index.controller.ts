import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Controller, Patch, Param, ParseIntPipe, Get, UseInterceptors, Delete} from "@nestjs/common";
import {
  Crud, CrudController, Feature,
  ParsedRequest, CrudRequest, CrudRequestInterceptor, Override, ParsedBody
} from "@nestjsx/crud";
import {Customer, User} from "src/common/entity";
import {CustomerService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {Lang} from "src/common/constants/lang";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";

/**
 * TODO: Get me customer
 * soft delete and restore auth
 * update profile customer
 * register customer in auth
 */

@Crud({
  model: {
    type: Customer
  },
  routes: {
    exclude: ["createOneBase", "createManyBase"],
    replaceOneBase: {
      decorators: [
        GrantAccess({
          jwtOnly: true
        })
      ],
      interceptors: [SqlInterceptor]
    },
    deleteOneBase: {
      decorators: [
        GrantAccess({
          action: ECrudAction.DELETE
        })
      ]
    }
  }
})
@ApiTags("Customers")
@Feature(ECrudFeature.CUSTOMER)
@Controller("customers")
export class CustomerController implements CrudController<Customer> {
  constructor(public service: CustomerService) {}

  get base(): CrudController<Customer> {
    return this;
  }

  @UseInterceptors(SqlInterceptor)
  @GrantAccess({
    action: ECrudAction.UPDATE
  })
  @Override("updateOneBase")
  async updateOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Customer,
    @CurrentUser() user: User
  ): Promise<Customer> {
    await this.service.mapRelationKeysToEntities(dto);
    return this.base.updateOneBase(req, dto);
  };

  @ApiOperation({
    description: "Restore one record"
  })
  @Patch(":id/restore")
  @GrantAccess({
    action: ECrudAction.RESTORE
  })
  restoreCustomer(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.service.restore(id, user);
  }

  @ApiOperation({
    summary: "Get trashed records with crud fitler"
  })
  @UseInterceptors(CrudRequestInterceptor)
  @Get("trashed")
  @GrantAccess({
    action: ECrudAction.READ
  })
  getDeleted(@ParsedRequest() req: CrudRequest) {
    return this.service.getDeleted(req);
  }

  @ApiOperation({
    summary: "Soft delete one record"
  })
  @Override("deleteOneBase")
  @GrantAccess({
    action: ECrudAction.SOFT_DEL
  })
  softDelete(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: User
  ) {
    return this.service.softDelete(id, currentUser);
  }

  @ApiOperation({
    summary: "Permanently delete one record"
  })
  @Delete(":id/permanently")
  @GrantAccess({
    action: ECrudAction.DELETE
  })
  hardDelete(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.deleteOneBase(req);
  }

  @ApiOperation({
    summary: "Get one record by english slug"
  })
  @Get("enslug-:slug")
  getEnglishSlug(
    @Param("slug") slug: string
  ): Promise<Customer> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.EN);
  }

  @ApiOperation({
    summary: "Get one record by vietnam slug"
  })
  @Get("vislug-:slug")
  getVnSlug(
    @Param("slug") slug: string
  ): Promise<Customer> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.VN);
  }
}
