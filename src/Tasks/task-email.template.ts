import { TaskStatus } from "./entities/task.entity";

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