import {ApiTags} from "@nestjs/swagger";
import {Controller, Patch, Param, ParseIntPipe, Get, UseInterceptors, Delete} from "@nestjs/common";
import {
  Crud, CrudController, Feature, Action,
  ParsedRequest, CrudRequest, CrudRequestInterceptor, Override, ParsedBody
} from "@nestjsx/crud";
import {Destination} from "src/common/entity";
import {DestinationService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {Lang} from "src/common/constants/lang";
import {TJwtPayload} from "src/common/type";
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
        Action(ECrudAction.DELETE),
        GrantAccess()
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
  @Action(ECrudAction.CREATE)
  @GrantAccess()
  @Override("createOneBase")
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Destination,
    @CurrentUser() user: TJwtPayload
  ): Promise<Destination> {
    this.service.getUserId(dto, user);
    await this.service.authAdmin(dto, user);
    await this.service.mapRelationKeysToEntities(dto);
    return this.base.createOneBase(req, dto);
  };

  @UseInterceptors(SqlInterceptor)
  @Action(ECrudAction.UPDATE)
  @GrantAccess()
  @Override("updateOneBase")
  async updateOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Destination,
    @CurrentUser() user: TJwtPayload
  ): Promise<Destination> {
    this.service.getUserId(dto, user);
    await this.service.authAdmin(dto, user);
    await this.service.mapRelationKeysToEntities(dto);
    return this.base.updateOneBase(req, dto);
  };

  @Patch(":id/restore")
  @Action(ECrudAction.RESTORE)
  @GrantAccess()
  restoreDestination(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: TJwtPayload
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
    @CurrentUser() currentUser: TJwtPayload
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
