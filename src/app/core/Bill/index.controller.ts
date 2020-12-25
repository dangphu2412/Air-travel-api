import {ApiBody, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Param, ParseIntPipe, Post, UseInterceptors} from "@nestjs/common";
import {
  Crud, CrudController, Feature,
  ParsedRequest, CrudRequest, CrudRequestInterceptor, Override, ParsedBody
} from "@nestjsx/crud";
import {Bill, Customer, User, BillService as BillServiceEntity} from "src/common/entity";
import {BillService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature, ERole} from "src/common/enums";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";
import {CreateBillByUserDto} from "src/common/dto/Bill";
import {getManager} from "typeorm";
import {CreateBillByCustomerDto} from "src/common/dto/Bill/createBillByCustomer.dto";
import {UpdateBillByUserDto} from "src/common/dto/Bill/updateBillByUser.dto";

@Crud({
  model: {
    type: Bill
  },
  routes: {
    exclude: ["replaceOneBase"],
    // TODO: Remember to override to grant access to author only
    getManyBase: {
      decorators: [
        GrantAccess({
          jwtOnly: true
        })
      ]
    },
    getOneBase: {
      decorators: [
        GrantAccess({
          jwtOnly: true
        })
      ]
    }
  },
  query: {
    join: {
      billServices: {
        eager: true
      },
      "billServices.service": {
        allow: ["id", "viTitle", "enTitle"],
        eager: true
      },
      user: {
        allow: ["id", "fullName", "avatar"],
        eager: true
      },
      customer: {
        allow: ["id", "fullName", "avatar"],
        eager: true
      }
    }
  }
})
@ApiTags("Bills")
@Feature(ECrudFeature.BILL)
@Controller("bills")
export class BillController implements CrudController<Bill> {
  constructor(public service: BillService) {}

  get base(): CrudController<Bill> {
    return this;
  }

  @GrantAccess({
    action: ECrudAction.CREATE
  })
  @UseInterceptors(SqlInterceptor)
  @Override("createOneBase")
  createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateBillByUserDto,
    @CurrentUser() user: User
  ): Promise<Bill> {
    return getManager().transaction(async transactionManager => {
      const customer = await this.service.getCustomer(dto.customerId);
      const entity: Bill = await this.service.createBill(dto, user, customer, transactionManager);

      const billServices: BillServiceEntity[] = await this.service.createBillServices(
        dto.billServices, entity, transactionManager
      );

      entity.billServices = billServices;

      this.service.calcTotalThenMapToEntity(entity, entity.billServices);

      await this.service.updateBillRemain(entity, transactionManager);
      return entity;
    })
  };

  @GrantAccess({
    jwtOnly: true,
    type: "CUSTOMER"
  })
  @UseInterceptors(SqlInterceptor)
  @Post("customers")
  @ApiOperation({
    summary: "Create bill by customer"
  })
  @ApiBody({type: () => CreateBillByCustomerDto})
  createBillByCustomer(
    @Body() dto: CreateBillByCustomerDto,
    @CurrentUser() customer: Customer
  ): Promise<Bill> {
    return getManager().transaction(async transactionManager => {
      const entity: Bill = await this.service.createBill(dto, null, customer, transactionManager);

      const billServices: BillServiceEntity[] = await this.service.createBillServices(
        dto.billServices, entity, transactionManager
      );
      entity.billServices = billServices;
      this.service.calcTotalThenMapToEntity(entity, entity.billServices);

      return this.service.updateBillRemain(entity, transactionManager);
    })
  };

  @GrantAccess({
    action: ECrudAction.UPDATE
  })
  @UseInterceptors(SqlInterceptor)
  @Override("updateOneBase")
  updateOneOverride(
    @ParsedBody() dto: UpdateBillByUserDto,
    @CurrentUser() user: User
  ): Promise<Bill> {
    return getManager().transaction(async transactionManager => {
      const bill = await this.service.findOne(dto.id, {
        relations: ["billServices", "user", "customer"]
      });

      if (user.role.name !== ERole.ADMIN) {
        this.service.validateAuthor(bill, user);
      }

      await this.service.updateRelation(bill, dto, transactionManager);

      this.service.updateBill(bill, dto);

      return transactionManager.save(bill);
    });
  }


  @UseInterceptors(CrudRequestInterceptor)
  @Get("trashed")
  @GrantAccess({
    action: ECrudAction.READ,
    type: "CUSTOMER"
  })
  getDeleted(@ParsedRequest() req: CrudRequest) {
    return this.service.getDeleted(req);
  }

  @Override("deleteOneBase")
  @GrantAccess({
    action: ECrudAction.SOFT_DEL
  })
  async softDelete(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.service.softDelete(id, user);
  }
}
