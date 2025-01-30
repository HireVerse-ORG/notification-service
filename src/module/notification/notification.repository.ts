import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import  NotificationModel, { INotification } from "./notification.model";
import { INotificationRepository } from "./interfaces/notification.repository.interface";
import { InternalError } from "@hireverse/service-common/dist/app.errors";
import { RootFilterQuery } from "mongoose";

@injectable()
export class NotificationRepository extends MongoBaseRepository<INotification> implements INotificationRepository {
    constructor() {
        super(NotificationModel)
    }

    async CountDocument(filter?:RootFilterQuery<INotification>): Promise<number> {
        try {
            const count = await this.repository.countDocuments(filter);
            return count;
        } catch (error) {
            throw new InternalError("Failed to count documents")
        }
    }
    
    async updateMany(data: Partial<INotification>, filter?: RootFilterQuery<INotification>): Promise<boolean> {
        try {
            const updated = await this.repository.updateMany(filter, {$set: data});
            return updated.acknowledged
        } catch (error) {
            throw new InternalError("Failed to perform update many operation")
        }
    }
}