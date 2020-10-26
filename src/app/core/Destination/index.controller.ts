import {ApiTags} from "@nestjs/swagger";
import {Controller, Patch, Param, ParseIntPipe, Get, UseInterceptors, Delete} from "@nestjs/common";
import {
  Crud, CrudController, Feature, Action,
  ParsedRequest, CrudRequest, CrudRequestInterceptor
} from "@nestjsx/crud";
import {Destination, User} from "src/common/entity";
import {DestinationService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {Lang} from "src/common/constants/lang";

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
    createOneBase: {
      decorators: [
        Action(ECrudAction.CREATE),
        GrantAccess()
      ]
    },
    updateOneBase: {
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
@ApiTags("Destinations")
@Feature(ECrudFeature.DESTINATION)
@Controller("destinations")
export class DestinationController implements CrudController<Destination> {
  constructor(public service: DestinationService) {}

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
  ): Promise<Destination> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.EN);
  }

  @Get("/viSlug-:slug")
  getVnSlug(
    @Param("slug") slug: string
  ): Promise<Destination> {
    return this.service.getBySlugWithMutilpleLanguagues(slug, Lang.VN);
  }
}
