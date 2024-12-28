import { Container } from "inversify";
import { IEmailService } from "../delivery/email/email.interface";
import TYPES from "./container.types";
import { EmailService } from "../delivery/email";
import { INotificationService } from "../../module/notification/interfaces/notification.service.interface";
import { NotificationService } from "../../module/notification/notifications.service";
import { NotificationController } from "../../module/notification/notification.controller";

const container = new Container();

container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
container.bind<INotificationService>(TYPES.NotificationService).to(NotificationService);
container.bind<NotificationController>(TYPES.NotificationController).to(NotificationController);

export default container;