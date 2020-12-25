import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {messaging} from "firebase-admin";
import {NotificationContent} from "src/common/dto/Notify/notificationContent.dto";
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
    tokens.forEach(token => {
      this.firebaseService.messaging().sendToDevice(token, {
        notification
      }).then(val => {
        console.log("Send notify success" + val)
      });
    });
  }

  createNotifyOfCustomer(customerId: number, notification: messaging.NotificationMessagePayload) {
    return this.repository.create({
      body: notification.body,
      title: notification.title,
      customerId
    }).save();
  }

  async sendAllTestCustomers(body: NotificationContent) {
    const customers: Customer[] = await Customer.find();

    customers.forEach(customer => {
      return customer.notifyTokens.forEach(token => {
        if (token) {
          this.firebaseService.messaging().sendToDevice(token, {
            notification: {
              title: body.title,
              body: body.body
            }
          }).then(val => {
            console.log("Send notify success" + val)
          });
        }
      });
    });
  }
}
