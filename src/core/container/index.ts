import { Container } from "inversify";
import { IEmailService } from "../delivery/email/email.interface";
import TYPES from "./container.types";
import { EmailService } from "../delivery/email";
import { loadNotificationContainer } from "../../module/notification/notification.module";
import { loadEventContainer } from "../../event/event.container";
import { loadSocketContainer } from "../../socket/socket.container";

const container = new Container();

container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
loadNotificationContainer(container);
loadSocketContainer(container);
loadEventContainer(container);
export default container;