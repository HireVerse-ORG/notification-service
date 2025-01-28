import { Router } from "express";
import container from "../../core/container";
import TYPES from "../../core/container/container.types";

import {allowedRoles} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { NotificationController } from "./controllers/notification.controller";

const controller = container.get<NotificationController>(TYPES.NotificationController);

// base: /api/profile/company
const router = Router();



export const notificationRoutes = router;