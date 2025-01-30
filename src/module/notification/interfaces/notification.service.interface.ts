import { IPaginationResponse } from "@hireverse/service-common/dist/repository";
import { SendEmailDto, SendEmailResponseDto } from "../dto/mail.dto";
import { CreateNotificationDTO, NotificationDTO } from "../dto/notification.dto";
import { NotificationStatus, NotificationType } from "../notification.model";

export interface INotificationService {
    sendEmail(data: SendEmailDto): Promise<SendEmailResponseDto>;
    createNotification(data: CreateNotificationDTO): Promise<NotificationDTO>;
    getMyNotifications(filter: {
        recipient: string,
        type?: NotificationType,
        status?: NotificationStatus,
    }, page: number, limit: number): Promise<IPaginationResponse<NotificationDTO>>;
    getMyNotificationsCount(filter: {
        recipient: string,
        type?: NotificationType,
        status?: NotificationStatus,
    }): Promise<number>;

    markNotificationRead(id: string): Promise<boolean>;
    markUserNotificationsRead(recipient: string): Promise<boolean>;
}
