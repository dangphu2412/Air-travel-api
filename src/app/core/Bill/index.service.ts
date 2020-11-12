import {
  Injectable, NotFoundException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BaseService} from "src/app/base/base.service";
import {DEFAULT_ERROR} from "src/common/constants";
import {CreateBilLDto} from "src/common/dto/Bill";
import {Bill, Customer, Role, User, BillService as BillServiceEntity} from "src/common/entity";
import {EPayment, ERole, ErrorCodeEnum} from "src/common/enums";
import {CustomerService} from "../Customer/index.service";
import {BillRepository} from "./index.repository";

@Injectable()
export class BillService extends TypeOrmCrudService<Bill> {
  constructor(
    @InjectRepository(Bill)
    private repository: BillRepository,
    private baseService: BaseService,
    private customerService: CustomerService
  ) {
    super(repository);
  }

  public fillBillServices(entity: Bill, billServices: BillServiceEntity[]) {
    entity.billServices = billServices;
  }

  public fillRemain(entity: Bill) {
    entity.customerRemain = entity.totalPrice;
    entity.providerRemain = entity.totalPrice - entity.totalNetPrice;
  }

  async getCustomer(id: number) {
    const customer = await this.customerService.findOne(id);

    if (!customer) throw new NotFoundException(DEFAULT_ERROR.NotFound, ErrorCodeEnum.NOT_FOUND);

    return customer;
  }

  public getRoleBill(): Promise<Role> {
    return Role.getRepository().findOne({
      where: {
        name: ERole.CUSTOMER
      }
    });
  }

  public getDeleted(req: CrudRequest) {
    return this.baseService.findManySoftDeleted<Bill>(
      this.repository,
      req
    );
  }

  public createEntity(dto: CreateBilLDto, user: User, customer: Customer) {
    return this.repository.create({
      status: dto.status,
      note: dto.note,
      user,
      customer,
      totalNetPrice: 0,
      totalPrice: 0,
      customerRemain: 0,
      providerRemain: 0
    })
  }

  public createBillServices(dto: CreateBilLDto, billEntity: Bill) {
    return Promise.all(dto.billServices.map(billService => {
      const entity = new BillServiceEntity();
      entity.netPrice = billService.netPrice;
      entity.quantity = billService.quantity;
      entity.price = billService.price;
      entity.netPrice = billService.netPrice;

      billEntity.totalPrice += billService.price;
      billEntity.totalNetPrice += billService.netPrice;

      return entity.save();
    }));
  }
}
