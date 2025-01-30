import { inject, injectable } from "inversify";
import { SendEmailDto, SendEmailResponseDto } from "./dto/mail.dto";
import { INotificationService } from "./interfaces/notification.service.interface";
import TYPES from "../../core/container/container.types";
import { IEmailService } from "../../core/delivery/email/email.interface";
import { INotificationRepository } from "./interfaces/notification.repository.interface";
import { INotification, NotificationStatus, NotificationType } from "./notification.model";
import { CreateNotificationDTO, NotificationDTO } from "./dto/notification.dto";
import { IPaginationResponse } from "@hireverse/service-common/dist/repository";
import { FilterQuery, isValidObjectId } from "mongoose";
import { BadRequestError } from "@hireverse/service-common/dist/app.errors";

@injectable()
export class NotificationService implements INotificationService {
    @inject(TYPES.NotificationRepository) private notifyRepo!: INotificationRepository;
    @inject(TYPES.EmailService) private emailService!: IEmailService;

    async sendEmail(data: SendEmailDto): Promise<SendEmailResponseDto> {
        const {to, subject, text, html} = data;
        await this.emailService.sendEmail(to, subject, text, html)
        return {
            message: "Email Send",
            status: "SENT"
        }
    }

    async createNotification(data: CreateNotificationDTO): Promise<NotificationDTO> {
        const notification = await this.notifyRepo.create(data);
        return this.toDTO(notification);
    }

    async getMyNotifications(filter: {
            recipient: string,
            type?: NotificationType,
            status?: NotificationStatus,
        }, page: number, limit: number ): Promise<IPaginationResponse<NotificationDTO>> {
        const {recipient, type, status} = filter

        const query: FilterQuery<INotification> = { recipient };

        if (status) query.status = status;
        if (type) query.type = type;
        
        const notifications = await this.notifyRepo.paginate(query, page, limit, {sort: {createdAt: -1}});
        
        return {...notifications, data: notifications.data.map(this.toDTO)}
    }

    async getMyNotificationsCount(filter: { recipient: string; type?: NotificationType; status?: NotificationStatus; }): Promise<number> {
        const {recipient, type, status} = filter

        const query: FilterQuery<INotification> = { recipient };

        if (status) query.status = status;
        if (type) query.type = type;

        const count = await this.notifyRepo.CountDocument(query);
        return count;
    }

    async markNotificationRead(id: string): Promise<boolean> {
        if(!isValidObjectId(id)){
            throw new BadRequestError("Invalid notification id");
        }
        const updated = await this.notifyRepo.update(id, {status: NotificationStatus.READ});
        return updated ? true : false;
    }

    async markUserNotificationsRead(recipient: string): Promise<boolean> {
        const updated = await this.notifyRepo.updateMany({status: NotificationStatus.READ}, {recipient})
        return updated
    }

    private toDTO(data: INotification): NotificationDTO {
        return {
            id: data.id,
            sender: data.sender,
            recipient: data.recipient,
            message: data.message,
            status: data.status,
            title: data.title,
            type: data.type,
            metadata: data.metadata,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }
}