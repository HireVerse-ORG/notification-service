import { SendEmailDto, SendEmailResponseDto } from "../dto/mail.dto";
import { CreateNotificationDTO, NotificationDTO } from "../dto/notification.dto";

export interface INotificationService {
    sendEmail(data: SendEmailDto): Promise<SendEmailResponseDto>;
    createNotification(data: CreateNotificationDTO): Promise<NotificationDTO>;
}
