import {
  ForbiddenException,
  Injectable, NotFoundException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BaseService} from "src/app/base/base.service";
import {BillError, CustomerError} from "src/common/constants";
import {CreateBilLDto} from "src/common/dto/Bill";
import {UpdateBillByUserDto} from "src/common/dto/Bill/updateBillByUser.dto";
import {CreateBillServiceDto} from "src/common/dto/BillService";
import {Bill, Customer, Role, User, BillService as BillServiceEntity} from "src/common/entity";
import {ERole, ErrorCodeEnum} from "src/common/enums";
import {filterIdToUpdate} from "src/utils";
import {EntityManager} from "typeorm";
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

  public fillRemain(entity: Bill) {
    entity.customerRemain = entity.totalPrice;
    entity.providerRemain = entity.totalPrice - entity.totalNetPrice;
  }

  async getCustomer(id: number) {
    const customer = await this.customerService.findOne(id);

    if (!customer) throw new NotFoundException(CustomerError.NotFound, ErrorCodeEnum.NOT_FOUND);

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

  public createBill(
    dto: CreateBilLDto,
    user: User | null,
    customer: Customer,
    transactionManager: EntityManager
  ): Promise<Bill> {
    const entity = this.repository.create({
      status: dto.status,
      note: dto.note,
      user,
      customer,
      totalNetPrice: 0,
      totalPrice: 0,
      customerRemain: 0,
      providerRemain: 0
    })
    return transactionManager.save(entity);
  }

  public createBillServices(
    billServices: CreateBillServiceDto[],
    billEntity: Bill,
    transactionManager: EntityManager
  ): Promise<BillServiceEntity[]> {
    return Promise.all(billServices.map(billService => {
      const entity = new BillServiceEntity();
      entity.netPrice = billService.netPrice;
      entity.quantity = billService.quantity;
      entity.price = billService.price;
      entity.netPrice = billService.netPrice;
      entity.bill = billEntity;
      entity.startDate = billService.startDate;
      entity.endDate = billService.endDate;

      billEntity.totalPrice += billService.price * billService.quantity;
      billEntity.totalNetPrice += billService.netPrice;

      return transactionManager.save(entity);
    }));
  }

  updateBillRemain(entity: Bill, transactionManager: EntityManager): Promise<Bill> {
    this.fillRemain(entity);
    return transactionManager.save(entity);
  }

  validateAuthor(bill: Bill, user: User): void {
    if (bill.userId !== user.id) {
      throw new ForbiddenException(
        ErrorCodeEnum.NOT_CHANGE_ANOTHER_AUTHORS_ITEM,
        BillError.ConfilictAuthor
      );
    }
  }

  public async updateRelation(
    bill: Bill,
    dto: UpdateBillByUserDto,
    transactionManager: EntityManager
  ) {
    const {existedRecords, newRecords} = filterIdToUpdate(dto.billServices);
    const newBilServices: BillServiceEntity[] = await this.createBillServices(
      newRecords, bill, transactionManager
    );

    bill.billServices = [...existedRecords, ...newBilServices];
  }

  updateBill(bill: Bill, dto: UpdateBillByUserDto) {
    Object.keys(dto).forEach(key => {
      if (bill[key] && bill[key] !== dto[key]) {
        bill[key] = dto[key];
      }
    });
  }
}
