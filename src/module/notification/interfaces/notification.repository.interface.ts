import {IMongoRepository} from "@hireverse/service-common/dist/repository"
import { INotification } from "../notification.model";
import { RootFilterQuery } from "mongoose";

export interface INotificationRepository extends IMongoRepository<INotification>{
    CountDocument(filter?:RootFilterQuery<INotification>): Promise<number>;
    updateMany(data: Partial<INotification>, filter?: RootFilterQuery<INotification>): Promise<boolean>;
}
