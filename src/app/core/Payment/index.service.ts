import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BaseService} from "src/app/base/base.service";
import {BillError, BillInfoError, CustomerError} from "src/common/constants";
import {CreatePaymentDto} from "src/common/dto/Payment";
import {Bill, BillInfo, Payment, User} from "src/common/entity";
import {BillStatus, EPayment, ErrorCodeEnum} from "src/common/enums";
import {BillService} from "../Bill/index.service";
import {BillInfoService} from "../BillInfo/index.service";
import {NotificationService} from "../Notification/index.service";
import {PaymentRepository} from "./index.repository";

@Injectable()
export class PaymentService extends TypeOrmCrudService<Payment> {
  constructor(
    @InjectRepository(Payment)
    private repository: PaymentRepository,
    private baseService: BaseService,
    private billService: BillService,
    private billInfoService: BillInfoService,
    private notifyService: NotificationService
  ) {
    super(repository);
  }

  public getUserId(dto: Payment, user: User): void {
    return this.baseService.fillUserIdToDto(dto, user);
  }

  public createEntity(dto: CreatePaymentDto): Payment {
    return this.repository.create({
      amount: dto.amount,
      description: dto.description,
      type: dto.type
    });
  }

  public async mapRelationKeysToEntities(entity: Payment, dto: CreatePaymentDto): Promise<void> {
    const bill: Bill = await this.billService.findOne(dto.billId, {
      relations: ["customer"]
    });
    const billInfo: BillInfo = await this.billInfoService.findOne(dto.billInfoId);

    if (!bill) throw new NotFoundException(BillError.NotFound, ErrorCodeEnum.NOT_FOUND);

    if (!billInfo) throw new NotFoundException(BillInfoError.NotFound, ErrorCodeEnum.NOT_FOUND);

    entity.bill = bill;
    entity.billInfo = billInfo;
  }

  public async syncRemainToBill(entity: Payment): Promise<void | Notification> {
    const type: EPayment = entity.type;

    switch (type) {
      case EPayment.PAY_OUT:
        if (entity.amount > entity.bill.providerRemain) {
          throw new ConflictException(
            BillError.ConflictRemainGreaterThan,
            ErrorCodeEnum.CONFLICT
          )
        }
        entity.bill.providerRemain -= entity.amount;
        if (entity.bill.providerRemain === 0) {
          entity.bill.status = BillStatus.CUSTOMER_PAID
        }
        break;
      case EPayment.GET_IN:
      default:
        if (entity.amount > entity.bill.customerRemain) {
          throw new ConflictException(
            BillError.ConflictRemainGreaterThan,
            ErrorCodeEnum.CONFLICT
          )
        }
        entity.bill.customerRemain -= entity.amount;
        if (entity.bill.customerRemain === 0) {
          entity.bill.status = BillStatus.PROVIDER_PAID;

          if (
            entity.bill.customer.notifyTokens === null &&
            entity.bill.customer.notifyTokens.length === 0
          ) {
            throw new ConflictException(
              ErrorCodeEnum.NULL_TOKEN,
              CustomerError.ConflictEmptyToken
            )
          }
          const billId = entity.bill.id;
          const notification = {
            title: "Bill paid",
            body: `Your bill ${billId} has successfully paid`
          }
          this.notifyService.notifyCustomerBillFinished(entity.bill.customer, notification);
          await this.notifyService.createNotifyOfCustomer(billId, notification)
        }
        break;
    }
  }

  public validateCompleteBillAndSync(entity: Payment): void {
    const {customerRemain, providerRemain} = entity.bill;
    if (customerRemain === 0 && providerRemain === 0) {
      entity.bill.status = BillStatus.COMPLETED
    }
  }

  public syncBillToDatabase(bill: Bill): Promise<Bill> {
    return bill.save();
  }
}
