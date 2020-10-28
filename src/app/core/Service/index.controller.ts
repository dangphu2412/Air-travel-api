import {ApiTags} from "@nestjs/swagger";
import {Controller, Patch, Param, ParseIntPipe, Get, UseInterceptors, Delete} from "@nestjs/common";
import {
  Crud, CrudController, Feature, Action,
  ParsedRequest, CrudRequest, CrudRequestInterceptor, Override, ParsedBody
} from "@nestjsx/crud";
import {Service, User} from "src/common/entity";
import {ServiceService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {Lang} from "src/common/constants/lang";
import {TJwtPayload} from "src/common/type";

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
    createOneBase: {
      decorators: [
        Action(ECrudAction.CREATE),
        GrantAccess()
      ]
    },
    replaceOneBase: {
      decorators: [
        Action(ECrudAction.REPLACE),
        GrantAccess()
      ]
    },
    deleteOneBase: {
      decorators: [
        Action(ECrudAction.DELETE),
        GrantAccess()
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

  @Action(ECrudAction.CREATE)
  @GrantAccess()
  @Override("createOneBase")
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Service,
    @CurrentUser() user: TJwtPayload
  ): Promise<Service> {
    this.service.getUserId(dto, user);
    await this.service.authAdmin(dto, user);
    await this.service.mapRelationKeysToEntities(dto);
    return this.base.createOneBase(req, dto);
  };

  @Action(ECrudAction.UPDATE)
  @GrantAccess()
  @Override("updateOneBase")
  async updateOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Service,
    @CurrentUser() user: TJwtPayload
  ): Promise<Service> {
    this.service.getUserId(dto, user);
    await this.service.authAdmin(dto, user);
    await this.service.mapRelationKeysToEntities(dto);
    return this.base.updateOneBase(req, dto);
  };

  @Patch(":id/restore")
  @Action(ECrudAction.RESTORE)
  @GrantAccess()
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
  ): Promise<Service> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.EN);
  }

  @Get("vislug-:slug")
  getVnSlug(
    @Param("slug") slug: string
  ): Promise<Service> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.VN);
  }
}
