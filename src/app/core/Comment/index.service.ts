import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm/lib/typeorm-crud.service";
import {BaseService} from "src/app/base/base.service";
import {Comment, Customer} from "src/common/entity";
import {CommentRepository} from "./index.repository";

@Injectable()
export class CommentService extends TypeOrmCrudService<Comment> {
  constructor(
    @InjectRepository(Comment)
    private repository: CommentRepository,
    private baseService: BaseService
  ) {
    super(repository);
  }

  validateAuthor(customer: Customer) {

  }
}
