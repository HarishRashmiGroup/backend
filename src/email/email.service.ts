import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
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
    });
  }

  async sendEmailWithCC(to: string, cc: string, subject: string, html: string): Promise<void> {
    try {
      const mailOptions = {
        from: '"Rashmi Calendar Management" <harish.kumar@rashmigroup.com>',
        to,
        cc,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Email sending failed');
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const mailOptions = {
        from: '"Rashmi Calendar Management" <harish.kumar@rashmigroup.com>',
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Email sending failed');
    }
  }

  async sendBulkEmails(
    emails: { to: string; cc: string; subject: string; html: string }[],
  ): Promise<void> {
    const emailPromises = emails.map(({ to, cc, subject, html }) =>
      this.transporter.sendMail({
        from: '"Rashmi Calendar Management" <harish.kumar@rashmigroup.com>',
        to,
        cc,
        subject,
        html,
      }),
    );
    await Promise.all(emailPromises);
  }
}
