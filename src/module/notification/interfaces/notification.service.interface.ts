import { SendEmailDto, SendEmailResponseDto } from "../dto/mail.dto";

export interface INotificationService {
    sendEmail(data: SendEmailDto): Promise<SendEmailResponseDto>;
}
