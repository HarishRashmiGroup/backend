import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleDestroy {
  private transporter: nodemailer.Transporter;
  private messageQueue: Array<{
    to: string;
    cc?: string;
    subject: string;
    html: string;
  }> = [];
  private processing = false;
  private readonly logger = new Logger(EmailService.name);
  private static instance: EmailService;
  
  constructor() {
    if (EmailService.instance) {
      return EmailService.instance;
    }
    EmailService.instance = this;
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

    this.transporter.on('idle', () => {
      this.processQueue();
    });

    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('SMTP connection error:', error);
      } else {
        this.logger.log('Server is ready to take messages');
      }
    });
  }

  async onModuleDestroy() {
    await this.closeConnection();
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.messageQueue.length === 0) {
      return;
    }

    this.processing = true;

    try {
      while (this.messageQueue.length > 0 && this.transporter.isIdle()) {
        const email = this.messageQueue.shift();
        if (email) {
          try {
            await this.transporter.sendMail({
              from: '"Rashmi Calendar Management" <harish.kumar@rashmigroup.com>',
              ...email,
            });
            this.logger.debug(`Email sent successfully to ${email.to}`);
          } catch (error) {
            this.logger.error(`Failed to send email to ${email.to}:`, error);
            this.messageQueue.push(email);
          }
        }
      }
    } finally {
      this.processing = false;
      if (this.messageQueue.length > 0 && this.transporter.isIdle()) {
        this.processQueue();
      }
    }
  }

  async sendEmailWithCC(to: string, cc: string, subject: string, html: string): Promise<void> {
    try {
      this.messageQueue.push({ to, cc, subject, html });
      if (!this.processing) {
        await this.processQueue();
      }
    } catch (error) {
      this.logger.error('Failed to queue email with CC:', error);
      throw new Error('Email queuing failed');
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      this.messageQueue.push({ to, subject, html });
      if (!this.processing) {
        await this.processQueue();
      }
    } catch (error) {
      this.logger.error('Failed to queue email:', error);
      throw new Error('Email queuing failed');
    }
  }

  async sendBulkEmails(
    emails: { to: string; cc?: string; subject: string; html: string }[],
  ): Promise<void> {
    try {
      this.messageQueue.push(...emails);

      if (!this.processing) {
        await this.processQueue();
      }
    } catch (error) {
      this.logger.error('Failed to queue bulk emails:', error);
      throw new Error('Bulk email queuing failed');
    }
  }

  private async closeConnection(): Promise<void> {
    try {
      await this.transporter.close();
      this.logger.log('Email transport connection closed');
    } catch (error) {
      this.logger.error('Error closing email transport connection:', error);
    }
  }
}