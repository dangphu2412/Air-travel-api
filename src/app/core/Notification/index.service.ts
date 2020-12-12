import {Injectable} from "@nestjs/common";
import {Customer} from "src/common/entity";
import {FirebaseService} from "../../../global/firebase";

@Injectable()
export class NotificationService {
  private firebaseService: typeof FirebaseService

  constructor() {
    this.firebaseService = FirebaseService
  }

  notifyCustomerBillFinished(customer: Customer, id: number) {
    const token = customer.notifyToken;
    return this.firebaseService.messaging().sendToDevice(token, {
      notification: {
        title: "Bill paid",
        body: `Your bill ${id} has successfully paid`
      }
    });
  }
}
