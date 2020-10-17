import {ApiTags} from "@nestjs/swagger";
import {Controller, Patch, Param, ParseIntPipe, Get, UseInterceptors, Delete} from "@nestjs/common";
import {
  Crud, CrudController, Feature, Action,
  ParsedRequest, CrudRequest, CrudRequestInterceptor
} from "@nestjsx/crud";
import {UpsertServiceDto} from "src/common/dto/Service";
import {Service, User} from "src/common/entity";
import {ServiceService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature, ERole} from "src/common/enums";
import {Lang} from "src/common/constants/lang";

@Crud({
  model: {
    type: Service
  },
  query: {
    join: {
      serviceCategories: {
        allow: ["viName", "enName", "enSlug", "viSlug", "thumbnail"],
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
  dto: {
    create: UpsertServiceDto,
    update: UpsertServiceDto,
    replace: UpsertServiceDto
  },
  routes: {
    exclude: ["createManyBase"],
    createOneBase: {
      decorators: [
        Action(ECrudAction.CREATE),
        GrantAccess(ERole.OPERATOR)
      ]
    },
    replaceOneBase: {
      decorators: [
        Action(ECrudAction.REPLACE),
        GrantAccess(ERole.OPERATOR)
      ]
    },
    deleteOneBase: {
      decorators: [
        Action(ECrudAction.REPLACE),
        GrantAccess(ERole.OPERATOR)
      ]
    }
  }
})
@ApiTags("Services")
@Feature(ECrudFeature.SERVICE)
@Controller("services")
export class ServiceController implements CrudController<Service> {
  constructor(public service: ServiceService) {}

  @Patch(":id/restore")
  @Action(ECrudAction.RESTORE)
  @GrantAccess(ERole.OPERATOR)
  restoreService(
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

  @Delete(":id")
  @Action(ECrudAction.SOFT_DEL)
  @GrantAccess(ERole.OPERATOR)
  softDelete(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: User
  ) {
    return this.service.softDelete(id, currentUser);
  }

  @Get("enslug-:slug")
  getEnglishSlug(
    @Param("slug") slug: string
  ): Promise<Service> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.EN);
  }

  @Get("/viSlug-:slug")
  getVnSlug(
    @Param("slug") slug: string
  ): Promise<Service> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.VN);
  }
}
