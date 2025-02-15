import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { KafkaConsumer } from "@hireverse/kafka-communication/dist/kafka";
import { logger } from "../../core/utils/logger";
import moment from 'moment';

import { ISocketService } from "../socket/interface/socket.service.interface";
import { KafkaTopics } from "@hireverse/kafka-communication/dist/events/topics";
import {
    JobApplicationViewUpdatedMessage, JobAppliedMessage,
    JobJobPostAcceptedMessage, ResumeCommentMessage, FollowRequestedMessage,
    InterviewScheduledMessage, InterviewScheduleAcceptedMessage, InterviewScheduleRejectedMessage,
    JobOfferedMessage, JobOfferAcceptedMessage, JobOfferRejectedMessage
} from "@hireverse/kafka-communication/dist/events";
import { ISocketManager } from "../socket/interface/socket.manager.interface";
import { INotificationService } from "../notification/interfaces/notification.service.interface";
import { NotificationType } from "../notification/notification.model";

@injectable()
export class EventController {
    @inject(TYPES.KafkaConsumer) private consumer!: KafkaConsumer;
    @inject(TYPES.SocketService) private socket!: ISocketService;
    @inject(TYPES.SocketManager) private socketManager!: ISocketManager;
    @inject(TYPES.NotificationService) private notificationService!: INotificationService;

    async initializeSubscriptions() {
        await this.consumer.subscribeToTopics([
            { topic: KafkaTopics.JOB_APPLICATION_ACCEPTED, handler: this.jobApplicationAccepted },
            { topic: KafkaTopics.JOB_POST_ACCEPTED, handler: this.jobPostAcceptedHandler },
            { topic: KafkaTopics.JOB_APPLICATION_VIEW_UPDATED, handler: this.jobApplicationViewUpdated },
            { topic: KafkaTopics.RESUME_COMMENTED, handler: this.resumeCommentHandler },
            { topic: KafkaTopics.FOLLOW_REQUESTED, handler: this.followRequestHandler },
            { topic: KafkaTopics.INTERVIEW_SCHEDULED, handler: this.interviewScheduledHandler },
            { topic: KafkaTopics.INTERVIEW_SCHEDULE_ACCEPTED, handler: this.interviewScheduleAcceptedHandler },
            { topic: KafkaTopics.INTERVIEW_SCHEDULE_REJECTED, handler: this.interviewScheduleRejectedHandler },
            { topic: KafkaTopics.JOB_OFFERED, handler: this.jobOfferedHandler },
            { topic: KafkaTopics.JOB_OFFER_ACCEPTED, handler: this.jobOfferAcceptedHandler },
            { topic: KafkaTopics.JOB_OFFER_REJECTED, handler: this.jobOfferRejectedHandler },
        ])
    }

    private jobOfferedHandler = async (message: JobOfferedMessage) => {
        const { applicantId, compnayId, timestamp } = message;

        try {
            const userSocket = await this.socketManager.getSocketId(applicantId);

            const title = "Job Offer Received";
            const notificationMessage = "Congratulations! You have received a job offer from the company. Please review your offer letter and next steps in your dashboard.";

            if (userSocket) {
                this.socket.emit(
                    'new-notification',
                    { message: notificationMessage },
                    userSocket
                );
            }

            await this.notificationService.createNotification({
                sender: compnayId,
                recipient: applicantId,
                title,
                message: notificationMessage,
                metadata: {
                    ...message,
                    type: "job-offered",
                },
                type: NotificationType.IN_APP,
                createdAt: timestamp
            });

        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.JOB_OFFERED}`);
        }
    };

    private jobOfferAcceptedHandler = async (message: JobOfferAcceptedMessage) => {
        const { applicantId, compnayId, timestamp } = message;

        try {
            const userSocket = await this.socketManager.getSocketId(applicantId);

            const title = "Candidate Accepted Offer";
            const notificationMessage = "Candidate has accepted your job offer.";

            if (userSocket) {
                this.socket.emit(
                    'new-notification',
                    { message: notificationMessage },
                    userSocket
                );
            }

            await this.notificationService.createNotification({
                sender: compnayId,
                recipient: applicantId,
                title,
                message: notificationMessage,
                metadata: {
                    ...message,
                    type: "job-offer-accepted",
                },
                type: NotificationType.IN_APP,
                createdAt: timestamp
            });

        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.JOB_OFFER_ACCEPTED}`);
        }
    };

    private jobOfferRejectedHandler = async (message: JobOfferRejectedMessage) => {
        const { applicantId, compnayId, timestamp } = message;

        try {
            const userSocket = await this.socketManager.getSocketId(applicantId);

            const title = "Candidate Declined Offer";
            const notificationMessage = "Candidate has declined your job offer.";

            if (userSocket) {
                this.socket.emit(
                    'new-notification',
                    { message: notificationMessage },
                    userSocket
                );
            }

            await this.notificationService.createNotification({
                sender: compnayId,
                recipient: applicantId,
                title,
                message: notificationMessage,
                metadata: {
                    ...message,
                    type: "job-offer-declined",
                },
                type: NotificationType.IN_APP,
                createdAt: timestamp
            });

        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.JOB_OFFER_REJECTED}`);
        }
    };

    private interviewScheduledHandler = async (message: InterviewScheduledMessage) => {
        const { applicantId, interviewerId, scheduledTime, timestamp } = message;

        const formattedTime = moment(scheduledTime).format('MMMM Do YYYY, h:mm a');

        try {
            const userSocket = await this.socketManager.getSocketId(applicantId);

            if (userSocket) {
                this.socket.emit(
                    'new-notification',
                    { message: `You have received an interview request for ${formattedTime}. Please accept or reject.` },
                    userSocket
                );
            }

            await this.notificationService.createNotification({
                sender: interviewerId,
                recipient: applicantId,
                title: "Interview Scheduled",
                message: `Your interview is scheduled for ${formattedTime}. Please respond to the request.`,
                metadata: {
                    ...message,
                    type: "interview-schedule",
                },
                type: NotificationType.IN_APP,
                createdAt: timestamp
            });

        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.INTERVIEW_SCHEDULED}`);
        }
    };

    private interviewScheduleAcceptedHandler = async (message: InterviewScheduleAcceptedMessage) => {
        const { applicantId, interviewerId, timestamp } = message;

        try {
            const userSocket = await this.socketManager.getSocketId(interviewerId);

            if (userSocket) {
                this.socket.emit(
                    'new-notification',
                    { message: `The applicant has accepted your interview request.` },
                    userSocket
                );
            }

            await this.notificationService.createNotification({
                sender: applicantId,
                recipient: interviewerId,
                title: "Interview Request Accepted",
                message: `The applicant has accepted your interview request. Please proceed with the next steps.`,
                metadata: {
                    ...message,
                    type: "interview-accepted",
                },
                type: NotificationType.IN_APP,
                createdAt: timestamp,
            });

        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.INTERVIEW_SCHEDULE_ACCEPTED}`);
        }
    };

    private interviewScheduleRejectedHandler = async (message: InterviewScheduleRejectedMessage) => {
        const { applicantId, interviewerId, timestamp } = message;

        try {
            const userSocket = await this.socketManager.getSocketId(interviewerId);

            if (userSocket) {
                this.socket.emit(
                    'new-notification',
                    { message: `The applicant has Rejected your interview request.` },
                    userSocket
                );
            }

            await this.notificationService.createNotification({
                sender: applicantId,
                recipient: interviewerId,
                title: "Interview Request Rejected",
                message: `The applicant has Rejected your interview request. Please proceed with the next steps.`,
                metadata: {
                    ...message,
                    type: "interview-rejected",
                },
                type: NotificationType.IN_APP,
                createdAt: timestamp,
            });

        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.INTERVIEW_SCHEDULE_REJECTED}`);
        }
    };

    private followRequestHandler = async (message: FollowRequestedMessage) => {
        const { followedUserId, followerUserType } = message;
        try {
            const userSocket = await this.socketManager.getSocketId(followedUserId);

            if (userSocket) {
                this.socket.emit('new-notification', { message: `A ${followerUserType} has followed you.` }, userSocket);
            }

        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.FOLLOW_REQUESTED}`);
        }
    }

    private resumeCommentHandler = async (message: ResumeCommentMessage) => {
        const { applicant_user_id, comment, title: job_title, commenter_user_id, job_application_id } = message;
        try {
            const userSocket = await this.socketManager.getSocketId(applicant_user_id);

            if (userSocket) {
                this.socket.emit('new-notification', { message: "A recruiter has commented on your job application." }, userSocket);
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
            if (userSocket) {
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
            if (userSocket) {
                this.socket.emit('job-applied', { message: "Job applied", ...message }, userSocket);
            }
        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.JOB_APPLICATION_ACCEPTED}`);
        }
    }

    private jobPostAcceptedHandler = async (message: JobJobPostAcceptedMessage) => {
        const { user_id } = message
        try {
            const userSocket = await this.socketManager.getSocketId(user_id);
            if (userSocket) {
                this.socket.emit('job-posted', { message: "Job Posted", ...message }, userSocket);
            }
        } catch (error) {
            logger.error("Failed to update job accepted status")
        }
    }
}