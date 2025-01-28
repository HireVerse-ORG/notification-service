import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import  NotificationModel, { INotification } from "./notification.model";
import { INotificationRepository } from "./interfaces/notification.repository.interface";

@injectable()
export class NotificationRepository extends MongoBaseRepository<INotification> implements INotificationRepository {
    constructor() {
        super(NotificationModel)
    }
}