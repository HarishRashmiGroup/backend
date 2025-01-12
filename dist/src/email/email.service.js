"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.transporter = null;
        this.messageQueue = [];
        this.processing = false;
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    async createTransporter() {
        if (!this.transporter) {
            this.transporter = nodemailer.createTransport({
                host: 'smtp.outlook.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'harish.kumar@rashmigroup.com',
                    pass: process.env.email_password,
                },
                tls: {
                    ciphers: 'SSLv3',
                },
                pool: true,
                maxConnections: 5,
                maxMessages: 100,
                socketTimeout: 60000,
            });
            try {
                await this.transporter.verify();
                this.logger.log('SMTP connection established');
            }
            catch (error) {
                this.logger.error('SMTP connection error:', error);
                this.transporter = null;
                throw error;
            }
        }
        return this.transporter;
    }
    async processQueue() {
        if (this.processing || this.messageQueue.length === 0) {
            return;
        }
        this.processing = true;
        const transporter = await this.createTransporter();
        try {
            while (this.messageQueue.length > 0 && transporter.isIdle()) {
                const email = this.messageQueue.shift();
                if (email) {
                    try {
                        await transporter.sendMail({
                            from: '"Rashmi Calendar Management" <harish.kumar@rashmigroup.com>',
                            ...email,
                        });
                        this.logger.debug(`Email sent successfully to ${email.to}`);
                    }
                    catch (error) {
                        this.logger.error(`Failed to send email to ${email.to}:`, error);
                    }
                }
            }
        }
        finally {
            this.processing = false;
            if (this.messageQueue.length === 0) {
                await this.closeConnection();
            }
            else if (transporter.isIdle()) {
                this.processQueue();
            }
        }
    }
    async sendEmailWithCC(to, cc, subject, html) {
        try {
            this.messageQueue.push({ to, cc, subject, html });
            if (!this.processing) {
                await this.processQueue();
            }
        }
        catch (error) {
            this.logger.error('Failed to queue email with CC:', error);
            throw new Error('Email queuing failed');
        }
    }
    async sendEmail(to, subject, html) {
        try {
            this.messageQueue.push({ to, subject, html });
            if (!this.processing) {
                await this.processQueue();
            }
        }
        catch (error) {
            this.logger.error('Failed to queue email:', error);
            throw new Error('Email queuing failed');
        }
    }
    async sendBulkEmails(emails) {
        try {
            this.messageQueue.push(...emails);
            if (!this.processing) {
                await this.processQueue();
            }
        }
        catch (error) {
            this.logger.error('Failed to queue bulk emails:', error);
            throw new Error('Bulk email queuing failed');
        }
    }
    async closeConnection() {
        try {
            if (this.transporter) {
                await this.transporter.close();
                this.transporter = null;
                this.logger.log('Email transport connection closed');
            }
        }
        catch (error) {
            this.logger.error('Error closing email transport connection:', error);
        }
    }
    async onModuleDestroy() {
        await this.closeConnection();
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=email.service.js.map