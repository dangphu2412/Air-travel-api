import {
  Injectable
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CrudRequest} from "@nestjsx/crud";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BaseService} from "src/app/base/base.service";
import {Bill, Customer, Role} from "src/common/entity";
import {ERole} from "src/common/enums";
import {BillRepository} from "./index.repository";

@Injectable()
export class BillService extends TypeOrmCrudService<Bill> {
  constructor(
    @InjectRepository(Bill)
    private repository: BillRepository,
    private baseService: BaseService,
  ) {
    super(repository);
  }

  public getRoleBill(): Promise<Role> {
    return Role.getRepository().findOne({
      where: {
        name: ERole.CUSTOMER
      }
    });
  }

  getUserId(dto: Bill, user: Customer) {
    return this.baseService.fillUserIdToDto(dto, user);
  }

  public getDeleted(req: CrudRequest) {
    return this.baseService.findManySoftDeleted<Bill>(
      this.repository,
      req
    );
  }
}
