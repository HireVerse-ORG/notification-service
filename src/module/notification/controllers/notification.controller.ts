import { inject, injectable } from "inversify";
import TYPES from "../../../core/container/container.types";
import { INotificationService } from "../interfaces/notification.service.interface";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from '@hireverse/service-common/dist/token/user/userRequest';
import { Response } from "express";
import { NotificationStatus, NotificationType } from "../notification.model";


@injectable()
export class NotificationController {
    @inject(TYPES.NotificationService) private notificationService!: INotificationService;

    /**
     * @route GET /api/notifications?page=''&limit=''&status=''&type='
     * @scope Private
    **/
    public getMyNotifications = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId!;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as NotificationStatus;
        const type = req.query.type as NotificationType;

        const notifications = await this.notificationService.getMyNotifications({recipient: userId, status, type}, page, limit);
        return res.json(notifications)
    });
    
    /**
     * @route GET /api/notifications/count?status=''&type='
     * @scope Private
    **/
    public getNotificationCount = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId!;
        const status = req.query.status as NotificationStatus;
        const type = req.query.type as NotificationType;
        const count = await this.notificationService.getMyNotificationsCount({recipient: userId, status, type});
        return res.json({count})
    });

    /**
     * @route PUT /api/notifications/mark-read/:id
     * @scope Private
    **/
    public markRead = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const id = req.params.id;
        const updated = await this.notificationService.markNotificationRead(id);
        if(!updated){
            return res.status(400).json({message: "Failed to update notification"})
        }
        res.sendStatus(200);
    });
    /**
     * @route PUT /api/notifications/mark-read/all
     * @scope Private
    **/
    public markAllRead = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId!;
        const updated = await this.notificationService.markUserNotificationsRead(userId);
        if(!updated){
            return res.status(400).json({message: "Failed to update notifications"})
        }
        res.sendStatus(200);
    });
}