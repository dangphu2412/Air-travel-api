import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {messaging} from "firebase-admin";
import {Customer, Notification} from "src/common/entity";
import {FirebaseService} from "../../../global/firebase";
import {NotificationRepository} from "./index.repository";

@Injectable()
export class NotificationService {
  private firebaseService: typeof FirebaseService

  constructor(
    @InjectRepository(Notification)
    private repository: NotificationRepository,

  ) {
    this.repository = repository;
    this.firebaseService = FirebaseService;
  }

  notifyCustomerBillFinished(
    customer: Customer,
    notification: messaging.NotificationMessagePayload
  ) {
    const tokens = customer.notifyTokens ?? [];
    return Promise.all(tokens.map(token => {
      return this.firebaseService.messaging().sendToDevice(token, {
        notification
      });
    }));
  }

  createNotifyOfCustomer(customerId: number, notification: messaging.NotificationMessagePayload) {
    return this.repository.create({
      body: notification.body,
      title: notification.title,
      customerId
    }).save();
  }
}
