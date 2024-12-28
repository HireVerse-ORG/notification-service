
import { loadProto } from '@hireverse/service-protos';
import { NotificationController } from './notification.controller';
import TYPES from '../../core/container/container.types';
import container from '../../core/container';

const proto = loadProto('notification/notification.proto');

const notificationController = container.get<NotificationController>(TYPES.NotificationController)

export const notificationService = {
    name: "Notification Service",
    serviceDefinition: proto.notification.NotificationService.service,
    implementation: notificationController.getProcedures(),
}
