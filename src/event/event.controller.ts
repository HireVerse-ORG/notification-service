import { inject, injectable } from "inversify";
import TYPES from "../core/container/container.types";
import { KafkaConsumer } from "@hireverse/kafka-communication/dist/kafka";
import { logger } from "../core/utils/logger";
import { ISocketService } from "../socket/interface/socket.service.interface";
import { KafkaTopics } from "@hireverse/kafka-communication/dist/events/topics";
import { JobApplicationViewUpdatedMessage, JobAppliedMessage, JobJobPostAcceptedMessage, ResumeCommentMessage } from "@hireverse/kafka-communication/dist/events";
import { ISocketManager } from "../socket/interface/socket.manager.interface";
import { INotificationService } from "../module/notification/interfaces/notification.service.interface";
import { NotificationStatus, NotificationType } from "../module/notification/notification.model";

@injectable()
export class EventController {
    @inject(TYPES.KafkaConsumer) private consumer!: KafkaConsumer;
    @inject(TYPES.SocketService) private socket!: ISocketService;
    @inject(TYPES.SocketManager) private socketManager!: ISocketManager;
    @inject(TYPES.NotificationService) private notificationService!: INotificationService;

    async initializeSubscriptions() {
        await this.consumer.subscribeToTopics([
            { topic: KafkaTopics.JOB_APPLICATION_ACCEPTED, handler: this.jobApplicationAccepted },
            { topic: KafkaTopics.JOB_POST_ACCEPTED, handler: this.jobPostAcceptedHandler},
            { topic: KafkaTopics.JOB_APPLICATION_VIEW_UPDATED, handler: this.jobApplicationViewUpdated},
            { topic: KafkaTopics.RESUME_COMMENTED, handler: this.resumeCommentHandler},
        ])
    }

    private resumeCommentHandler = async (message: ResumeCommentMessage) => {
        const { applicant_user_id, comment, title: job_title, commenter_user_id, job_application_id } = message;
        try {
            const userSocket = await this.socketManager.getSocketId(applicant_user_id);
            
            if (userSocket) {
                this.socket.emit('new-notification',{ message: "A recruiter has commented on your job application."}, userSocket);
            }
    
            await this.notificationService.createNotification({
                sender: commenter_user_id,
                recipient: applicant_user_id,
                title: "New comment on your resume",
                message: `A recruiter has commented on your job application: ${job_title}`,
                metadata: {
                    job_application_id,
                    job_title,
                    comment,
                    type: "resume-comment" 
                },
                type: NotificationType.IN_APP,
            });
        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.RESUME_COMMENTED}`);
        }
    }


    private jobApplicationViewUpdated = async (message: JobApplicationViewUpdatedMessage) => {
        const { viewer_user_id } = message;
        try {
            const userSocket = await this.socketManager.getSocketId(viewer_user_id);
            if(userSocket){
                this.socket.emit('job-application-view-usage-updated', { message: "Job application view usage updated", ...message }, userSocket);
            }
        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.JOB_APPLICATION_VIEW_UPDATED}`);
        }
    }

    private jobApplicationAccepted = async (message: JobAppliedMessage) => {
        const { user_id } = message;
        try {
            const userSocket = await this.socketManager.getSocketId(user_id);
            if(userSocket){
                this.socket.emit('job-applied', { message: "Job applied", ...message }, userSocket);
            }
        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.JOB_APPLICATION_ACCEPTED}`);
        }
    }

    private jobPostAcceptedHandler = async (message: JobJobPostAcceptedMessage) => {
        const {user_id} = message
        try {
            const userSocket = await this.socketManager.getSocketId(user_id);
            if(userSocket){
                this.socket.emit('job-posted', { message: "Job Posted", ...message }, userSocket);
            }
        } catch (error) {
            logger.error("Failed to update job accepted status")
        }
    }
}