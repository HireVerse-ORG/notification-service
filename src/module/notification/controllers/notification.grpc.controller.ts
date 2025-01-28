import { inject, injectable } from "inversify";
import TYPES from "../../../core/container/container.types";
import { INotificationService } from "../interfaces/notification.service.interface";
import { grpcWrapper } from "../../../core/utils/grpcWrapper";

@injectable()
export class NotificationGrpcController {
    @inject(TYPES.NotificationService) private notificationService!: INotificationService;

    public getProcedures() {
        return {
            SendMail: this.sendMail.bind(this),
        }
    }

    private sendMail = grpcWrapper(async (call: any, callback: any) => {        
        await this.notificationService.sendEmail(call.request);
        callback(null, {success: true, message: 'Mail Send'})
    })
}