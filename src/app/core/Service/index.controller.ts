import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Controller, Patch, Param, ParseIntPipe, Get, UseInterceptors, Delete} from "@nestjs/common";
import {
  Crud, CrudController, Feature,
  ParsedRequest, CrudRequest, CrudRequestInterceptor, Override, ParsedBody
} from "@nestjsx/crud";
import {Service, User} from "src/common/entity";
import {ServiceService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {Lang} from "src/common/constants/lang";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";
import {CrudSwaggerFindMany} from "src/common/decorators/crudSwagger.decorator";

@Crud({
  model: {
    type: Service
  },
  query: {
    join: {
      serviceCategories: {
        allow: ["id", "viName", "enName", "enSlug", "viSlug", "thumbnail"],
        eager: true
      },
      provider: {
        allow: ["id", "fullName", "avatar"],
        eager: true
      },
      destinations: {
        exclude: ["enContent", "viContent"],
        eager: true
      },
      "destinations.location": {
        eager: true
      },
      user: {
        allow: ["id", "fullName", "avatar"],
        eager: true
      }
    }
  },
  routes: {
    exclude: ["createManyBase"],
    replaceOneBase: {
      decorators: [
        GrantAccess({
          action: ECrudAction.REPLACE
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
@ApiTags("Services")
@Feature(ECrudFeature.SERVICE)
@Controller("services")
export class ServiceController implements CrudController<Service> {
  constructor(public service: ServiceService) {}

  get base(): CrudController<Service> {
    return this;
  }

  @UseInterceptors(SqlInterceptor)
  @GrantAccess({
    action: ECrudAction.CREATE
  })
  @Override("createOneBase")
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Service,
    @CurrentUser() user: User
  ): Promise<Service> {
    this.service.getUserId(dto, user);
    await this.service.mapRelationKeysToEntities(dto);
    return this.base.createOneBase(req, dto);
  };

  @UseInterceptors(SqlInterceptor)
  @GrantAccess({
    action: ECrudAction.UPDATE
  })
  @Override("updateOneBase")
  async updateOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Service,
    @CurrentUser() user: User
  ): Promise<Service> {
    this.service.getUserId(dto, user);
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
  restoreService(
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

  @CrudSwaggerFindMany()
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
  ): Promise<Service> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.EN);
  }

  @ApiOperation({
    summary: "Get one record by vietnam slug"
  })
  @Get("vislug-:slug")
  getVnSlug(
    @Param("slug") slug: string
  ): Promise<Service> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.VN);
  }
}
