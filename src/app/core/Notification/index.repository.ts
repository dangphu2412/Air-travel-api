import {Repository, EntityRepository} from "typeorm";
import {Notification} from "src/common/entity";

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
}
