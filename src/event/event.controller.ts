import { inject, injectable } from "inversify";
import TYPES from "../core/container/container.types";
import { KafkaConsumer } from "@hireverse/kafka-communication/dist/kafka";
import { logger } from "../core/utils/logger";
import { ISocketService } from "../socket/interface/socket.service.interface";
import { KafkaTopics } from "@hireverse/kafka-communication/dist/events/topics";
import { JobApplicationViewUpdatedMessage, JobAppliedMessage, JobJobPostAcceptedMessage } from "@hireverse/kafka-communication/dist/events";
import { ISocketManager } from "../socket/interface/socket.manager.interface";

@injectable()
export class EventController {
    @inject(TYPES.KafkaConsumer) private consumer!: KafkaConsumer;
    @inject(TYPES.SocketService) private socket!: ISocketService;
    @inject(TYPES.SocketManager) private socketManager!: ISocketManager;

    async initializeSubscriptions() {
        await this.consumer.subscribeToTopics([
            { topic: KafkaTopics.JOB_APPLICATION_ACCEPTED, handler: this.jobApplicationAccepted },
            { topic: KafkaTopics.JOB_POST_ACCEPTED, handler: this.jobPostAcceptedHandler},
            { topic: KafkaTopics.JOB_APPLICATION_VIEW_UPDATED, handler: this.jobApplicationViewUpdated},
        ])
    }

    private jobApplicationViewUpdated = async (message: JobApplicationViewUpdatedMessage) => {
        const { viewer_user_id } = message;
        try {
            const userSocket = await this.socketManager.getSocketId(viewer_user_id);
            if(userSocket){
                this.socket.emit('job-application-view-usage-updated', { message: "Job application view usage updated", ...message }, userSocket);
            }
        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.JOB_APPLICATION_VIEWED}`);
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
            logger.error(`Failed to process message from ${KafkaTopics.JOB_APPLICATION_VIEWED}`);
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