import { OnModuleDestroy } from '@nestjs/common';
export declare class EmailService implements OnModuleDestroy {
    private transporter;
    private messageQueue;
    private processing;
    private readonly logger;
    private createTransporter;
    private processQueue;
    sendEmailWithCC(to: string, cc: string, subject: string, html: string): Promise<void>;
    sendEmail(to: string, subject: string, html: string): Promise<void>;
    sendBulkEmails(emails: {
        to: string;
        cc?: string;
        subject: string;
        html: string;
    }[]): Promise<void>;
    private closeConnection;
    onModuleDestroy(): Promise<void>;
}
