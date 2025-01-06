import { TaskStatus } from "../Tasks/entities/task.entity";

export const createTaskEmailTemplate = (
  beforeTask: any,
  afterTask: any,
  action: 'updated' | 'deleted'
) => {
  const getStatusStyle = (status: string, isOverdue: boolean) => {
    if (status === TaskStatus.COMPLETED) {
      return { bg: '#f0fdf4', text: '#166534' };
    } else if (isOverdue) {
      return { bg: '#fef2f2', text: '#991b1b' };
    } else if (status === 'PAUSED') {
      return { bg: '#f3f4f6', text: '#1f2937' };
    } else {
      return { bg: '#fefce8', text: '#854d0e' };
    }
  };

  const createTaskCard = (task: any, label: string) => {
    const styles = getStatusStyle(task.status, task.isOverdue);

    return `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #4b5563; margin-bottom: 10px;">${label}</h3>
          <div style="
            max-width: 400px;
            background: ${styles.bg};
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            font-family: Arial, sans-serif;
          ">
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px;
              border-bottom: 1px solid rgba(0,0,0,0.1);
            ">
              <div style="
                display: flex;
                align-items: center;
                gap: 8px;
              ">
                <span style="
                  color: ${styles.text};
                  font-size: 12px;
                ">${task.createdBy}</span>
              </div>
            </div>
  
            <div style="padding: 8px;">
              <p style="
                color: ${styles.text};
                font-size: 14px;
                margin: 0;
                word-break: break-word;
              ">${task.description}</p>
  
              <div style="
                margin-top: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              ">
                <span style="
                  color: ${styles.text};
                  font-size: 12px;
                ">${task.responsiblePersonName}</span>
                <span style="
                  color: ${styles.text};
                  font-size: 12px;
                  padding: 4px 8px;
                  border-radius: 9999px;
                  background: ${styles.bg};
                ">${task.status}</span>
              </div>
            </div>
          </div>
        </div>
      `;
  };

  const actionText = action === 'updated' ? 'updated' : 'deleted';
  const template = `
      <!DOCTYPE html>
      <html>
        <body style="
          margin: 0;
          padding: 20px;
          background-color: #f9fafb;
        ">
          <div style="
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          ">
            <h2 style="
              color: #111827;
              margin-bottom: 20px;
            ">Task ${actionText}</h2>
            
            ${action === 'deleted'
      ? createTaskCard(beforeTask, 'Deleted Task')
      : `
                ${createTaskCard(beforeTask, 'Before')}
                ${createTaskCard(afterTask, 'After')}
              `
    }
          </div>
        </body>
      </html>
    `;

  return template;
};

export const commentMailTemplate = (description: string, commenterName: string, taskDescription: string) => {
  const template = `
      <!DOCTYPE html>
      <html>
      <body style="
          margin: 0;
          padding: 0;
          background-color: #f5f6f8;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
      ">
          <div style="
              max-width: 600px;
              margin: 40px auto;
              background: white;
              padding: 32px;
              border-radius: 12px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          ">
              <div style="margin-bottom: 24px;">
                  <h2 style="
                      color: #1f2937;
                      margin: 0 0 8px 0;
                      font-size: 20px;
                      font-weight: 600;
                  ">New Comment on Task</h2>
                  <div style="height: 2px; background: #e5e7eb; width: 50px;"></div>
              </div>

              <div style="
                  background: #f9fafb;
                  padding: 16px;
                  border-radius: 8px;
                  margin-bottom: 24px;
              ">
                  <h3 style="
                      color: #4b5563;
                      margin: 0 0 8px 0;
                      font-size: 16px;
                      font-weight: 500;
                  ">Task Details</h3>
                  <p style="
                      color: #1f2937;
                      margin: 0;
                      font-size: 15px;
                  ">${taskDescription}</p>
              </div>

              <div style="margin-bottom: 24px;">
                  <h3 style="
                      color: #4b5563;
                      margin: 0 0 8px 0;
                      font-size: 16px;
                      font-weight: 500;
                  ">Comment from ${commenterName}</h3>
                  <p style="
                      color: #1f2937;
                      margin: 0;
                      font-size: 15px;
                  ">${description}</p>
              </div>
          </div>
      </body>
      </html>
    `;

  return template;
}

export const otpTemplate = (otp: number) =>{
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <style>
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              font-family: Arial, sans-serif;
              line-height: 1.6;
          }
          .otp-box {
              background-color: #f4f4f4;
              padding: 20px;
              text-align: center;
              border-radius: 5px;
              margin: 20px 0;
          }
          .otp-code {
              font-size: 32px;
              letter-spacing: 5px;
              color: #333;
              font-weight: bold;
          }
          .footer {
              font-size: 12px;
              color: #666;
              text-align: center;
              margin-top: 30px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="otp-box">
              <div class="otp-code">${otp}</div>
          </div>
          <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
          </div>
      </div>
  </body>
  </html>
  `;
}