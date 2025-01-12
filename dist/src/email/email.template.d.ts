export declare const createTaskEmailTemplate: (beforeTask: any, afterTask: any, action: "updated" | "deleted") => string;
export declare const commentMailTemplate: (description: string, commenterName: string, taskDescription: string) => string;
export declare const otpTemplate: (otp: number) => string;
