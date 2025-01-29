import { NotificationStatus, NotificationType } from "../notification.model";

export interface NotificationDTO {
    id: string;
    sender: string;
    title: string;
    message: string;
    recipient: string | null;
    type: NotificationType;
    status: NotificationStatus;
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateNotificationDTO {
    sender: string;
    title: string;
    message: string;
    recipient: string | null;
    type: NotificationType;
    status: NotificationStatus;
    metadata?: Record<string, any>;
}

