import { Application } from "express";
import { errorHandler, notFoundHandler } from "./errorHandler";
import { notificationRoutes } from "../../module/notification/notification.routes";

export function registerRoutes(app: Application, prefix = "/api/notifications") {
    app.get(`${prefix}/health`, (req, res) => {
        res.json("Notification Server is healthy 🚀")
    })
    app.use(`${prefix}`, notificationRoutes);
    app.use(notFoundHandler);
    app.use(errorHandler);
}