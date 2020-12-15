import {Repository, EntityRepository} from "typeorm";
import {Comment} from "src/common/entity";

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
}
