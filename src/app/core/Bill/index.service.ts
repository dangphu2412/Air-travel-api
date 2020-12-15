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
import {UserService} from "../User/index.service";
import {BillRepository} from "./index.repository";

@Injectable()
export class BillService extends TypeOrmCrudService<Bill> {
  constructor(
    @InjectRepository(Bill)
    private repository: BillRepository,
    private baseService: BaseService,
    private customerService: CustomerService,
    private userService: UserService
  ) {
    super(repository);
  }

  validateAuthor(bill: Bill, user: User): void {
    if (bill.userId !== user.id) {
      throw new ForbiddenException(
        ErrorCodeEnum.NOT_CHANGE_ANOTHER_AUTHORS_ITEM,
        BillError.ConfilictAuthor
      );
    }
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
    return Promise.all(billServices.map(async billService => {
      const entity = new BillServiceEntity();
      entity.netPrice = billService.netPrice;
      entity.quantity = billService.quantity;
      entity.price = billService.price;
      entity.netPrice = billService.netPrice;
      entity.billId = billEntity.id;
      entity.startDate = billService.startDate;
      entity.endDate = billService.endDate;
      entity.serviceId = billService.serviceId;

      return transactionManager.save(entity);
    }));
  }

  public updateExistedBillServices(
    billServices: BillServiceEntity[],
    billEntity: Bill,
    transactionManager: EntityManager
  ) {
    const updateRecords = [];
    billServices.forEach(billService => {
      let flag = false;
      const index = billEntity
        .billServices
        .findIndex(item => item.id === billService.id);

      Object.keys(billService).forEach(key => {
        if (
          billService[key] &&
          billService[key] !== billEntity.billServices[index][key]
        ) {
          billEntity.billServices[index][key] = billService[key];
          flag = true;
        }
      });

      if (flag) updateRecords.push(
        transactionManager.save(billEntity.billServices[index])
      );

      return Promise.all(updateRecords);
    })
  }

  updateBillRemain(entity: Bill, transactionManager: EntityManager): Promise<Bill> {
    this.fillRemain(entity);
    return transactionManager.save(entity);
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

    await this.updateExistedBillServices(existedRecords, bill, transactionManager);

    this.calcTotalThenMapToEntity(bill, newBilServices);

    bill.billServices = [...existedRecords, ...newBilServices];
  }

  updateBill(bill: Bill, dto: UpdateBillByUserDto) {
    Object.keys(dto).forEach(key => {
      if (bill[key] && bill[key] !== dto[key]) {
        console.log(key)
        bill[key] = dto[key];
      }
    });
  }

  calcTotalThenMapToEntity(entity: Bill, billServices: BillServiceEntity[]): void {
    billServices.forEach(item => {
      entity.totalPrice += item.price * item.quantity;
      entity.totalNetPrice += item.netPrice;
    })
  }

  public async softDelete(id: number, currentUser: User) {
    const record = await this
      .baseService
      .findWithRelationUser(this.repository, id);
    const {user} = record;

    // User may null when bill was not accepted
    if (!user) {
      this.baseService.isNotAdminAndThrowErr(
        currentUser
      );
    } else {
      this.baseService.isNotAdminAndAuthorAndThrowErr(
        this.userService,
        user, currentUser
      );
    }

    return this.repository.softDelete(record.id);
  }
}
