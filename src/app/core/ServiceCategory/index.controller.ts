import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Param, ParseIntPipe, Patch, UseInterceptors} from "@nestjs/common";
import {
  Crud, CrudController, CrudRequest, CrudRequestInterceptor,
  Feature, Override, ParsedBody, ParsedRequest
} from "@nestjsx/crud";
import {ServiceCategory, User} from "src/common/entity";
import {ServiceCategoryService} from "./index.service";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {CurrentUser, GrantAccess} from "src/common/decorators";
import {Lang} from "src/common/constants/lang";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";

@Crud({
  model: {
    type: ServiceCategory
  },
  routes: {
    exclude: ["createManyBase"],
    createOneBase: {
      decorators: [
        GrantAccess({
          action: ECrudAction.CREATE
        })
      ],
      interceptors: [SqlInterceptor]
    },
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
  },
  query: {
    join: {
      user: {
        allow: ["id", "fullName", "avatar"]
      },
      children: {
        eager: true
      }
    }
  }
})
@ApiTags("ServiceCategories")
@Feature(ECrudFeature.SERVICE_CATEGORY)
@Controller("service_categories")
export class ServiceCategoryController implements CrudController<ServiceCategory> {
  constructor(public service: ServiceCategoryService) {}

  get base(): CrudController<ServiceCategory> {
    return this;
  }

  @UseInterceptors(SqlInterceptor)
  @GrantAccess({
    action: ECrudAction.CREATE
  })
  @Override("createOneBase")
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: ServiceCategory,
    @CurrentUser() user: User
  ): Promise<ServiceCategory> {
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
    @ParsedBody() dto: ServiceCategory,
    @CurrentUser() user: User
  ): Promise<ServiceCategory> {
    this.service.getUserId(dto, user);
    return this.base.updateOneBase(req, dto);
  };


  @ApiOperation({
    summary: "Restore one"
  })
  @Patch(":id/restore")
  @GrantAccess({
    action: ECrudAction.RESTORE
  })
  restoreDestination(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.service.restore(id, user);
  }

  @ApiOperation({
    summary: "Get trashed"
  })
  @UseInterceptors(CrudRequestInterceptor)
  @Get("trashed")
  getDeleted(@ParsedRequest() req: CrudRequest) {
    return this.service.getDeleted(req);
  }

  @ApiOperation({
    summary: "Delete softly"
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

  @Get("enslug-:slug")
  getEnglishSlug(
    @Param("slug") slug: string
  ): Promise<ServiceCategory> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.EN);
  }

  @Get("vislug-:slug")
  getVnSlug(
    @Param("slug") slug: string
  ): Promise<ServiceCategory> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.VN);
  }

  @Get("roots")
  getRoots(): Promise<ServiceCategory[]> {
    return this.service.getRoots();
  }

  @Get(":id/children")
  getChildrens(@Param("id", ParseIntPipe) id: number): Promise<ServiceCategory> {
    return this.service.getChildrens(id);
  }

  @Get(":id/parents")
  getParent(@Param("id", ParseIntPipe) id: number): Promise<ServiceCategory> {
    return this.service.getParent(id);
  }
}
