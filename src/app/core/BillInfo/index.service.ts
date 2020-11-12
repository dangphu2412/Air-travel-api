import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BillInfo} from "src/common/entity";
import { ErrorCodeEnum } from "src/common/enums";
import { EBillInfoType } from "src/common/enums/billInfoType.enum";
import { CustomerService } from "../Customer/index.service";
import { ProviderService } from "../Provider/index.service";
import {BillInfoRepository} from "./index.repository";

@Injectable()
export class BillInfoService extends TypeOrmCrudService<BillInfo> {
  constructor(
    @InjectRepository(BillInfo)
    private repository: BillInfoRepository,
    private customerService: CustomerService,
    private providerService: ProviderService
  ) {
    super(repository);
  }

  public async mapRelationKeysToEntities(dto: BillInfo, type: EBillInfoType): Promise<void> {
    switch (type) {
      case EBillInfoType.PROVIDER:
        const provider = await this.providerService.findOne(dto.providerId);
        if (!provider) throw new NotFoundException("Not found provider please check again", ErrorCodeEnum.NOT_FOUND)
        dto.provider = provider;
        break;
      case EBillInfoType.CUSTOMER:
      default:
        const customer = await this.customerService.findOne(dto.customerId);
        if (!customer) throw new NotFoundException("Not found customer please check again", ErrorCodeEnum.NOT_FOUND)
        dto.customer = customer;
        break;
    }
  }
}
