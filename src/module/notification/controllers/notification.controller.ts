import { inject, injectable } from "inversify";
import TYPES from "../../../core/container/container.types";
import { INotificationService } from "../interfaces/notification.service.interface";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from '@hireverse/service-common/dist/token/user/userRequest';


@injectable()
export class NotificationController {
    @inject(TYPES.NotificationService) private notificationService!: INotificationService;

    /**
     * @route PUT /api/profile/company
     * @scope Company
    **/
    public updateProfile = asyncWrapper(async (req: AuthRequest, res: Response) => {
        
    });
}