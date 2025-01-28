import { inject, injectable } from "inversify";
import { SendEmailDto, SendEmailResponseDto } from "./dto/mail.dto";
import { INotificationService } from "./interfaces/notification.service.interface";
import TYPES from "../../core/container/container.types";
import { IEmailService } from "../../core/delivery/email/email.interface";
import { INotificationRepository } from "./interfaces/notification.repository.interface";

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
}