import {ApiTags} from "@nestjs/swagger";
import {Controller, Patch, Param, ParseIntPipe, Get, UseInterceptors, Delete} from "@nestjs/common";
import {
  Crud, CrudController, Feature,
  ParsedRequest, CrudRequest, CrudRequestInterceptor, Override, ParsedBody
} from "@nestjsx/crud";
import {Destination, User} from "src/common/entity";
import {DestinationService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {Lang} from "src/common/constants/lang";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";

@Crud({
  model: {
    type: Destination
  },
  query: {
    join: {
      city: {
        eager: true
      },
      district: {
        eager: true
      }
    }
  },
  routes: {
    exclude: ["createManyBase", "replaceOneBase"],
    deleteOneBase: {
      decorators: [
        GrantAccess({
          action: ECrudAction.DELETE
        })
      ]
    }
  }
})
@ApiTags("Destinations")
@Feature(ECrudFeature.DESTINATION)
@Controller("destinations")
export class DestinationController implements CrudController<Destination> {
  constructor(public service: DestinationService) {}

  get base(): CrudController<Destination> {
    return this;
  }

  @UseInterceptors(SqlInterceptor)
  @GrantAccess({
    action: ECrudAction.CREATE
  })
  @Override("createOneBase")
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Destination,
    @CurrentUser() user: User
  ): Promise<Destination> {
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
    @ParsedBody() dto: Destination,
    @CurrentUser() user: User
  ): Promise<Destination> {
    this.service.getUserId(dto, user);
    await this.service.mapRelationKeysToEntities(dto);
    return this.base.updateOneBase(req, dto);
  };

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

  @UseInterceptors(CrudRequestInterceptor)
  @Get("trashed")
  getDeleted(@ParsedRequest() req: CrudRequest) {
    return this.service.getDeleted(req);
  }

  @Override("deleteOneBase")
  @Delete(":id")
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
  ): Promise<Destination> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.EN);
  }

  @Get("vislug-:slug")
  getVnSlug(
    @Param("slug") slug: string
  ): Promise<Destination> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.VN);
  }
}
