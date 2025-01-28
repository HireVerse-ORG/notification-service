import { Container } from "inversify";
import { INotificationService } from "./interfaces/notification.service.interface";
import { NotificationService } from "./notifications.service";
import TYPES from "../../core/container/container.types";
import { NotificationGrpcController } from "./controllers/notification.grpc.controller";
import { INotificationRepository } from "./interfaces/notification.repository.interface";
import { NotificationRepository } from "./notification.repository";
import { NotificationController } from "./controllers/notification.controller";

export const loadNotificationContainer = (container: Container) => {
    container.bind<NotificationController>(TYPES.NotificationController).to(NotificationController);
    container.bind<NotificationGrpcController>(TYPES.NotificationGrpcController).to(NotificationGrpcController);
    container.bind<INotificationService>(TYPES.NotificationService).to(NotificationService);
    container.bind<INotificationRepository>(TYPES.NotificationRepository).to(NotificationRepository);
}