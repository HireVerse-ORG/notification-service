import { Router } from "express";
import container from "../../core/container";
import TYPES from "../../core/container/container.types";

import {isAuthenticated} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { NotificationController } from "./controllers/notification.controller";

const controller = container.get<NotificationController>(TYPES.NotificationController);

// base: /api/notifications
const router = Router();

router.get('/', isAuthenticated, controller.getMyNotifications);
router.get('/count', isAuthenticated, controller.getNotificationCount);
router.put('/mark-read/all', isAuthenticated, controller.markAllRead);
router.put('/mark-read/:id', isAuthenticated, controller.markRead);

export const notificationRoutes = router;