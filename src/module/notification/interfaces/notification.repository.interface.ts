import {IMongoRepository} from "@hireverse/service-common/dist/repository"
import { INotification } from "../notification.model";

export interface INotificationRepository extends IMongoRepository<INotification>{
}
