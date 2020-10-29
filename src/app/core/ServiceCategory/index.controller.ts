import {ApiTags} from "@nestjs/swagger";
import {Controller, Delete, Get, Param, ParseIntPipe, Patch, UseInterceptors} from "@nestjs/common";
import {
  Action,
  Crud, CrudController, CrudRequest, CrudRequestInterceptor, Feature, Override, ParsedRequest
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
        Action(ECrudAction.CREATE),
        GrantAccess()
      ],
      interceptors: [SqlInterceptor]
    },
    replaceOneBase: {
      decorators: [
        Action(ECrudAction.REPLACE),
        GrantAccess()
      ],
      interceptors: [SqlInterceptor]
    },
    deleteOneBase: {
      decorators: [
        Action(ECrudAction.DELETE),
        GrantAccess()
      ]
    }
  },
  query: {
    join: {
      user: {
        allow: ["id", "fullName", "avatar"]
      }
    }
  }
})
@ApiTags("ServiceCategories")
@Feature(ECrudFeature.SERVICE_CATEGORY)
@Controller("service_categories")
export class ServiceCategoryController implements CrudController<ServiceCategory> {
  constructor(public service: ServiceCategoryService) {}

  @Patch(":id/restore")
  @Action(ECrudAction.RESTORE)
  @GrantAccess()
  restoreDestination(
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
