import nodemailer, { Transporter } from 'nodemailer';
import { IEmailService } from './email.interface';
import {injectable} from 'inversify';
import { InternalError } from "@hireverse/service-common/dist/app.errors";

@injectable()
export class EmailService implements IEmailService {
    private transporter: Transporter;
    private APP_MAIL_ID: string;

    constructor() {
        this.APP_MAIL_ID = process.env.MAIL_ID || '';
        const MAIL_PASSWORD = process.env.MAIL_PASSWORD || '';

        if (!this.APP_MAIL_ID || !MAIL_PASSWORD) {
            throw new Error('SMTP credentials are not set properly: MAIL_ID, MAIL_PASSWORD');
        }

        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: this.APP_MAIL_ID,
                pass: MAIL_PASSWORD,
            },
        });
    }

    /**
     * Sends an email using the configured transporter.
     * @param to - The recipient's email address
     * @param subject - The subject of the email
     * @param text - The text content of the email
     * @param html - The HTML content of the email (optional)
     * @returns A promise that resolves to the result of the email sending operation
     */
    async sendEmail(to: string, subject: string, text: string, html?: string): Promise<any> {
        try {
            const mailOptions = {
                from: this.APP_MAIL_ID,
                to,
                subject,
                text,
                html,  
            };

            const info = await this.transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw new InternalError('Failed to send email');
        }
    }
}

